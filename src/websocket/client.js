/**
 * WebSocket Client for real-time sandbox communication
 * Handles terminal operations and file watching
 */

export class WebSocketClient {
  /**
   * @param {string} url - Sandbox WebSocket URL
   * @param {string} token - Sandbox token
   */
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.isConnected = false;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.eventHandlers = new Map();
    this.binaryHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to WebSocket
   * @param {Object} [options] - Connection options
   * @param {boolean} [options.binary] - Enable binary mode
   * @param {boolean} [options.silent] - Silent mode (no broadcasts)
   * @returns {Promise<void>}
   */
  async connect(options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.url.replace(/^http/, 'ws');
        const queryParams = new URLSearchParams();
        if (options.binary) queryParams.append('binary', 'true');
        
        const fullUrl = `${wsUrl}?${queryParams.toString()}`;
        
        this.ws = new WebSocket(fullUrl, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            ...(options.silent && { 'x-notify-type': 'silent' })
          }
        });

        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log('WebSocket connected');
        };

        this.ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
          } else {
            this.handleTextMessage(event.data);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.emit('close');
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect(options);
            }, this.reconnectDelay * this.reconnectAttempts);
          }
        };

        // Wait for connection confirmation
        this.once('connected', () => resolve());
        
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle text messages
   * @private
   */
  handleTextMessage(data) {
    try {
      const message = JSON.parse(data);
      
      // Handle connection confirmation
      if (message.type === 'connected') {
        this.emit('connected', message);
        return;
      }

      // Handle request responses
      if (message.requestId && this.pendingRequests.has(message.requestId)) {
        const { resolve } = this.pendingRequests.get(message.requestId);
        this.pendingRequests.delete(message.requestId);
        resolve(message);
        return;
      }

      // Emit event for listeners
      this.emit(message.type, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  /**
   * Handle binary messages (terminal output)
   * @private
   */
  handleBinaryMessage(data) {
    const buffer = new Uint8Array(data);
    const terminalId = buffer[0];
    const output = buffer.slice(1);
    
    // Emit to terminal-specific handler
    this.emit(`terminal:${terminalId}`, output);
    
    // Emit to generic binary handler
    this.emit('binary', { terminalId, output });
  }

  /**
   * Send a message and wait for response
   * @private
   */
  async sendRequest(message) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const requestId = ++this.requestId;
      const fullMessage = { ...message, requestId };

      this.pendingRequests.set(requestId, { resolve, reject });
      this.ws.send(JSON.stringify(fullMessage));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  /**
   * Send a message without waiting for response
   * @private
   */
  send(message) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Register one-time event handler
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
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.maxReconnectAttempts = 0; // Prevent reconnection
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}

