import * as http from './utils/http.js';
import { SandboxClient } from './client.js';

/**
 * Authentication client for managing Oblien account and sandboxes
 * 
 * @example
 * ```javascript
 * import { OblienClient } from 'agent-sandbox';
 * 
 * const client = new OblienClient({
 *   clientId: process.env.OBLIEN_CLIENT_ID,
 *   clientSecret: process.env.OBLIEN_CLIENT_SECRET
 * });
 * 
 * // Create a sandbox and get ready-to-use client
 * const sandbox = await client.createSandbox({
 *   name: 'my-sandbox',
 *   region: 'us-east-1'
 * });
 * 
 * // Now use it directly
 * await sandbox.files.list({ dirPath: '/opt/app' });
 * await sandbox.git.clone({ url: '...', targetDir: '/opt/app' });
 * ```
 */
export class OblienClient {
  /**
   * Create a new OblienClient instance
   * @param {Object} config - Client configuration
   * @param {string} config.clientId - Your Oblien client ID
   * @param {string} config.clientSecret - Your Oblien client secret
   * @param {string} [config.apiURL='https://api.oblien.com/sandbox'] - API base URL
   */
  constructor(config) {
    if (!config.clientId) {
      throw new Error('clientId is required');
    }
    if (!config.clientSecret) {
      throw new Error('clientSecret is required');
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.apiURL = (config.apiURL || 'https://api.oblien.com/sandbox').replace(/\/$/, '');

    /**
     * Sandboxes API (low-level access)
     * @type {SandboxesAPI}
     */
    this.sandboxes = new SandboxesAPI(this);
  }

  /**
   * Create a new sandbox and return a ready-to-use SandboxClient
   * 
   * @param {Object} [options] - Sandbox options
   * @param {string} [options.name] - Sandbox name
   * @param {string} [options.region] - Region (us-east-1, eu-west-1, etc.)
   * @param {string} [options.template] - Template to use
   * @param {Object} [options.config] - Additional configuration
   * @returns {Promise<SandboxClient>} Ready-to-use SandboxClient instance
   * 
   * @example
   * ```javascript
   * const sandbox = await client.createSandbox({
   *   name: 'my-dev-sandbox',
   *   region: 'us-east-1'
   * });
   * 
   * // Use it immediately
   * await sandbox.files.list({ dirPath: '/opt/app' });
   * ```
   */
  async createSandbox(options = {}) {
    const sandboxInfo = await this.sandboxes.create(options);
    
    return new SandboxClient({
      baseURL: sandboxInfo.url,
      token: sandboxInfo.token,
      sandboxId: sandboxInfo.id,
      sandboxName: sandboxInfo.name
    });
  }

  /**
   * Connect to an existing sandbox by ID
   * 
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<SandboxClient>} Ready-to-use SandboxClient instance
   * 
   * @example
   * ```javascript
   * const sandbox = await client.sandbox('sandbox_abc123');
   * await sandbox.files.list({ dirPath: '/opt/app' });
   * ```
   */
  async sandbox(sandboxId) {
    const sandboxInfo = await this.sandboxes.get(sandboxId);
    
    return new SandboxClient({
      baseURL: sandboxInfo.url,
      token: sandboxInfo.token,
      sandboxId: sandboxInfo.id,
      sandboxName: sandboxInfo.name
    });
  }

  /**
   * Get authorization headers with client credentials
   * @returns {Object} Headers with client credentials
   */
  getAuthHeaders() {
    return {
      'X-Client-ID': this.clientId,
      'X-Client-Secret': this.clientSecret
    };
  }

  /**
   * Make authenticated GET request
   * @param {string} path - API path
   * @returns {Promise<any>} Response data
   */
  async get(path) {
    const headers = this.getAuthHeaders();
    return http.get(`${this.apiURL}${path}`, headers);
  }

  /**
   * Make authenticated POST request
   * @param {string} path - API path
   * @param {Object} body - Request body
   * @returns {Promise<any>} Response data
   */
  async post(path, body = {}) {
    const headers = this.getAuthHeaders();
    return http.post(`${this.apiURL}${path}`, body, headers);
  }

  /**
   * Make authenticated DELETE request
   * @param {string} path - API path
   * @returns {Promise<any>} Response data
   */
  async delete(path) {
    const headers = this.getAuthHeaders();
    return http.del(`${this.apiURL}${path}`, headers);
  }
}

/**
 * Sandboxes API - Manage sandbox instances
 */
class SandboxesAPI {
  /**
   * @param {OblienClient} client - OblienClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Create a new sandbox
   * @param {Object} options - Sandbox options
   * @param {string} [options.name] - Sandbox name
   * @param {string} [options.region] - Region (us-east-1, eu-west-1, etc.)
   * @param {string} [options.template] - Template to use
   * @param {Object} [options.config] - Additional configuration
   * @returns {Promise<Object>} Sandbox details {id, token, url, name, status}
   */
  async create(options = {}) {
    const response = await this.client.post('/', options);
    return response.sandbox;
  }

  /**
   * List all sandboxes
   * @param {Object} [options] - List options
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=20] - Items per page
   * @param {string} [options.status] - Filter by status (active, stopped, etc.)
   * @returns {Promise<Object>} Sandboxes list
   */
  async list(options = {}) {
    const params = new URLSearchParams(options).toString();
    const path = `/${params ? '?' + params : ''}`;
    return this.client.get(path);
  }

  /**
   * Get sandbox details
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Sandbox details
   */
  async get(sandboxId) {
    return this.client.get(`/${sandboxId}`);
  }

  /**
   * Delete a sandbox
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async delete(sandboxId) {
    return this.client.delete(`/${sandboxId}`);
  }

  /**
   * Start a stopped sandbox
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Sandbox details
   */
  async start(sandboxId) {
    return this.client.post(`/${sandboxId}/start`);
  }

  /**
   * Stop a running sandbox
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Sandbox details
   */
  async stop(sandboxId) {
    return this.client.post(`/${sandboxId}/stop`);
  }

  /**
   * Restart a sandbox
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Sandbox details
   */
  async restart(sandboxId) {
    return this.client.post(`/${sandboxId}/restart`);
  }

  /**
   * Regenerate sandbox token
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} New token details
   */
  async regenerateToken(sandboxId) {
    return this.client.post(`/${sandboxId}/regenerate-token`);
  }

  /**
   * Get sandbox metrics
   * @param {string} sandboxId - Sandbox ID
   * @returns {Promise<Object>} Metrics data
   */
  async metrics(sandboxId) {
    return this.client.get(`/${sandboxId}/metrics`);
  }
}

