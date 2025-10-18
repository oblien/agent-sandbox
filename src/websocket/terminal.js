/**
 * Terminal Manager for WebSocket-based terminal operations
 */

export class TerminalManager {
  constructor(wsClient) {
    this.ws = wsClient;
    this.terminals = new Map();
  }

  /**
   * Create a new terminal
   * @param {Object} options - Terminal options
   * @param {number} [options.terminalId] - Terminal ID (auto-generated if not provided)
   * @param {number} [options.cols=80] - Terminal columns
   * @param {number} [options.rows=24] - Terminal rows
   * @param {string} [options.cwd] - Working directory
   * @param {string} [options.command] - Command to execute
   * @param {Array<string>} [options.args] - Command arguments
   * @param {boolean} [options.task] - Run as task
   * @param {boolean} [options.force] - Force recreate if exists
   * @param {Function} [options.onData] - Data callback
   * @param {Function} [options.onExit] - Exit callback
   * @returns {Promise<Terminal>} Terminal instance
   */
  async create(options = {}) {
    const response = await this.ws.sendRequest({
      action: 'terminal_create',
      terminalId: options.terminalId,
      cols: options.cols || 80,
      rows: options.rows || 24,
      cwd: options.cwd,
      command: options.command,
      args: options.args || [],
      task: options.task,
      force: options.force
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }

    const terminal = new Terminal(this.ws, response.terminalId, options);
    this.terminals.set(response.terminalId, terminal);

    return terminal;
  }

  /**
   * Get list of active terminals
   * @returns {Promise<Array>} List of terminal IDs
   */
  async list() {
    const response = await this.ws.sendRequest({
      action: 'terminal_list'
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }

    return response.terminals || [];
  }

  /**
   * Get existing terminal by ID
   * @param {number} terminalId - Terminal ID
   * @returns {Terminal|null} Terminal instance
   */
  get(terminalId) {
    return this.terminals.get(terminalId) || null;
  }

  /**
   * Close a terminal
   * @param {number} terminalId - Terminal ID
   * @param {boolean} [force=true] - Force close
   * @returns {Promise<void>}
   */
  async close(terminalId, force = true) {
    const response = await this.ws.sendRequest({
      action: 'terminal_close',
      terminalId,
      force
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }

    this.terminals.delete(terminalId);
  }
}

/**
 * Terminal instance representing a single terminal
 */
export class Terminal {
  constructor(wsClient, terminalId, options = {}) {
    this.ws = wsClient;
    this.id = terminalId;
    this.onDataCallback = options.onData;
    this.onExitCallback = options.onExit;

    // Listen for terminal output
    this.ws.on(`terminal:${this.id}`, (output) => {
      if (this.onDataCallback) {
        const text = new TextDecoder().decode(output);
        this.onDataCallback(text);
      }
    });

    // Listen for terminal events
    this.ws.on('terminal_exited', (message) => {
      if (message.terminalId === this.id && this.onExitCallback) {
        this.onExitCallback(message.exitCode, message.signal);
      }
    });
  }

  /**
   * Write data to terminal
   * @param {string} data - Data to write
   */
  write(data) {
    this.ws.send({
      a: 'i',  // action: input
      id: this.id,
      d: data
    });
  }

  /**
   * Resize terminal
   * @param {number} cols - Columns
   * @param {number} rows - Rows
   * @returns {Promise<void>}
   */
  async resize(cols, rows) {
    const response = await this.ws.sendRequest({
      a: 'r',  // action: resize
      id: this.id,
      cols,
      rows
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }
  }

  /**
   * Get terminal state
   * @param {Object} [options] - State options
   * @param {boolean} [options.newOnly=false] - Get only new content
   * @param {number} [options.maxLines=100] - Max lines to return
   * @param {string} [options.direction='bottom'] - Direction (top/bottom)
   * @returns {Promise<string>} Terminal state (base64)
   */
  async getState(options = {}) {
    const response = await this.ws.sendRequest({
      action: 'get_state',
      id: this.id,
      newOnly: options.newOnly || false,
      maxLines: options.maxLines || 100,
      direction: options.direction || 'bottom'
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }

    return response.state;
  }

  /**
   * Set data callback
   * @param {Function} callback - Callback function
   */
  onData(callback) {
    this.onDataCallback = callback;
  }

  /**
   * Set exit callback
   * @param {Function} callback - Callback function
   */
  onExit(callback) {
    this.onExitCallback = callback;
  }

  /**
   * Close this terminal
   * @param {boolean} [force=true] - Force close
   * @returns {Promise<void>}
   */
  async close(force = true) {
    const response = await this.ws.sendRequest({
      action: 'terminal_close',
      terminalId: this.id,
      force
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }
  }
}

