/**
 * WebSocket Connection Manager
 * Central WebSocket connection handler for sandbox with retry logic and status checking
 * One connection per sandbox instance
 */

export class WebSocketConnection {
  /**
   * @param {Object} config - Connection configuration
   * @param {string} config.baseURL - Sandbox base URL
   * @param {string} config.token - Sandbox authentication token
   * @param {string} [config.sandboxId] - Sandbox ID
   * @param {Function} [config.onStatusCheck] - Function to check if sandbox is active
   */
  constructor(config) {
    this.baseURL = config.baseURL;
    this.token = config.token;
    this.sandboxId = config.sandboxId;
    this.onStatusCheck = config.onStatusCheck;
    
    // Connection state
    this.ws = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.shouldReconnect = true;
    
    // Retry configuration
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.baseReconnectDelay = 1000; // 1 second
    this.maxReconnectDelay = 30000; // 30 seconds
    this.reconnectTimeout = null;
    
    // Request/response handling
    this.pendingRequests = new Map();
    this.requestTimeout = 30000; // 30 seconds
    
    // Event handling
    this.eventHandlers = new Map();
    
    // Connection options
    this.connectionOptions = {
      binary: true,
      silent: false
    };
  }

  /**
   * Connect to WebSocket with retry logic
   * @param {Object} [options] - Connection options
   * @param {boolean} [options.binary] - Enable binary mode
   * @param {boolean} [options.silent] - Silent mode (no broadcasts)
   * @returns {Promise<void>}
   */
  async connect(options = {}) {
    // Merge options
    this.connectionOptions = { ...this.connectionOptions, ...options };
    
    // Check if already connected
    if (this.isConnected) {
      return;
    }
    
    // Check if already connecting
    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.isConnected) {
            clearInterval(checkInterval);
            resolve();
          } else if (!this.isConnecting) {
            clearInterval(checkInterval);
            reject(new Error('Connection failed'));
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Connection timeout'));
        }, 10000);
      });
    }
    
    // Check sandbox status before connecting
    if (this.onStatusCheck) {
      try {
        const isActive = await this.onStatusCheck();
        if (!isActive) {
          throw new Error('Sandbox is not active');
        }
      } catch (error) {
        console.error('Sandbox status check failed:', error.message);
        throw error;
      }
    }
    
    return this._connect();
  }

  /**
   * Internal connection logic
   * @private
   */
  async _connect() {
    return new Promise((resolve, reject) => {
      this.isConnecting = true;
      
      try {
        // Remove path and trailing slash from baseURL
        let wsUrl = this.baseURL.replace(/^http/, 'ws').replace(/\/$/, '');
        
        const queryParams = new URLSearchParams();
        
        // Add token as query parameter (works in both Node.js and browser)
        queryParams.append('token', this.token);
        
        if (this.connectionOptions.binary) {
          queryParams.append('binary', 'true');
        }
        
        if (this.connectionOptions.silent) {
          queryParams.append('silent', 'true');
        }
        
        const fullUrl = `${wsUrl}?${queryParams.toString()}`;
        

        
        // Check if we're in Node.js or browser
        const isNode = typeof process !== 'undefined' && process.versions?.node;
        
        if (isNode) {
          // Node.js: Can also use Authorization header
          this.ws = new WebSocket(fullUrl, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              ...(this.connectionOptions.silent && { 'x-notify-type': 'silent' })
            }
          });
        } else {
          // Browser: No custom headers support
          this.ws = new WebSocket(fullUrl);
        }

        this.ws.binaryType = 'arraybuffer';

        // Connection opened
        this.ws.onopen = () => {

        };

        // Handle messages
        this.ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this._handleBinaryMessage(event.data);
          } else {
            this._handleTextMessage(event.data);
          }
        };

        // Handle errors
        this.ws.onerror = (error) => {
            this.emit('error', error);
        };

        // Handle close
        this.ws.onclose = (event) => {
          const wasConnected = this.isConnected;
          this.isConnected = false;
          this.isConnecting = false;
          
          this.emit('close', { code: event.code, reason: event.reason });
          
          // Attempt reconnection if needed
          if (this.shouldReconnect && wasConnected) {
            this._scheduleReconnect();
          }
        };

        // Wait for connection confirmation
        const connectionTimeout = setTimeout(() => {
          this.isConnecting = false;
          reject(new Error('Connection timeout - no confirmation received'));
        }, 10000);
        
        this.once('connected', () => {
          clearTimeout(connectionTimeout);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0; // Reset on successful connection
          resolve();
        });
        
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Schedule reconnection with exponential backoff
   * @private
   */
  _scheduleReconnect() {
    // Clear any existing timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    // Check if we've exceeded max attempts
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('reconnect_failed');
      return;
    }
    
    // Calculate delay with exponential backoff
    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    
    this.reconnectAttempts++;
    
    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect(this.connectionOptions);
        this.emit('reconnected');
      } catch (error) {
        this._scheduleReconnect();
      }
    }, delay);
  }

  /**
   * Handle text messages
   * @private
   */
  _handleTextMessage(data) {
    try {
      const message = JSON.parse(data);
      
      
      // Handle connection confirmation
      if (message.type === 'connected') {
        this.emit('connected', message);
        return;
      }

      // Handle request responses (with requestId)
      if (message.requestId && this.pendingRequests.has(message.requestId)) {
        const { resolve, timeout, expectedTypes } = this.pendingRequests.get(message.requestId);
        
        // If expectedTypes is specified, only resolve on matching type
        if (expectedTypes && expectedTypes.length > 0) {
          if (expectedTypes.includes(message.type)) {
            clearTimeout(timeout);
            this.pendingRequests.delete(message.requestId);
            resolve(message);
            return;
          }
          // Not the expected type, emit as event but don't resolve
        } else {
          // No expected types, resolve on any message with requestId
          clearTimeout(timeout);
          this.pendingRequests.delete(message.requestId);
          resolve(message);
          return;
        }
      }

      // Emit event for general listeners
      this.emit(message.type, message);
    } catch (error) {
    }
  }

  /**
   * Handle binary messages (terminal output)
   * @private
   */
  _handleBinaryMessage(data) {
    const buffer = new Uint8Array(data);
    const terminalId = buffer[0];
    const output = buffer.slice(1);
    
    // Emit to terminal-specific handler
    this.emit(`terminal:${terminalId}`, output);
    
    // Emit to generic binary handler
    this.emit('binary', { terminalId, output });
  }

  /**
   * Send request and wait for response
   * @param {Object} message - Message to send
   * @param {Array<string>} [expectedTypes] - Expected response types (resolves on first match)
   * @returns {Promise<Object>} Response message
   */
  async sendRequest(message, expectedTypes = null) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    return new Promise((resolve, reject) => {
      // Generate UUID for request ID
      const requestId = this._generateRequestId();
      const fullMessage = { ...message, requestId };

      // Determine expected response types based on action
      if (!expectedTypes) {
        expectedTypes = this._getExpectedResponseTypes(message.action || message.type);
      }

      // Set timeout for request
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, this.requestTimeout);

      this.pendingRequests.set(requestId, { resolve, reject, timeout, expectedTypes });
      
      try {
        this.ws.send(JSON.stringify(fullMessage));
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(requestId);
        reject(error);
      }
    });
  }

  /**
   * Generate unique request ID (UUID v4)
   * @private
   */
  _generateRequestId() {
    // Check if we're in Node.js or browser
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    } else if (typeof randomUUID !== 'undefined') {
      return randomUUID();
    } else {
      // Fallback for older environments
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  /**
   * Get expected response types for a request action
   * @private
   */
  _getExpectedResponseTypes(action) {
    const responseMap = {
      'terminal_create': ['terminal_created', 'terminal_error'],
      'terminal_close': ['terminal_closed', 'terminal_error'],
      'terminal_list': ['terminal_list', 'terminal_error'],
      'get_state': ['terminal_state', 'terminal_error'],
      'i': null, // input - no response expected
      'r': ['terminal_resized', 'terminal_error']
    };

    return responseMap[action] || null;
  }

  /**
   * Send message without waiting for response
   * @param {Object} message - Message to send
   */
  send(message) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Handler function
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Register one-time event handler
   * @param {string} event - Event name
   * @param {Function} handler - Handler function
   */
  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /**
   * Remove event handler
   * @param {string} event - Event name
   * @param {Function} handler - Handler function
   */
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   * @private
   */
  emit(event, ...args) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(...args);
        } catch (error) {

        }
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    this.shouldReconnect = false;
    
    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Reject all pending requests
    this.pendingRequests.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(new Error('Connection closed'));
    });
    this.pendingRequests.clear();
    
    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    

}

  /**
   * Check if connected
   * @returns {boolean}
   */
  get connected() {
    return this.isConnected;
  }
}

