/**
 * Type definitions for the Sandbox SDK
 * These are JSDoc type definitions that can be used for IntelliSense
 */

/**
 * @typedef {Object} SandboxConfig
 * @property {string} baseURL - Base URL of the sandbox API
 * @property {string} token - Authentication token
 */

/**
 * @typedef {Object} FileListOptions
 * @property {string} dirPath - Directory path to list
 * @property {boolean} [recursive] - List recursively
 * @property {Array<string>} [ignorePatterns] - Patterns to ignore
 */

/**
 * @typedef {Object} FileGetOptions
 * @property {string} filePath - File path to read
 * @property {Object} [range] - Line range {start, end}
 * @property {boolean} [withLineNumbers] - Include line numbers
 */

/**
 * @typedef {Object} FileCreateOptions
 * @property {string} [parentPath] - Parent directory path
 * @property {string} [fileName] - File name
 * @property {string} [fullPath] - Full file path
 * @property {string} [filePath] - File path (alternative)
 * @property {string} [content] - File content
 * @property {boolean} [isFolder] - Create as folder
 * @property {boolean} [withWatcher=true] - Trigger file watcher
 */

/**
 * @typedef {Object} FileDeleteOptions
 * @property {string} filePath - Path to delete
 * @property {boolean} [withWatcher=true] - Trigger file watcher
 */

/**
 * @typedef {Object} FileRenameOptions
 * @property {string} sourcePath - Source path
 * @property {string} destinationPath - Destination path
 * @property {boolean} [withWatcher=true] - Trigger file watcher
 */

/**
 * @typedef {Object} GitCloneOptions
 * @property {string} url - Repository URL
 * @property {string} targetDir - Target directory
 * @property {string} [branch] - Branch to clone
 * @property {Object} [auth] - Authentication config
 * @property {boolean} [root=true] - Clone at root
 */

/**
 * @typedef {Object} GitCommitOptions
 * @property {string} repoPath - Repository path
 * @property {string} message - Commit message
 * @property {Object} [author] - Author info {name, email}
 */

/**
 * @typedef {Object} SearchOptions
 * @property {string} query - Search query
 * @property {Object} [options] - Search options
 */

/**
 * @typedef {Object} TerminalOptions
 * @property {string} command - Command to execute
 * @property {string} [cwd] - Working directory
 * @property {Object} [env] - Environment variables
 * @property {number} [timeout] - Execution timeout
 */

/**
 * @typedef {Object} SnapshotCommitOptions
 * @property {string} message - Commit message
 */

/**
 * @typedef {Object} SnapshotArchiveOptions
 * @property {string} id - Archive ID
 * @property {Object} [options] - Additional options
 */

export default {};

