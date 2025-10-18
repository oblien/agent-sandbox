import { BaseAPI } from './base.js';

/**
 * Files API - Handle all file operations
 */
export class FilesAPI extends BaseAPI {
  /**
   * List files in a directory
   * @param {Object} options - List options
   * @param {string} options.dirPath - Directory path to list
   * @param {boolean} [options.recursive] - List recursively
   * @param {Array<string>} [options.ignorePatterns] - Patterns to ignore
   * @returns {Promise<Object>} List result
   */
  async list(options) {
    return this.post('/files/list', options);
  }

  /**
   * Get file content
   * @param {Object} options - Get options
   * @param {string} options.filePath - File path to read
   * @param {Object} [options.range] - Line range {start, end}
   * @param {boolean} [options.withLineNumbers] - Include line numbers
   * @returns {Promise<Object>} File content
   */
  async get(options) {
    return this.post('/files/get', options);
  }

  /**
   * Create a new file or folder
   * @param {Object} options - Create options
   * @param {string} [options.parentPath] - Parent directory path
   * @param {string} [options.fileName] - File name
   * @param {string} [options.fullPath] - Full file path (alternative to parentPath + fileName)
   * @param {string} [options.filePath] - File path (alternative)
   * @param {string} [options.content] - File content
   * @param {boolean} [options.isFolder] - Create as folder
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Create result
   */
  async create(options) {
    return this.post('/files/create', options);
  }

  /**
   * Delete a file or folder
   * @param {Object} options - Delete options
   * @param {string} options.filePath - Path to delete
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Delete result
   */
  async delete(options) {
    return this.post('/files/delete', options);
  }

  /**
   * Rename/move a file or folder
   * @param {Object} options - Rename options
   * @param {string} options.sourcePath - Source path
   * @param {string} options.destinationPath - Destination path
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Rename result
   */
  async rename(options) {
    return this.post('/files/rename', options);
  }

  /**
   * Upload a file
   * @param {Object} options - Upload options
   * @param {string} options.filePath - File path
   * @param {string} options.content - File content
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Upload result
   */
  async upload(options) {
    return this.post('/files/upload', options);
  }

  /**
   * Download a file
   * @param {Object} options - Download options
   * @param {string} options.filePath - File path to download
   * @returns {Promise<Object>} Download result
   */
  async download(options) {
    return this.post('/files/download', options);
  }

  /**
   * Check if file exists
   * @param {Object} options - Check options
   * @param {string} options.filePath - File path to check
   * @returns {Promise<Object>} Exists result
   */
  async exists(options) {
    return this.post('/files/exists', options);
  }

  /**
   * Edit a file
   * @param {Object} options - Edit options
   * @param {string} options.filePath - File path to edit
   * @param {string} [options.content] - New content
   * @param {Object} [options.edits] - Edit operations
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Edit result
   */
  async edit(options) {
    return this.post('/files/edit', options);
  }

  /**
   * Merge file edits
   * @param {Object} options - Merge options
   * @param {string} options.filePath - File path to merge
   * @param {string} options.content - Content to merge
   * @param {Object} [options.options] - Merge options {silent, etc}
   * @param {boolean} [options.withWatcher=true] - Trigger file watcher
   * @returns {Promise<Object>} Merge result
   */
  async merge(options) {
    return this.post('/files/merge', options);
  }
}

