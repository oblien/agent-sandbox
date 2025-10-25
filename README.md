# agent-sandbox
An isolated, intelligent environment where AI agents can build, run, and manage things
clean, modular SDK for interacting with the Oblien Sandbox API. This SDK provides a simple and intuitive interface for managing sandboxes, files, git repositories, snapshots, and more.

📚 **[Full Documentation](https://oblien.com/docs/agent-sandbox)**

## Installation

```bash
npm install agent-sandbox
```

## Quick Start

```javascript
import { OblienClient } from 'agent-sandbox';

// 1. Initialize client
// get your own client id and secret from https://oblien.com/dashboard/api
const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// 2. Create sandbox - returns ready-to-use client!
const sandbox = await client.createSandbox({
  name: 'my-dev-sandbox',
});

// 3. Use it immediately - that's it!
await sandbox.files.list({ dirPath: '/opt/app' });

await sandbox.files.create({
  fullPath: '/opt/app/index.js',
  content: 'console.log("Hello World");'
});
await sandbox.git.clone({ url: '...', targetDir: '/opt/app' });
```

### Reconnect to Existing Sandbox

```javascript
// Connect to existing sandbox by ID
const sandbox = await client.sandbox('sandbox_abc123');

// Use it
await sandbox.files.list({ dirPath: '/opt/app' });
```

### Manual Setup (if you already have a token)

```javascript
import { SandboxClient } from 'agent-sandbox';

const sandbox = new SandboxClient({
  token: 'your_sandbox_token'
});
```

## Features

- 🔐 **Account Management** - Authenticate and manage sandboxes with client credentials
- 📦 **Sandbox Management** - Create, start, stop, delete sandbox instances
- 🗂️ **Files API** - Complete file management (create, read, update, delete, rename)
- 🔍 **Search API** - Search file contents and filenames
- 📂 **Git API** - Full git operations (clone, commit, push, pull, branches)
- 📸 **Snapshots API** - Create and manage checkpoints and archives
- 💻 **Terminal API** - Execute terminal commands
- 🌐 **Browser API** - Browser automation (screenshots, page content, network monitoring)
- 🔌 **WebSocket API** - Real-time connection management
- 💪 **TypeScript Support** - Full TypeScript type definitions
- 🧩 **Modular Design** - Clean, readable, and maintainable code structure

## API Reference

### Account & Sandbox Management

#### OblienClient

Main client for authenticating and managing sandboxes.

```javascript
import { OblienClient } from 'agent-sandbox';

const client = new OblienClient({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});
```

#### Create a Sandbox

```javascript
const sandbox = await client.sandboxes.create({
  name: 'my-sandbox',
  template: 'node-20'   // Optional: template to use
});

// Returns:
// {
//   id: 'sandbox_abc123',
//   token: 'sandbox_token_xyz',
//   url: 'https://sandbox-abc123.oblien.com',
//   name: 'my-sandbox',
//   status: 'active'
// }
```

#### List Sandboxes

```javascript
const sandboxes = await client.sandboxes.list({
  page: 1,
  limit: 20,
  status: 'active'  // Optional: filter by status
});
```

#### Get Sandbox Details

```javascript
const sandbox = await client.sandboxes.get('sandbox_abc123');
```

#### Manage Sandbox Lifecycle

```javascript
// Stop sandbox
await client.sandboxes.stop('sandbox_abc123');

// Start sandbox
await client.sandboxes.start('sandbox_abc123');

// Restart sandbox
await client.sandboxes.restart('sandbox_abc123');

// Delete sandbox
await client.sandboxes.delete('sandbox_abc123');
```

#### Regenerate Sandbox Token

```javascript
const { token } = await client.sandboxes.regenerateToken('sandbox_abc123');
```

#### Get Sandbox Metrics

```javascript
const metrics = await client.sandboxes.metrics('sandbox_abc123');
```

### Files API

```javascript
// List files in a directory
await sandbox.files.list({ 
  dirPath: '/opt/app',
  recursive: true,
  ignorePatterns: ['node_modules', '.git']
});

// Get file content
await sandbox.files.get({ 
  filePath: '/opt/app/index.js',
  withLineNumbers: true
});

// Create a file
await sandbox.files.create({
  fullPath: '/opt/app/new-file.js',
  content: 'const greeting = "Hello";',
  withWatcher: true
});

// Delete a file
await sandbox.files.delete({ 
  filePath: '/opt/app/old-file.js' 
});

// Rename/move a file
await sandbox.files.rename({
  sourcePath: '/opt/app/old-name.js',
  destinationPath: '/opt/app/new-name.js'
});

// Check if file exists
await sandbox.files.exists({ 
  filePath: '/opt/app/file.js' 
});

// Edit a file
await sandbox.files.edit({
  filePath: '/opt/app/index.js',
  content: 'new content'
});

// Merge file edits
await sandbox.files.merge({
  filePath: '/opt/app/index.js',
  content: 'merged content',
  options: { silent: false }
});
```

### Git API

```javascript
// Clone a repository
await sandbox.git.clone({
  url: 'https://github.com/user/repo.git',
  targetDir: '/opt/app',
  branch: 'main'
});

// Check repository status
await sandbox.git.status({ 
  repoPath: '/opt/app' 
});

// Get current branch
await sandbox.git.getCurrentBranch({ 
  repoPath: '/opt/app' 
});

// List all branches
await sandbox.git.listBranches({ 
  repoPath: '/opt/app',
  includeRemote: true
});

// Create a new branch
await sandbox.git.createBranch({
  repoPath: '/opt/app',
  branchName: 'feature/new-feature',
  checkout: true
});

// Add files to staging
await sandbox.git.add({
  repoPath: '/opt/app',
  files: ['.']
});

// Commit changes
await sandbox.git.commit({
  repoPath: '/opt/app',
  message: 'Add new feature',
  author: { name: 'John Doe', email: 'john@example.com' }
});

// Push to remote
await sandbox.git.push({
  repoPath: '/opt/app',
  branch: 'main'
});

// Pull from remote
await sandbox.git.pull({
  repoPath: '/opt/app',
  branch: 'main'
});

// Get commit history
await sandbox.git.history({
  repoPath: '/opt/app',
  limit: 10
});

// Initialize new repository
await sandbox.git.init({ 
  repoPath: '/opt/new-repo' 
});

// Configure git user
await sandbox.git.configUser({
  repoPath: '/opt/app',
  name: 'John Doe',
  email: 'john@example.com'
});

// List SSH keys
await sandbox.git.listKeys();
```

### Search API

```javascript
// Search file contents
await sandbox.search.search({
  query: 'function searchTerm',
  options: {
    caseSensitive: false,
    regex: false,
    path: '/opt/app'
  }
});

// Search file names only
await sandbox.search.searchFileNames({
  query: 'component',
  options: { path: '/opt/app/src' }
});
```

### Terminal API

```javascript
// Execute a command
await sandbox.terminal.execute({
  command: 'npm install',
  cwd: '/opt/app',
  env: { NODE_ENV: 'production' },
  timeout: 30000
});
```

### Snapshots API

```javascript
// Create a checkpoint
await sandbox.snapshots.commit({
  message: 'Checkpoint before major changes'
});

// List all checkpoints
await sandbox.snapshots.listCheckpoints({ 
  limit: 20 
});

// Get current checkpoint
await sandbox.snapshots.getCurrentCheckpoint();

// Go to a specific checkpoint
await sandbox.snapshots.goto({
  commitHash: 'abc123...'
});

// Delete commits after a hash
await sandbox.snapshots.deleteAfter({
  commitHash: 'abc123...'
});

// Cleanup all checkpoints
await sandbox.snapshots.cleanup();

// Archive current repository
await sandbox.snapshots.archive({
  id: 'my-archive-v1',
  options: {}
});

// List archives
await sandbox.snapshots.listArchives();

// Restore from archive
await sandbox.snapshots.restore({
  id: 'my-archive-v1',
  override: false
});

// Delete archive
await sandbox.snapshots.deleteArchive('my-archive-v1');

// Cleanup archives
await sandbox.snapshots.cleanupArchives();
```

### Terminal (Real-time via WebSocket)

Direct terminal access with automatic WebSocket management:

```javascript
// Create terminal - WebSocket auto-connects!
const terminal = await sandbox.terminal.create({
  cols: 120,
  rows: 30,
  cwd: '/opt/app',
  onData: (data) => {
    console.log(data); // Real-time output
  },
  onExit: (code) => {
    console.log('Exit code:', code);
  }
});

// Execute commands
terminal.write('npm install\n');
terminal.write('npm run dev\n');

// Get terminal output history
const state = await terminal.getState({
  newOnly: false,  // Get all output or just new
  maxLines: 100
});
const output = Buffer.from(state, 'base64').toString('utf-8');

// Resize terminal
await terminal.resize(150, 40);

// Close terminal
await terminal.close();

// List all terminals
const terminals = await sandbox.terminal.list();
```

### File Watcher (Real-time via WebSocket)

Direct watcher access with automatic WebSocket management:

```javascript
// Start watching - WebSocket auto-connects!
await sandbox.watcher.start({
  ignorePatterns: ['node_modules', '.git', 'dist'],
  onChange: (path) => {
    console.log('📝 File changed:', path);
  },
  onAdd: (path) => {
    console.log('➕ File added:', path);
  },
  onUnlink: (path) => {
    console.log('➖ File deleted:', path);
  }
});

// Watcher runs in background...

// Stop watching
sandbox.watcher.stop();
```

### WebSocket API (Low-level)

For advanced WebSocket usage:

```javascript
const ws = await sandbox.websocket.connect({ binary: true });

// Access terminal manager
const terminal = await ws.terminal.create({...});

// Access file watcher
ws.watcher.start({...});

// Listen to custom events
ws.on('error', (error) => console.error(error));
ws.on('close', () => console.log('Closed'));

// Disconnect
ws.disconnect();
```

### Browser API

```javascript
// Get page content
await sandbox.browser.getPageContent({
  url: 'https://example.com',
  waitFor: 1000,
  selector: '.content',
  waitForFullLoad: true
});

// Or use path for container URLs
await sandbox.browser.getPageContent({
  path: '/dashboard',  // Uses container's internal URL
  waitFor: 1000
});

// Take screenshot
await sandbox.browser.screenshot({
  url: 'https://example.com',
  width: 1920,
  height: 1080,
  fullPage: true,
  format: 'png',
  save: true
});

// Monitor network requests
await sandbox.browser.monitorRequests({
  url: 'https://example.com',
  duration: 5000,
  filterTypes: ['fetch', 'xhr']
});

// Get console logs
await sandbox.browser.getConsoleLogs({
  url: 'https://example.com',
  waitFor: 2000,
  includeNetworkErrors: true
});

// Get device presets
const presets = await sandbox.browser.getDevicePresets();

// Get browser status
const status = await sandbox.browser.getStatus();

// Clean screenshots
await sandbox.browser.cleanScreenshots({
  url: 'https://example.com'
});
```

## Error Handling

All API methods return promises and throw errors on failure. Use try-catch for error handling:

```javascript
try {
  const files = await sandbox.files.list({ dirPath: '/opt/app' });
  console.log('Files:', files);
} catch (error) {
  console.error('Error listing files:', error.message);
}
```

## TypeScript Support

This SDK includes full TypeScript type definitions:

```typescript
import { SandboxClient, FileListOptions, GitCloneOptions } from 'agent-sandbox';

const sandbox = new SandboxClient({
  token: 'token here'
});

const options: FileListOptions = {
  dirPath: '/opt/app',
  recursive: true
};

const files = await sandbox.files.list(options);
```

Each API module is self-contained and extends the `BaseAPI` class, which handles authentication and common HTTP operations.

## Authentication

The SDK uses a two-tier authentication system:

### 1. Account Authentication (OblienClient)

Authenticate with your Oblien account using client credentials:

```javascript
const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});
```

Get your client credentials from [oblien.com/account/api](https://oblien.com/account/api).

### 2. Sandbox Authentication (SandboxClient)

Each sandbox has its own token obtained during creation:

```javascript
// Create sandbox and get token
const sandbox = await client.sandboxes.create({ name: 'my-sandbox' });

// Use token to interact with sandbox
const sandboxClient = new SandboxClient({
  baseURL: sandbox.url,
  token: sandbox.token
});
```

All API requests automatically include the appropriate `Authorization: Bearer <token>` header.

## Contributing

Contributions are welcome! Please ensure your code follows the existing structure and includes appropriate documentation.

## License

MIT

