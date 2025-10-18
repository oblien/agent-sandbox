import { BaseAPI } from './base.js';
import { WebSocketClient } from '../websocket/client.js';
import { TerminalManager } from '../websocket/terminal.js';
import { FileWatcher } from '../websocket/watcher.js';

/**
 * WebSocket API - Real-time communication with sandbox
 * Handles terminal operations and file watching
 */
export class WebSocketAPI extends BaseAPI {
  constructor(baseURL, token) {
    super(baseURL, token);
    this._wsClient = null;
    this._terminal = null;
    this._watcher = null;
  }

  /**
   * Create WebSocket connection
   * @param {Object} [options] - Connection options
   * @param {boolean} [options.binary] - Enable binary mode
   * @param {boolean} [options.silent] - Silent mode
   * @returns {Promise<WebSocketConnection>} WebSocket connection
   * 
   * @example
   * ```javascript
   * const ws = await sandbox.websocket.connect();
   * 
   * // Create terminal
   * const terminal = await ws.terminal.create({
   *   cols: 80,
   *   rows: 24,
   *   onData: (data) => console.log(data),
   *   onExit: (code) => console.log('Exited:', code)
   * });
   * 
   * // Write to terminal
   * terminal.write('ls -la\n');
   * 
   * // Start file watcher
   * ws.watcher.start({
   *   onChange: (path) => console.log('Changed:', path)
   * });
   * ```
   */
  async connect(options = {}) {
    if (this._wsClient && this._wsClient.isConnected) {
      return this;
    }

    this._wsClient = new WebSocketClient(this.baseURL, this.token);
    this._terminal = new TerminalManager(this._wsClient);
    this._watcher = new FileWatcher(this._wsClient);

    await this._wsClient.connect(options);

    return this;
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this._wsClient) {
      this._wsClient.disconnect();
      this._wsClient = null;
      this._terminal = null;
      this._watcher = null;
    }
  }

  /**
   * Get terminal manager
   * @returns {TerminalManager} Terminal manager
   */
  get terminal() {
    if (!this._terminal) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    return this._terminal;
  }

  /**
   * Get file watcher
   * @returns {FileWatcher} File watcher
   */
  get watcher() {
    if (!this._watcher) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    return this._watcher;
  }

  /**
   * Get raw WebSocket client
   * @returns {WebSocketClient} WebSocket client
   */
  get client() {
    return this._wsClient;
  }

  /**
   * Check if connected
   * @returns {boolean} Connection status
   */
  get isConnected() {
    return this._wsClient?.isConnected || false;
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  on(event, handler) {
    if (!this._wsClient) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    this._wsClient.on(event, handler);
  }

  /**
   * Remove event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  off(event, handler) {
    if (!this._wsClient) {
      throw new Error('WebSocket not connected. Call connect() first.');
    }
    this._wsClient.off(event, handler);
  }
}


