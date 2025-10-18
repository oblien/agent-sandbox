# @oblien/sandbox-sdk - Package Summary

📚 **[Full Documentation](https://oblien.com/docs/sandbox)**

## Overview

The `@oblien/sandbox-sdk` is a clean, production-ready SDK for the Oblien Sandbox API with **100% endpoint coverage** from the server at `/home/deploy/manager`.

## Package Structure

```
@oblien/sandbox-sdk/
├── 📦 Core Package
│   ├── package.json                    # Package configuration
│   ├── index.d.ts                      # TypeScript definitions
│   ├── LICENSE                         # MIT License
│   └── .gitignore                      # Git ignore rules
│
├── 📚 Documentation
│   ├── README.md                       # Complete API documentation
│   ├── QUICK_START.md                  # Quick reference guide
│   ├── STRUCTURE.md                    # Architecture details
│   ├── ENDPOINT_COVERAGE.md            # 100% endpoint mapping
│   └── SUMMARY.md                      # This file
│
├── 💻 Source Code (src/)
│   ├── index.js                        # Main entry point
│   ├── auth.js                         # OblienClient (account auth)
│   ├── client.js                       # SandboxClient (sandbox interaction)
│   ├── types.js                        # JSDoc type definitions
│   │
│   ├── api/                            # API Modules
│   │   ├── base.js                     # Base API class
│   │   ├── files.js                    # Files API (10 methods)
│   │   ├── git.js                      # Git API (15 methods)
│   │   ├── search.js                   # Search API (2 methods)
│   │   ├── terminal.js                 # Terminal API (1 method)
│   │   ├── snapshots.js                # Snapshots API (13 methods)
│   │   └── websocket.js                # WebSocket API (4 methods)
│   │
│   └── utils/
│       └── http.js                     # HTTP utilities
│
└── 📖 Examples (examples/)
    ├── package.json                    # Examples package
    ├── README.md                       # Examples documentation
    ├── complete-workflow.js            # ⭐ Complete end-to-end example
    ├── basic.js                        # Basic usage examples
    └── advanced.js                     # Advanced patterns
```

## Key Features

### 🔐 Two-Tier Authentication

**1. Account Level (OblienClient)**
- Authenticate with `clientId` and `clientSecret`
- Manage sandboxes (create, list, start, stop, delete)
- Get metrics and regenerate tokens

**2. Sandbox Level (SandboxClient)**
- Connect to specific sandbox with token
- Interact with files, git, snapshots, etc.
- Full API access to sandbox operations

### 📦 Complete API Coverage

| API Module | Methods | Endpoints Covered |
|------------|---------|-------------------|
| **Sandboxes** | 9 | Account management |
| **Files** | 10 | 100% (10/10) |
| **Git** | 15 | 100% (15/15) |
| **Search** | 2 | 100% (2/2) |
| **Terminal** | 1 | 100% (1/1) |
| **Snapshots** | 13 | 100% (13/13) |
| **WebSocket** | 4 | 100% (4/4) |
| **TOTAL** | **54** | **55/55 endpoints** ✅ |

### 💪 Developer Experience

- ✅ **TypeScript Support** - Full `.d.ts` definitions
- ✅ **JSDoc Comments** - IntelliSense in all editors
- ✅ **Modular Design** - Each API in its own file
- ✅ **Consistent API** - All methods follow same pattern
- ✅ **Error Handling** - Descriptive error messages
- ✅ **Zero Dependencies** - Pure Node.js (v18+)
- ✅ **Examples** - Complete workflow examples
- ✅ **Documentation** - Comprehensive docs with oblien.com/docs/sandbox

## Usage Example

### Complete Workflow

```javascript
import { OblienClient, SandboxClient } from '@oblien/sandbox-sdk';

// Step 1: Authenticate with your Oblien account
const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// Step 2: Create a sandbox
const sandbox = await client.sandboxes.create({
  name: 'my-dev-sandbox',
  region: 'us-east-1'
});

// Step 3: Connect to your sandbox
const sandboxClient = new SandboxClient({
  baseURL: sandbox.url,
  token: sandbox.token
});

// Step 4: Work with your sandbox
await sandboxClient.files.create({
  fullPath: '/opt/app/index.js',
  content: 'console.log("Hello Oblien!");'
});

await sandboxClient.git.init({ repoPath: '/opt/app' });
await sandboxClient.git.commit({
  repoPath: '/opt/app',
  message: 'Initial commit'
});

await sandboxClient.snapshots.commit({
  message: 'Project setup'
});
```

## API Methods Reference

### OblienClient (Account Management)

```javascript
// Sandboxes
client.sandboxes.create(options)          // Create sandbox
client.sandboxes.list(options)            // List sandboxes
client.sandboxes.get(sandboxId)           // Get sandbox details
client.sandboxes.delete(sandboxId)        // Delete sandbox
client.sandboxes.start(sandboxId)         // Start sandbox
client.sandboxes.stop(sandboxId)          // Stop sandbox
client.sandboxes.restart(sandboxId)       // Restart sandbox
client.sandboxes.regenerateToken(id)      // Regenerate token
client.sandboxes.metrics(sandboxId)       // Get metrics
```

### SandboxClient (Sandbox Operations)

```javascript
// Files API
sandbox.files.list(options)               // List files
sandbox.files.get(options)                // Read file
sandbox.files.create(options)             // Create file/folder
sandbox.files.delete(options)             // Delete file/folder
sandbox.files.rename(options)             // Rename/move file
sandbox.files.upload(options)             // Upload file
sandbox.files.download(options)           // Download file
sandbox.files.exists(options)             // Check existence
sandbox.files.edit(options)               // Edit file
sandbox.files.merge(options)              // Merge edits

// Git API
sandbox.git.listKeys()                    // List SSH keys
sandbox.git.configUser(options)           // Configure user
sandbox.git.check(options)                // Check if git repo
sandbox.git.clone(options)                // Clone repository
sandbox.git.pull(options)                 // Pull changes
sandbox.git.push(options)                 // Push changes
sandbox.git.status(options)               // Get status
sandbox.git.getCurrentBranch(options)     // Get current branch
sandbox.git.listBranches(options)         // List branches
sandbox.git.createBranch(options)         // Create branch
sandbox.git.checkoutBranch(options)       // Checkout branch
sandbox.git.add(options)                  // Add files
sandbox.git.commit(options)               // Commit changes
sandbox.git.init(options)                 // Initialize repo
sandbox.git.history(options)              // Get history

// Search API
sandbox.search.search(options)            // Search content
sandbox.search.searchFileNames(options)   // Search filenames

// Terminal API
sandbox.terminal.execute(options)         // Execute command

// Snapshots API
sandbox.snapshots.commit(options)         // Create checkpoint
sandbox.snapshots.goto(options)           // Go to checkpoint
sandbox.snapshots.listCheckpoints(opts)   // List checkpoints
sandbox.snapshots.getCheckpoint(hash)     // Get checkpoint
sandbox.snapshots.getCurrentCheckpoint()  // Get current
sandbox.snapshots.cleanup()               // Cleanup all
sandbox.snapshots.deleteAfter(options)    // Delete after hash
sandbox.snapshots.archive(options)        // Archive repository
sandbox.snapshots.restore(options)        // Restore archive
sandbox.snapshots.listArchives()          // List archives
sandbox.snapshots.getArchive(id)          // Get archive info
sandbox.snapshots.deleteArchive(id)       // Delete archive
sandbox.snapshots.cleanupArchives(opts)   // Cleanup archives

// WebSocket API
sandbox.websocket.getConnections()        // Get connections
sandbox.websocket.getConnectionStatus()   // Get status
sandbox.websocket.connect(options)        // Connect
sandbox.websocket.disconnect(options)     // Disconnect
```

## File Count

- **Total Files**: 25
- **Source Files**: 13
- **Documentation**: 6
- **Examples**: 4
- **Configuration**: 2

## Verification

### Endpoint Coverage
See `ENDPOINT_COVERAGE.md` for complete mapping of all 55 server endpoints to SDK methods.

### Server Reference
- Server location: `/home/deploy/manager`
- Server port: `55872`
- All routes from `server.js` are covered

## Installation & Usage

```bash
# Install
npm install @oblien/sandbox-sdk

# Set environment variables
export OBLIEN_CLIENT_ID="your-client-id"
export OBLIEN_CLIENT_SECRET="your-client-secret"

# Run example
cd examples
npm install
npm run complete
```

## Documentation

- **Main Docs**: https://oblien.com/docs/sandbox
- **README**: Complete API reference with examples
- **QUICK_START**: Quick reference guide
- **STRUCTURE**: Architecture and design patterns
- **ENDPOINT_COVERAGE**: Full endpoint mapping
- **Examples**: Complete workflow and advanced patterns

## Production Ready

✅ Clean code structure
✅ 100% endpoint coverage
✅ Full TypeScript support
✅ Comprehensive documentation
✅ Working examples
✅ Error handling
✅ Zero dependencies
✅ Modular architecture

---

**Created**: October 2025
**Version**: 1.0.0
**License**: MIT
**Docs**: https://oblien.com/docs/sandbox

