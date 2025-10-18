/**
 * Terminal Manager - Direct API for terminal operations
 * Automatically manages WebSocket connection internally
 */

import { WebSocketClient } from '../websocket/client.js';

export class TerminalManager {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.ws = null;
    this.terminals = new Map();
  }

  /**
   * Ensure WebSocket is connected
   * @private
   */
  async ensureConnected() {
    if (this.ws?.isConnected) {
      return;
    }

    this.ws = new WebSocketClient(this.baseURL, this.token);
    await this.ws.connect({ binary: true });
  }

  /**
   * Create a new terminal
   * @param {Object} [options] - Terminal options
   * @param {number} [options.cols=120] - Terminal columns
   * @param {number} [options.rows=30] - Terminal rows
   * @param {string} [options.cwd] - Working directory
   * @param {string} [options.command] - Command to execute
   * @param {Array<string>} [options.args] - Command arguments
   * @param {boolean} [options.task] - Run as task
   * @param {Function} [options.onData] - Data callback
   * @param {Function} [options.onExit] - Exit callback
   * @returns {Promise<Terminal>} Terminal instance
   * 
   * @example
   * ```javascript
   * const terminal = await sandbox.terminal.create({
   *   onData: (data) => console.log(data),
   *   onExit: (code) => console.log('Exit:', code)
   * });
   * 
   * terminal.write('npm install\n');
   * ```
   */
  async create(options = {}) {
    await this.ensureConnected();

    const response = await this.ws.sendRequest({
      action: 'terminal_create',
      cols: options.cols || 120,
      rows: options.rows || 30,
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
   * List active terminals
   * @returns {Promise<Array>} Terminal list
   */
  async list() {
    await this.ensureConnected();

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
    await this.ensureConnected();

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

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.ws.disconnect();
      this.ws = null;
    }
  }
}

/**
 * Terminal instance
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

    // Listen for terminal exit
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
      a: 'i',
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
      a: 'r',
      id: this.id,
      cols,
      rows
    });

    if (response.type === 'terminal_error') {
      throw new Error(response.message);
    }
  }

  /**
   * Get terminal state/output
   * @param {Object} [options] - State options
   * @param {boolean} [options.newOnly=false] - Get only new content
   * @param {number} [options.maxLines=100] - Max lines
   * @param {string} [options.direction='bottom'] - Direction
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
   * Close terminal
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

