import * as http from '../utils/http.js';

/**
 * Base API class that handles authentication and common request logic
 */
export class BaseAPI {
  /**
   * @param {string} baseURL - The base URL for the API
   * @param {string} token - Authentication token
   */
  constructor(baseURL, token) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.token = token;
  }

  /**
   * Get headers with authentication
   * @returns {Object} Headers object
   */
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
    };
  }

  /**
   * Make a GET request
   * @param {string} path - API path
   * @returns {Promise<any>} Response data
   */
  async get(path) {
    const url = `${this.baseURL}${path}`;
    return http.get(url, this.getHeaders());
  }

  /**
   * Make a POST request
   * @param {string} path - API path
   * @param {Object} body - Request body
   * @returns {Promise<any>} Response data
   */
  async post(path, body = {}) {
    const url = `${this.baseURL}${path}`;
    return http.post(url, body, this.getHeaders());
  }

  /**
   * Make a PUT request
   * @param {string} path - API path
   * @param {Object} body - Request body
   * @returns {Promise<any>} Response data
   */
  async put(path, body = {}) {
    const url = `${this.baseURL}${path}`;
    return http.put(url, body, this.getHeaders());
  }

  /**
   * Make a DELETE request
   * @param {string} path - API path
   * @returns {Promise<any>} Response data
   */
  async delete(path) {
    const url = `${this.baseURL}${path}`;
    return http.del(url, this.getHeaders());
  }
}

