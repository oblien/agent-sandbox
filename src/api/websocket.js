import { BaseAPI } from './base.js';

/**
 * WebSocket API - Handle WebSocket connections
 */
export class WebSocketAPI extends BaseAPI {
  /**
   * Get all active WebSocket connections
   * @returns {Promise<Object>} Active connections
   */
  async getConnections() {
    return this.get('/ws/connections');
  }

  /**
   * Get connection status
   * @param {Object} options - Status options
   * @param {string} options.token - Connection token
   * @returns {Promise<Object>} Connection status
   */
  async getConnectionStatus(options) {
    return this.get('/ws/connection', options);
  }

  /**
   * Connect to WebSocket
   * @param {Object} options - Connect options
   * @param {string} options.token - Connection token
   * @returns {Promise<Object>} Connect result
   */
  async connect(options) {
    return this.post('/ws/connect', options);
  }

  /**
   * Disconnect from WebSocket
   * @param {Object} options - Disconnect options
   * @param {string} options.token - Connection token
   * @returns {Promise<Object>} Disconnect result
   */
  async disconnect(options) {
    return this.post('/ws/disconnect', options);
  }
}

