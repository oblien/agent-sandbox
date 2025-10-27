import { FilesAPI } from './api/files.js';
import { GitAPI } from './api/git.js';
import { SearchAPI } from './api/search.js';
import { TerminalAPI } from './api/terminal.js';
import { SnapshotsAPI } from './api/snapshots.js';
import { BrowserAPI } from './api/browser.js';
import { WebSocketConnection } from './websocket/connection.js';
import { TerminalManager } from './managers/terminal.js';
import { WatcherManager } from './managers/watcher.js';

/**
 * Sandbox API Client - Interact with a specific sandbox instance
 * 
 * This client is used to interact with an individual sandbox after it has been created.
 * The token is obtained when creating a sandbox via OblienClient.
 * 
 * Full documentation: https://oblien.com/docs/agent-sandbox
 * 
 * @example
 * ```javascript
 * import { SandboxClient } from 'agent-sandbox';
 * 
 * // Token obtained from sandbox creation
 * const sandbox = new SandboxClient({
 *   baseURL: 'https://sandbox.oblien.com',
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
    if (!config.token) {
      throw new Error('token is required');
    }

    const { baseURL = 'https://sandbox.oblien.com', token, sandboxId, sandboxName, oblienClient } = config;

    this.baseURL = baseURL;
    this.token = token;
    this.sandboxId = sandboxId;
    this.sandboxName = sandboxName;
    this.oblienClient = oblienClient;

    /**
     * Shared WebSocket connection (ONE connection for everything)
     * @type {WebSocketConnection}
     * @private
     */
    this._wsConnection = new WebSocketConnection({
      baseURL,
      token,
      sandboxId,
      onStatusCheck: async () => {
        // Check if sandbox is active before connecting
        if (this.oblienClient && this.sandboxId) {
          try {
            const result = await this.oblienClient.sandboxes.get(this.sandboxId);
            if (!result.success) return false;
            const status = result.sandbox?.status;
            return status === 'active' || status === 'running';
          } catch (error) {
            console.warn('[Sandbox] Status check failed:', error.message);
            return true; // Allow connection attempt if check fails
          }
        }
        return true;
      }
    });

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
     * Terminal API (static/REST endpoints)
     * @type {TerminalAPI}
     */
    this.staticTerminal = new TerminalAPI(baseURL, token);

    /**
     * Snapshots API
     * @type {SnapshotsAPI}
     */
    this.snapshots = new SnapshotsAPI(baseURL, token);

    /**
     * Browser API
     * @type {BrowserAPI}
     */
    this.browser = new BrowserAPI(baseURL, token);

    /**
     * Terminal Manager - Real-time terminal via shared WebSocket
     * @type {TerminalManager}
     */
    this.terminal = new TerminalManager(this._wsConnection);

    /**
     * File Watcher - Real-time file watching via shared WebSocket
     * @type {WatcherManager}
     */
    this.watcher = new WatcherManager(this._wsConnection);
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

  /**
   * Connect to WebSocket (terminal/watcher auto-connect when used)
   * @returns {Promise<void>}
   */
  async connect() {
    await this._wsConnection.connect();
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this._wsConnection.disconnect();
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean}
   */
  get connected() {
    return this._wsConnection.connected;
  }
}

