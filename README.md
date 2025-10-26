# agent-sandbox

A powerful Node.js SDK for interacting with the Oblien Sandbox API. Build, run, and manage isolated development environments programmatically with full file system access, Git integration, and real-time capabilities.

Perfect for AI agents, automated workflows, and secure code execution.

---

## 📚 [Full Documentation](https://oblien.com/docs/sandbox)

---

## Installation

```bash
npm install agent-sandbox
```

## Quick Start

```javascript
import { OblienClient } from 'agent-sandbox';

// 1. Authenticate with your Oblien account
const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// 2. Create a sandbox - returns ready-to-use client!
const sandbox = await client.createSandbox({
  name: 'my-dev-sandbox'
});

// 3. Start using it immediately
await sandbox.files.list({ dirPath: '/opt/app' });
await sandbox.files.create({
  fullPath: '/opt/app/index.js',
  content: 'console.log("Hello World!");'
});
await sandbox.git.clone({
  url: 'https://github.com/user/repo',
  targetDir: '/opt/app'
});
```

**Get your API credentials:** [oblien.com/dashboard/api](https://oblien.com/dashboard/api)

## Core Features

| Feature | Description | Documentation |
|---------|-------------|---------------|
| 🔐 **Authentication** | Two-tier auth with client credentials and sandbox tokens | [Docs](https://oblien.com/docs/sandbox/authentication) |
| 📦 **Sandbox Management** | Create, start, stop, and manage sandbox instances | [Docs](https://oblien.com/docs/sandbox/quick-start) |
| 🗂️ **File Operations** | Complete CRUD operations for files and directories | [Docs](https://oblien.com/docs/sandbox/file-operations) |
| 📂 **Git Integration** | Full Git workflow support (clone, commit, push, branches) | [Docs](https://oblien.com/docs/sandbox/git-clone) |
| 🔍 **Search** | Fast search across file contents and names | [Docs](https://oblien.com/docs/sandbox/search) |
| 💻 **Terminal** | Execute commands with real-time streaming | [Docs](https://oblien.com/docs/sandbox/terminal) |
| 📸 **Snapshots** | Create checkpoints and restore environment states | [Docs](https://oblien.com/docs/sandbox/snapshots) |
| 🌐 **Browser Automation** | Screenshots, page content, network monitoring | [Docs](https://oblien.com/docs/sandbox/browser) |
| 🔌 **WebSocket** | Real-time file watching and terminal streaming | [Docs](https://oblien.com/docs/sandbox/websocket) |
| 💪 **TypeScript** | Full type definitions included | - |

## Usage Examples

### Working with Files

```javascript
// List files
const files = await sandbox.files.list({ 
  dirPath: '/opt/app',
  recursive: true
});

// Read file
const content = await sandbox.files.get({ 
  filePath: '/opt/app/index.js'
});

// Create file
await sandbox.files.create({
  fullPath: '/opt/app/hello.js',
  content: 'console.log("Hello!");'
});
```

[**→ Full File Operations Guide**](https://oblien.com/docs/sandbox/file-operations)

### Git Workflow

```javascript
// Clone repository
await sandbox.git.clone({
  url: 'https://github.com/user/repo',
  targetDir: '/opt/app'
});

// Make changes and commit
await sandbox.git.add({ repoPath: '/opt/app', files: ['.'] });
await sandbox.git.commit({
  repoPath: '/opt/app',
  message: 'Update code',
  author: { name: 'AI Agent', email: 'ai@example.com' }
});

// Push changes
await sandbox.git.push({ repoPath: '/opt/app' });
```

[**→ Full Git Integration Guide**](https://oblien.com/docs/sandbox/git-clone)

### Real-Time Terminal

```javascript
// Create interactive terminal
const terminal = await sandbox.terminal.create({
  cols: 120,
  rows: 30,
  cwd: '/opt/app',
  onData: (data) => console.log(data),
  onExit: (code) => console.log('Exit:', code)
});

// Execute commands
terminal.write('npm install\n');
terminal.write('npm test\n');
```

[**→ Full Terminal Guide**](https://oblien.com/docs/sandbox/terminal)

### File Watching

```javascript
// Watch for file changes
await sandbox.watcher.start({
  ignorePatterns: ['node_modules', '.git'],
  onChange: (path) => console.log('Changed:', path),
  onAdd: (path) => console.log('Added:', path),
  onUnlink: (path) => console.log('Deleted:', path)
});
```

[**→ Full File Watcher Guide**](https://oblien.com/docs/sandbox/file-watcher)

### Browser Automation

```javascript
// Take screenshot
const screenshot = await sandbox.browser.screenshot({
  url: 'https://example.com',
  width: 1920,
  height: 1080,
  fullPage: true
});

// Get page content
const content = await sandbox.browser.getPageContent({
  url: 'https://example.com',
  waitFor: 1000
});
```

[**→ Full Browser Automation Guide**](https://oblien.com/docs/sandbox/browser)

## Advanced Usage

### Connect to Existing Sandbox

```javascript
// By sandbox ID
const sandbox = await client.sandbox('sandbox_abc123');

// Or with direct token
import { SandboxClient } from 'agent-sandbox';

const sandbox = new SandboxClient({
  token: 'your_sandbox_token'
});
```

### TypeScript Support

Full TypeScript definitions included:

```typescript
import { SandboxClient, FileListOptions } from 'agent-sandbox';

const options: FileListOptions = {
  dirPath: '/opt/app',
  recursive: true
};

const files = await sandbox.files.list(options);
```

### Error Handling

```javascript
try {
  const files = await sandbox.files.list({ dirPath: '/opt/app' });
} catch (error) {
  console.error('Error:', error.message);
}
```

## Documentation

| Resource | Link |
|----------|------|
| 📖 **Complete Documentation** | [oblien.com/docs/sandbox](https://oblien.com/docs/sandbox) |
| 🚀 **Quick Start Guide** | [oblien.com/docs/sandbox/quick-start](https://oblien.com/docs/sandbox/quick-start) |
| 🔐 **Authentication** | [oblien.com/docs/sandbox/authentication](https://oblien.com/docs/sandbox/authentication) |
| 🗂️ **File Operations** | [oblien.com/docs/sandbox/file-operations](https://oblien.com/docs/sandbox/file-operations) |
| 📂 **Git Integration** | [oblien.com/docs/sandbox/git-clone](https://oblien.com/docs/sandbox/git-clone) |
| 💻 **Terminal** | [oblien.com/docs/sandbox/terminal](https://oblien.com/docs/sandbox/terminal) |
| 📸 **Snapshots** | [oblien.com/docs/sandbox/snapshots](https://oblien.com/docs/sandbox/snapshots) |
| 🌐 **Browser Automation** | [oblien.com/docs/sandbox/browser](https://oblien.com/docs/sandbox/browser) |
| 🔌 **WebSocket & Real-time** | [oblien.com/docs/sandbox/websocket](https://oblien.com/docs/sandbox/websocket) |

## Support

- 📧 **Email**: support@oblien.com
- 💬 **Discord**: [discord.gg/oblien](https://discord.gg/oblien)
- 🐛 **Issues**: [GitHub Issues](https://github.com/oblien/agent-sandbox/issues)

## License

MIT © Oblien

---

**Made with ❤️ by [Oblien](https://oblien.com)**

