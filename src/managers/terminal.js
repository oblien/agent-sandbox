/**
 * Terminal Manager
 * Clean terminal management with shared WebSocket connection
 * Terminal list is fetched from backend, not stored locally
 */

/**
 * Terminal Manager - Manages terminal operations
 */
export class TerminalManager {
  /**
   * @param {WebSocketConnection} connection - Shared WebSocket connection
   */
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Ensure WebSocket is connected
   * @private
   */
  async _ensureConnected() {
    if (!this.connection.connected) {
      await this.connection.connect();
    }
  }

  /**
   * Execute a command and get the result (one-off execution)
   * @param {Object} options - Execution options
   * @param {string} options.command - Command to execute
   * @param {Array<string>} [options.args] - Command arguments
   * @param {string} [options.cwd] - Working directory
   * @param {number} [options.timeout=30000] - Execution timeout
   * @param {number} [options.terminalId=0] - Terminal ID to use
   * @returns {Promise<string>} Command output (stripped of ANSI codes)
   * 
   * @example
   * ```javascript
   * // Simple command execution
   * const output = await sandbox.terminal.execute({
   *   command: 'npm install'
   * });
   * console.log(output);
   * 
   * // With arguments
   * const files = await sandbox.terminal.execute({
   *   command: 'ls',
   *   args: ['-la', '/opt/app']
   * });
   * ```
   */
  async execute(options) {
    if (!options.command) {
      throw new Error('command is required');
    }

    await this._ensureConnected();

    const message = {
      action: 'terminal_create',
      terminalId: options.terminalId || 0,
      command: options.command,
      args: options.args || [],
      task: true,
      force: true,
      withLogs: true,
      awaitFinish: true,
      timeout: options.timeout || 30000,
      cols: 120,
      rows: 30
    };

    if (options.cwd) message.cwd = options.cwd;

    const response = await this.connection.sendRequest(message);

    if (response.error) {
      return response
    }
    
    return {
      exitCode: response.exit?.code?.exitCode || response.exit?.code || response.exitCode || 0,
      signal: response.exit?.code?.signal || response.exit?.signal || response.signal || 0,
      logs: Buffer.from(response.logs || '', 'base64').toString('utf-8')
    };
  }

  /**
   * Create a new interactive terminal (live access with callbacks)
   * @param {Object} [options] - Terminal options
   * @param {number} [options.terminalId] - Specific terminal ID (auto-generated if not provided)
   * @param {number} [options.cols=120] - Terminal columns
   * @param {number} [options.rows=30] - Terminal rows
   * @param {string} [options.cwd] - Working directory
   * @param {Function} [options.onData] - Data callback for real-time output
   * @param {Function} [options.onExit] - Exit callback
   * @returns {Promise<Terminal>} Terminal instance for interactive use
   * 
   * @example
   * ```javascript
   * // Interactive terminal with real-time output
   * const terminal = await sandbox.terminal.create({
   *   onData: (data) => process.stdout.write(data),
   *   onExit: (code, signal) => console.log('Exited:', code)
   * });
   * 
   * // Write commands
   * terminal.write('cd /opt/app\n');
   * terminal.write('npm install\n');
   * 
   * // Later...
   * await terminal.close();
   * ```
   */
  async create(options = {}) {
    await this._ensureConnected();

    // Build message for interactive terminal
    const message = {
      action: 'terminal_create',
      cols: options.cols || 120,
      rows: options.rows || 30,
      force: options.force || false
    };

    // Only include optional fields if provided
    if (options.terminalId !== undefined) message.terminalId = options.terminalId;
    if (options.cwd) message.cwd = options.cwd;

    const response = await this.connection.sendRequest(message);

    if (response.error) {
      return response
    }

    // Create interactive terminal instance
    const terminal = new Terminal(this.connection, response.terminalId, options);
    
    // Store response data
    terminal.cols = response.cols;
    terminal.rows = response.rows;
    terminal.cwd = response.cwd;
    terminal.existing = response.existing || false;

    return terminal;
  }

  /**
   * List active terminals (fetched from backend)
   * @returns {Promise<Array>} Terminal list
   * 
   * @example
   * ```javascript
   * const terminals = await sandbox.terminal.list();
   * console.log(terminals); // [{ id: 1 }, { id: 2 }]
   * ```
   */
  async list() {
    await this._ensureConnected();

    const response = await this.connection.sendRequest({
      action: 'terminal_list'
    });

    if (response.error) {
      return response
    }

    return response.terminals || [];
  }

  /**
   * Get existing terminal by ID
   * @param {number} terminalId - Terminal ID
   * @param {Object} [options] - Terminal options
   * @param {Function} [options.onData] - Data callback
   * @param {Function} [options.onExit] - Exit callback
   * @returns {Terminal} Terminal instance
   * 
   * @example
   * ```javascript
   * const terminal = sandbox.terminal.get(1, {
   *   onData: (data) => console.log(data)
   * });
   * terminal.write('ls\n');
   * ```
   */
  get(terminalId, options = {}) {
    return new Terminal(this.connection, terminalId, options);
  }

  /**
   * Close a terminal
   * @param {number} terminalId - Terminal ID
   * @param {boolean} [force=true] - Force close
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await sandbox.terminal.close(1);
   * ```
   */
  async close(terminalId, force = true) {
    await this._ensureConnected();

    const response = await this.connection.sendRequest({
      action: 'terminal_close',
      terminalId,
      force
    });

    if (response.type === 'terminal_error' || response.error) {
      return response
    }
    
    if (response.type === 'terminal_closed') {
      return true;
    }
    
    return false;
  }

