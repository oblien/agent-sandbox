/**
 * File Watcher Manager for WebSocket-based file watching
 */

export class FileWatcher {
  constructor(wsClient) {
    this.ws = wsClient;
    this.isWatching = false;
    this.handlers = {
      add: [],
      change: [],
      unlink: [],
      error: []
    };

    // Listen for watch events
    this.ws.on('watch_add', (message) => this.emit('add', message.path));
    this.ws.on('watch_change', (message) => this.emit('change', message.path));
    this.ws.on('watch_unlink', (message) => this.emit('unlink', message.path));
    this.ws.on('watch_error', (message) => this.emit('error', message.path));
  }

  /**
   * Start watching files
   * @param {Object} [options] - Watch options
   * @param {Array<string>} [options.ignorePatterns] - Patterns to ignore
   * @param {Function} [options.onChange] - Change callback
   * @param {Function} [options.onAdd] - Add callback
   * @param {Function} [options.onUnlink] - Unlink callback
   * @param {Function} [options.onError] - Error callback
   */
  start(options = {}) {
    if (this.isWatching) {
      console.warn('File watcher already started');
      return;
    }

    this.ws.send({
      type: 'watch',
      ignorePatterns: options.ignorePatterns || []
    });

    this.isWatching = true;

    // Register callbacks
    if (options.onChange) this.on('change', options.onChange);
    if (options.onAdd) this.on('add', options.onAdd);
    if (options.onUnlink) this.on('unlink', options.onUnlink);
    if (options.onError) this.on('error', options.onError);
  }

  /**
   * Stop watching files
   */
  stop() {
    if (!this.isWatching) {
      return;
    }

    this.ws.send({
      type: 'stop_watch'
    });

    this.isWatching = false;

    // Clear all handlers
    this.handlers = {
      add: [],
      change: [],
      unlink: [],
      error: []
    };
  }

  /**
   * Register event handler
   * @param {string} event - Event type (add, change, unlink, error)
   * @param {Function} handler - Event handler
   */
  on(event, handler) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }

  /**
   * Remove event handler
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  off(event, handler) {
    if (this.handlers[event]) {
      const index = this.handlers[event].indexOf(handler);
      if (index > -1) {
        this.handlers[event].splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   * @private
   */
  emit(event, ...args) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in ${event} handler:`, error);
        }
      });
    }
  }
}

