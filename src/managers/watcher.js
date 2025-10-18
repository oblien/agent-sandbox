/**
 * File Watcher Manager
 * Clean file watching with shared WebSocket connection
 */

export class WatcherManager {
  /**
   * @param {WebSocketConnection} connection - Shared WebSocket connection
   */
  constructor(connection) {
    this.connection = connection;
    this.isWatching = false;
    this.handlers = {
      add: [],
      change: [],
      unlink: [],
      error: []
    };
    
    // Set up event listeners on connection
    this._setupEventListeners();
  }

  /**
   * Setup event listeners on WebSocket connection
   * @private
   */
  _setupEventListeners() {
    this.connection.on('watch_add', (message) => this._emit('add', message.path));
    this.connection.on('watch_change', (message) => this._emit('change', message.path));
    this.connection.on('watch_unlink', (message) => this._emit('unlink', message.path));
    this.connection.on('watch_error', (message) => this._emit('error', message.path));
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
   * Start watching files
   * @param {Object} [options] - Watch options
   * @param {Array<string>} [options.ignorePatterns] - Patterns to ignore
   * @param {Function} [options.onChange] - Change callback
   * @param {Function} [options.onAdd] - Add callback
   * @param {Function} [options.onUnlink] - Unlink callback
   * @param {Function} [options.onError] - Error callback
   * @returns {Promise<void>}
   * 
   * @example
   * ```javascript
   * await sandbox.watcher.start({
   *   ignorePatterns: ['node_modules', 'dist', '.git'],
   *   onChange: (path) => console.log('File changed:', path),
   *   onAdd: (path) => console.log('File added:', path),
   *   onUnlink: (path) => console.log('File deleted:', path)
   * });
   * ```
   */
  async start(options = {}) {
    if (this.isWatching) {
      console.warn('[Watcher] Already watching files');
      return;
    }

    await this._ensureConnected();

    // Send watch start message
    this.connection.send({
      type: 'watch',
      ignorePatterns: options.ignorePatterns || []
    });

    this.isWatching = true;

    // Register callbacks if provided
    if (options.onChange) this.on('change', options.onChange);
    if (options.onAdd) this.on('add', options.onAdd);
    if (options.onUnlink) this.on('unlink', options.onUnlink);
    if (options.onError) this.on('error', options.onError);

    console.log('[Watcher] Started watching files');
  }

  /**
   * Stop watching files
   * 
   * @example
   * ```javascript
   * sandbox.watcher.stop();
   * ```
   */
  stop() {
    if (!this.isWatching) {
      return;
    }

    if (this.connection.connected) {
      this.connection.send({
        type: 'stop_watch'
      });
    }

    this.isWatching = false;

    // Clear all handlers
    this.handlers = {
      add: [],
      change: [],
      unlink: [],
      error: []
    };

    console.log('[Watcher] Stopped watching files');
  }

  /**
   * Register event handler
   * @param {string} event - Event type (add, change, unlink, error)
   * @param {Function} handler - Handler function
   * 
   * @example
   * ```javascript
   * sandbox.watcher.on('change', (path) => {
   *   console.log('File changed:', path);
   * });
   * ```
   */
  on(event, handler) {
    if (!this.handlers[event]) {
      console.warn(`[Watcher] Unknown event type: ${event}`);
      return;
    }
    this.handlers[event].push(handler);
  }

  /**
   * Remove event handler
   * @param {string} event - Event type
   * @param {Function} handler - Handler function
   * 
   * @example
   * ```javascript
   * const handler = (path) => console.log(path);
   * sandbox.watcher.on('change', handler);
   * // Later...
   * sandbox.watcher.off('change', handler);
   * ```
   */
  off(event, handler) {
    if (!this.handlers[event]) {
      return;
    }
    
    const index = this.handlers[event].indexOf(handler);
    if (index > -1) {
      this.handlers[event].splice(index, 1);
    }
  }

  /**
   * Emit event to all registered handlers
   * @private
   */
  _emit(event, ...args) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`[Watcher] Error in ${event} handler:`, error);
        }
      });
    }
  }

  /**
   * Check if watcher is active
   * @returns {boolean}
   */
  get active() {
    return this.isWatching;
  }

  /**
   * Disconnect WebSocket (use with caution)
   */
  disconnect() {
    this.stop();
    this.connection.disconnect();
  }
}
