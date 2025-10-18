import { BaseAPI } from './base.js';

/**
 * Browser API - Handle browser automation operations
 */
export class BrowserAPI extends BaseAPI {
  /**
   * Get page content from a URL
   * @param {Object} options - Page content options
   * @param {string} options.url - URL to visit
   * @param {string} [options.path] - Path to append to container URL
   * @param {string} [options.pageUrl] - Full page URL
   * @param {number} [options.waitFor] - Time to wait (ms)
   * @param {string} [options.selector] - CSS selector to wait for
   * @param {string} [options.extract] - Extraction mode
   * @param {boolean} [options.waitForFullLoad] - Wait for full page load
   * @param {boolean} [options.useProxy] - Use proxy
   * @returns {Promise<Object>} Page content result
   */
  async getPageContent(options) {
    return this.post('/browser/page-content', options);
  }

  /**
   * Monitor network requests (batch mode)
   * @param {Object} options - Monitor options
   * @param {string} options.url - URL to monitor
   * @param {string} [options.path] - Path to append to container URL
   * @param {number} [options.duration] - Monitoring duration (ms)
   * @param {Array<string>} [options.filterTypes] - Request types to filter
   * @param {boolean} [options.useProxy] - Use proxy
   * @returns {Promise<Object>} Network requests result
   */
  async monitorRequests(options) {
    return this.post('/browser/monitor-requests', options);
  }

  /**
   * Take a screenshot of a page
   * @param {Object} options - Screenshot options
   * @param {string} options.url - URL to screenshot
   * @param {string} [options.path] - Path to append to container URL
   * @param {number} [options.width] - Viewport width
   * @param {number} [options.height] - Viewport height
   * @param {string} [options.deviceType] - Device preset name
   * @param {number} [options.scale] - Scale factor
   * @param {Object} [options.scrollPosition] - Scroll position {x, y}
   * @param {boolean} [options.fullPage] - Capture full page
   * @param {string} [options.format] - Image format (png, jpeg, webp)
   * @param {number} [options.quality] - Image quality (0-100)
   * @param {string} [options.selector] - CSS selector to screenshot
   * @param {number} [options.waitFor] - Time to wait before screenshot
   * @param {boolean} [options.save] - Save screenshot to file
   * @param {Object} [options.fullPageOptions] - Full page options
   * @param {boolean} [options.useProxy] - Use proxy
   * @param {number} [options.timeout] - Operation timeout
   * @returns {Promise<Object>} Screenshot result
   */
  async screenshot(options) {
    return this.post('/browser/screenshot', options);
  }

  /**
   * Clean/delete screenshots
   * @param {Object} options - Clean options
   * @param {string} options.url - URL pattern to clean
   * @returns {Promise<Object>} Clean result
   */
  async cleanScreenshots(options) {
    return this.post('/browser/clean-screenshots', options);
  }

  /**
   * Get console logs from a page
   * @param {Object} options - Console logs options
   * @param {string} options.url - URL to get logs from
   * @param {string} [options.path] - Path to append to container URL
   * @param {number} [options.waitFor] - Time to wait (ms)
   * @param {string} [options.selector] - CSS selector to wait for
   * @param {boolean} [options.includeNetworkErrors] - Include network errors
   * @param {boolean} [options.flatten] - Flatten log structure
   * @param {boolean} [options.useProxy] - Use proxy
   * @returns {Promise<Object>} Console logs result
   */
  async getConsoleLogs(options) {
    return this.post('/browser/console-logs', options);
  }

  /**
   * Get available device presets
   * @returns {Promise<Object>} Device presets
   */
  async getDevicePresets() {
    return this.get('/browser/device-presets');
  }

  /**
   * Get browser status
   * @returns {Promise<Object>} Browser status
   */
  async getStatus() {
    return this.get('/browser/status');
  }
}

