import { BaseAPI } from './base.js';

/**
 * Terminal API - Handle terminal operations
 */
export class TerminalAPI extends BaseAPI {
  /**
   * Execute a terminal command
   * @param {Object} options - Terminal options
   * @param {string} options.command - Command to execute
   * @param {string} [options.cwd] - Working directory
   * @param {Object} [options.env] - Environment variables
   * @param {number} [options.timeout] - Execution timeout
   * @returns {Promise<Object>} Command result
   */
  async execute(options) {
    return this.post('/terminal', options);
  }
}

