import { BaseAPI } from './base.js';

/**
 * Snapshots API - Handle snapshot/checkpoint operations
 */
export class SnapshotsAPI extends BaseAPI {
  /**
   * Create a checkpoint
   * @param {Object} options - Checkpoint options
   * @param {string} options.message - Commit message
   * @returns {Promise<Object>} Checkpoint result
   */
  async commit(options) {
    return this.post('/snapshots/commit', options);
  }

  /**
   * Go to a specific commit
   * @param {Object} options - Goto options
   * @param {string} options.commitHash - Commit hash to go to
   * @returns {Promise<Object>} Goto result
   */
  async goto(options) {
    return this.post('/snapshots/goto', options);
  }

  /**
   * List all checkpoints
   * @param {Object} [options] - List options
   * @param {number} [options.limit=20] - Max number of checkpoints
   * @returns {Promise<Object>} Checkpoints list
   */
  async listCheckpoints(options = {}) {
    const limit = options.limit || 20;
    return this.get(`/snapshots/checkpoints?limit=${limit}`);
  }

  /**
   * Get checkpoint info
   * @param {string} commitHash - Commit hash
   * @returns {Promise<Object>} Checkpoint info
   */
  async getCheckpoint(commitHash) {
    return this.get(`/snapshots/checkpoint/${commitHash}`);
  }

  /**
   * Get current checkpoint
   * @returns {Promise<Object>} Current checkpoint
   */
  async getCurrentCheckpoint() {
    return this.get('/snapshots/current-checkpoint');
  }

  /**
   * Cleanup all checkpoints
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanup() {
    return this.post('/snapshots/cleanup', {});
  }

  /**
   * Delete commits after a specific hash
   * @param {Object} options - Delete options
   * @param {string} options.commitHash - Commit hash
   * @returns {Promise<Object>} Delete result
   */
  async deleteAfter(options) {
    return this.post('/snapshots/delete', options);
  }

  // Snapshot Archive methods

  /**
   * Archive current repository
   * @param {Object} options - Archive options
   * @param {string} options.id - Archive ID
   * @param {Object} [options.options] - Additional options
   * @returns {Promise<Object>} Archive result
   */
  async archive(options) {
    return this.post('/snapshots/archive', options);
  }

  /**
   * Restore archived repository
   * @param {Object} options - Restore options
   * @param {string} options.id - Archive ID
   * @param {boolean} [options.override=false] - Override existing
   * @returns {Promise<Object>} Restore result
   */
  async restore(options) {
    return this.post('/snapshots/restore-archive', options);
  }

  /**
   * List all archives
   * @returns {Promise<Object>} Archives list
   */
  async listArchives() {
    return this.get('/snapshots/archives');
  }

  /**
   * Get archive info
   * @param {string} id - Archive ID
   * @returns {Promise<Object>} Archive info
   */
  async getArchive(id) {
    return this.get(`/snapshots/archive/${id}`);
  }

  /**
   * Delete archive
   * @param {string} id - Archive ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteArchive(id) {
    return this.delete(`/snapshots/archive/${id}`);
  }

  /**
   * Cleanup archives
   * @param {Object} [options] - Cleanup options
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanupArchives(options = {}) {
    return this.post('/snapshots/cleanup-archives', options);
  }
}

