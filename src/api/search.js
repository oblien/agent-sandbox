import { BaseAPI } from './base.js';

/**
 * Search API - Handle search operations
 */
export class SearchAPI extends BaseAPI {
  /**
   * Search file contents
   * @param {Object} options - Search options
   * @param {string} options.query - Search query
   * @param {Object} [options.options] - Search options (caseSensitive, regex, etc)
   * @returns {Promise<Object>} Search results
   */
  async search(options) {
    return this.post('/search', options);
  }

  /**
   * Search file names only
   * @param {Object} options - Search options
   * @param {string} options.query - Search query
   * @param {Object} [options.options] - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchFileNames(options) {
    return this.post('/search/filenames', options);
  }
}