  /**
   * Disconnect WebSocket (use with caution)
   */
  disconnect() {
    this.connection.disconnect();
  }
}

/**
 * Terminal instance representing a single terminal
 */
export class Terminal {
  /**
   * @param {WebSocketConnection} connection - WebSocket connection
   * @param {number} terminalId - Terminal ID
   * @param {Object} [options] - Terminal options
   * @param {Function} [options.onData] - Data callback
   * @param {Function} [options.onExit] - Exit callback
   */
  constructor(connection, terminalId, options = {}) {
    this.connection = connection;
    this.id = terminalId;
    this.onDataCallback = options.onData;
    this.onExitCallback = options.onExit;
    this._dataHandler = null;
    this._exitHandler = null;

    // Set up event listeners if callbacks provided
    if (this.onDataCallback) {
      this._dataHandler = (output) => {
        const text = new TextDecoder().decode(output);
        this.onDataCallback(text);
      };
      this.connection.on(`terminal:${this.id}`, this._dataHandler);
    }

    if (this.onExitCallback) {
      this._exitHandler = (message) => {
        if (message.terminalId === this.id) {
          this.onExitCallback(message.exitCode, message.signal);
          // Clean up listeners after exit
          this._cleanup();
        }
      };
      this.connection.on('terminal_exited', this._exitHandler);
    }
  }

  /**
   * Write data to terminal
   * @param {string} data - Data to write
   * 
   * @example
   * ```javascript
   * terminal.write('ls -la\n');
   * ```
   */
  write(data) {
    this.connection.send({
      a: 'i', // action: input
      id: this.id,
      d: data
    });
  }

  /**
   * Resize terminal
   * @param {number} cols - Columns
   * @param {number} rows - Rows
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await terminal.resize(100, 50);
   * ```
   */
  async resize(cols, rows) {
    const response = await this.connection.sendRequest({
      a: 'r', // action: resize
      id: this.id,
      cols,
      rows
    });

    if (response.type === 'terminal_error' || response.error) {
      return response
    }
    
    if (response.type === 'terminal_resized') {
      this.cols = response.cols;
      this.rows = response.rows;
    }
  }

  /**
   * Get terminal state/output
   * @param {Object} [options] - State options
   * @param {boolean} [options.newOnly=false] - Get only new content since last fetch
   * @param {number} [options.maxLines=100] - Maximum lines to return
   * @param {string} [options.direction='bottom'] - Direction to get lines (top/bottom)
   * @returns {Promise<string>} Terminal state (base64 encoded)
   * 
   * @example
   * ```javascript
   * const state = await terminal.getState({ newOnly: true });
   * const output = Buffer.from(state, 'base64').toString('utf-8');
   * console.log(output);
   * ```
   */
  async getState(options = {}) {
    const response = await this.connection.sendRequest({
      action: 'get_state',
      id: this.id,
      newOnly: options.newOnly || false,
      maxLines: options.maxLines || 100,
      direction: options.direction || 'bottom'
    });

    if (response.type === 'terminal_error' || response.error) {
      return response
    }

    if (response.type !== 'terminal_state') {
      return response
    }

    return {
      state: response.state,
      newOnly: response.newOnly,
      hasNewContent: response.hasNewContent,
      linesCount: response.linesCount
    };
  }

  /**
   * Set or update data callback
   * @param {Function} callback - Callback function
   * 
   * @example
   * ```javascript
   * terminal.onData((data) => {
   *   console.log('Terminal output:', data);
   * });
   * ```
   */
  onData(callback) {
    // Remove old handler if exists
    if (this._dataHandler) {
      this.connection.off(`terminal:${this.id}`, this._dataHandler);
    }
    
    // Set new handler
    this.onDataCallback = callback;
    this._dataHandler = (output) => {
      const text = new TextDecoder().decode(output);
      this.onDataCallback(text);
    };
    this.connection.on(`terminal:${this.id}`, this._dataHandler);
  }

  /**
   * Set or update exit callback
   * @param {Function} callback - Callback function
   * 
   * @example
   * ```javascript
   * terminal.onExit((code, signal) => {
   *   console.log('Terminal exited:', code, signal);
   * });
   * ```
   */
  onExit(callback) {
    // Remove old handler if exists
    if (this._exitHandler) {
      this.connection.off('terminal_exited', this._exitHandler);
    }
    
    // Set new handler
    this.onExitCallback = callback;
    this._exitHandler = (message) => {
      if (message.terminalId === this.id) {
        this.onExitCallback(message.exitCode, message.signal);
        this._cleanup();
      }
    };
    this.connection.on('terminal_exited', this._exitHandler);
  }

  /**
   * Close this terminal
   * @param {boolean} [force=true] - Force close
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await terminal.close();
   * ```
   */
  async close(force = true) {
    const response = await this.connection.sendRequest({
      action: 'terminal_close',
      terminalId: this.id,
      force
    });

    if (response.type === 'terminal_error' || response.error) {
      return response
    }

    if (response.type === 'terminal_closed') {
      // Clean up listeners
      this._cleanup();
    }
  }

  /**
   * Clean up event listeners
   * @private
   */
  _cleanup() {
    if (this._dataHandler) {
      this.connection.off(`terminal:${this.id}`, this._dataHandler);
      this._dataHandler = null;
    }
    if (this._exitHandler) {
      this.connection.off('terminal_exited', this._exitHandler);
      this._exitHandler = null;
    }
  }
}
