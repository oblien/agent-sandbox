/**
 * HTTP utilities for making API requests
 */

/**
 * Makes an HTTP request with proper error handling
 * @param {string} url - The URL to request
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 * @throws {Error} If request fails
 */
export async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return data
    }

    return data;
  } catch (error) {
    
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Makes a GET request
 * @param {string} url - The URL to request
 * @param {Object} headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function get(url, headers = {}) {
  return request(url, {
    method: 'GET',
    headers,
  });
}

/**
 * Makes a POST request
 * @param {string} url - The URL to request
 * @param {Object} body - Request body
 * @param {Object} headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function post(url, body = {}, headers = {}) {
  return request(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

/**
 * Makes a PUT request
 * @param {string} url - The URL to request
 * @param {Object} body - Request body
 * @param {Object} headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function put(url, body = {}, headers = {}) {
  return request(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
}

/**
 * Makes a DELETE request
 * @param {string} url - The URL to request
 * @param {Object} headers - Additional headers
 * @returns {Promise<any>} Response data
 */
export async function del(url, headers = {}) {
  return request(url, {
    method: 'DELETE',
    headers,
  });
}

