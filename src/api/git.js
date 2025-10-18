import { BaseAPI } from './base.js';

/**
 * Git API - Handle all git operations
 */
export class GitAPI extends BaseAPI {
  /**
   * List available SSH keys
   * @returns {Promise<Object>} SSH keys list
   */
  async listKeys() {
    return this.get('/git/keys');
  }

  /**
   * Configure git user for a repository
   * @param {Object} options - Config options
   * @param {string} options.repoPath - Repository path
   * @param {string} options.name - User name
   * @param {string} options.email - User email
   * @returns {Promise<Object>} Config result
   */
  async configUser(options) {
    return this.post('/git/config/user', options);
  }

  /**
   * Check if directory is a git repository
   * @param {Object} options - Check options
   * @param {string} options.repoPath - Path to check
   * @returns {Promise<Object>} Check result
   */
  async check(options) {
    return this.post('/git/check', options);
  }

  /**
   * Clone a repository
   * @param {Object} options - Clone options
   * @param {string} options.url - Repository URL
   * @param {string} options.targetDir - Target directory
   * @param {string} [options.branch] - Branch to clone
   * @param {Object} [options.auth] - Authentication config
   * @param {boolean} [options.root=true] - Clone at root
   * @returns {Promise<Object>} Clone result
   */
  async clone(options) {
    return this.post('/git/clone', options);
  }

  /**
   * Pull changes from remote
   * @param {Object} options - Pull options
   * @param {string} options.repoPath - Repository path
   * @param {string} [options.branch] - Branch to pull
   * @param {Object} [options.auth] - Authentication config
   * @returns {Promise<Object>} Pull result
   */
  async pull(options) {
    return this.post('/git/pull', options);
  }

  /**
   * Push changes to remote
   * @param {Object} options - Push options
   * @param {string} options.repoPath - Repository path
   * @param {string} [options.branch] - Branch to push
   * @param {boolean} [options.force] - Force push
   * @param {Object} [options.auth] - Authentication config
   * @returns {Promise<Object>} Push result
   */
  async push(options) {
    return this.post('/git/push', options);
  }

  /**
   * Get repository status
   * @param {Object} options - Status options
   * @param {string} options.repoPath - Repository path
   * @returns {Promise<Object>} Status result
   */
  async status(options) {
    return this.post('/git/status', options);
  }

  /**
   * Get current branch
   * @param {Object} options - Branch options
   * @param {string} options.repoPath - Repository path
   * @returns {Promise<Object>} Current branch
   */
  async getCurrentBranch(options) {
    return this.post('/git/branch/current', options);
  }

  /**
   * List branches
   * @param {Object} options - List options
   * @param {string} options.repoPath - Repository path
   * @param {boolean} [options.includeRemote] - Include remote branches
   * @returns {Promise<Object>} Branches list
   */
  async listBranches(options) {
    return this.post('/git/branch/list', options);
  }

  /**
   * Create a new branch
   * @param {Object} options - Create options
   * @param {string} options.repoPath - Repository path
   * @param {string} options.branchName - Branch name
   * @param {boolean} [options.checkout] - Checkout after create
   * @returns {Promise<Object>} Create result
   */
  async createBranch(options) {
    return this.post('/git/branch/create', options);
  }

  /**
   * Checkout a branch
   * @param {Object} options - Checkout options
   * @param {string} options.repoPath - Repository path
   * @param {string} options.branchName - Branch name
   * @returns {Promise<Object>} Checkout result
   */
  async checkoutBranch(options) {
    return this.post('/git/branch/checkout', options);
  }

  /**
   * Add files to staging
   * @param {Object} options - Add options
   * @param {string} options.repoPath - Repository path
   * @param {Array<string>} options.files - Files to add
   * @returns {Promise<Object>} Add result
   */
  async add(options) {
    return this.post('/git/add', options);
  }

  /**
   * Commit changes
   * @param {Object} options - Commit options
   * @param {string} options.repoPath - Repository path
   * @param {string} options.message - Commit message
   * @param {Object} [options.author] - Author info {name, email}
   * @returns {Promise<Object>} Commit result
   */
  async commit(options) {
    return this.post('/git/commit', options);
  }

  /**
   * Initialize a new repository
   * @param {Object} options - Init options
   * @param {string} options.repoPath - Repository path
   * @returns {Promise<Object>} Init result
   */
  async init(options) {
    return this.post('/git/init', options);
  }

  /**
   * Get commit history
   * @param {Object} options - History options
   * @param {string} options.repoPath - Repository path
   * @param {number} [options.limit] - Max number of commits
   * @returns {Promise<Object>} Commit history
   */
  async history(options) {
    return this.post('/git/history', options);
  }
}

