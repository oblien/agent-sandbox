import { FilesAPI } from './api/files.js';
import { GitAPI } from './api/git.js';
import { SearchAPI } from './api/search.js';
import { TerminalAPI } from './api/terminal.js';
import { SnapshotsAPI } from './api/snapshots.js';
import { WebSocketAPI } from './api/websocket.js';

/**
 * Sandbox API Client - Interact with a specific sandbox instance
 * 
 * This client is used to interact with an individual sandbox after it has been created.
 * The token is obtained when creating a sandbox via OblienClient.
 * 
 * Documentation: https://oblien.com/docs/sandbox
 * 
 * @example
 * ```javascript
 * import { SandboxClient } from 'buildcore';
 * 
 * // Token obtained from sandbox creation
 * const sandbox = new SandboxClient({
 *   baseURL: 'https://sandbox-abc123.oblien.com:55872',
 *   token: 'sandbox_token_here'
 * });
 * 
 * // List files
 * const files = await sandbox.files.list({ dirPath: '/opt/app' });
 * 
 * // Read a file
 * const content = await sandbox.files.get({ filePath: '/opt/app/index.js' });
 * 
 * // Create a file
 * await sandbox.files.create({
 *   fullPath: '/opt/app/newfile.js',
 *   content: 'console.log("Hello World");'
 * });
 * ```
 */
export class SandboxClient {
  /**
   * Create a new SandboxClient instance
   * 
   * Note: Prefer using `client.createSandbox()` or `client.sandbox(id)` from OblienClient
   * for automatic setup. Use this constructor directly only if you have a token already.
   * 
   * @param {Object} config - Client configuration
   * @param {string} config.baseURL - Base URL of the sandbox instance
   * @param {string} config.token - Sandbox authentication token
   * @param {string} [config.sandboxId] - Sandbox ID (optional)
   * @param {string} [config.sandboxName] - Sandbox name (optional)
   */
  constructor(config) {
    if (!config.baseURL) {
      throw new Error('baseURL is required');
    }
    if (!config.token) {
      throw new Error('token is required');
    }

    const { baseURL, token, sandboxId, sandboxName } = config;
    
    this.sandboxId = sandboxId;
    this.sandboxName = sandboxName;

    /**
     * Files API
     * @type {FilesAPI}
     */
    this.files = new FilesAPI(baseURL, token);

    /**
     * Git API
     * @type {GitAPI}
     */
    this.git = new GitAPI(baseURL, token);

    /**
     * Search API
     * @type {SearchAPI}
     */
    this.search = new SearchAPI(baseURL, token);

    /**
     * Terminal API
     * @type {TerminalAPI}
     */
    this.terminal = new TerminalAPI(baseURL, token);

    /**
     * Snapshots API
     * @type {SnapshotsAPI}
     */
    this.snapshots = new SnapshotsAPI(baseURL, token);

    /**
     * WebSocket API
     * @type {WebSocketAPI}
     */
    this.websocket = new WebSocketAPI(baseURL, token);
  }

  /**
   * Test connection to the sandbox API
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      const response = await fetch(this.files.baseURL);
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      return false;
    }
  }
}

