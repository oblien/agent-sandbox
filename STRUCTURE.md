# SDK Structure Overview

This document provides an overview of the `agent-sandbox` package structure.

## Directory Structure

```
sdk/
├── package.json              # Package configuration
├── .gitignore               # Git ignore patterns
├── README.md                # Main documentation
├── STRUCTURE.md             # This file
├── index.d.ts               # TypeScript type definitions
│
├── src/                     # Source code
│   ├── index.js            # Main entry point (exports)
│   ├── client.js           # SandboxClient class
│   ├── types.js            # JSDoc type definitions
│   │
│   ├── api/                # API modules
│   │   ├── base.js         # Base API class with auth
│   │   ├── files.js        # Files API (list, get, create, delete, etc.)
│   │   ├── git.js          # Git API (clone, commit, push, pull, etc.)
│   │   ├── search.js       # Search API (content & filename search)
│   │   ├── terminal.js     # Terminal API (command execution)
│   │   ├── snapshots.js    # Snapshots API (checkpoints & archives)
│   │   └── websocket.js    # WebSocket API (connections)
│   │
│   └── utils/              # Utilities
│       └── http.js         # HTTP request utilities
│
└── examples/               # Usage examples
    ├── package.json        # Examples package config
    ├── README.md           # Examples documentation
    ├── basic.js            # Basic usage examples
    └── advanced.js         # Advanced usage examples
```

## Module Organization

### Core Modules

**`src/index.js`**
- Main entry point
- Exports all public APIs

**`src/client.js`**
- Main `SandboxClient` class
- Initializes all API modules
- Provides `testConnection()` method

**`src/types.js`**
- JSDoc type definitions
- Used for IntelliSense in JavaScript

**`index.d.ts`**
- TypeScript type definitions
- Full TypeScript support

### API Modules

All API modules extend `BaseAPI` and follow the same pattern:

1. **`api/base.js`** - Base class
   - Handles authentication (Bearer token)
   - Provides HTTP methods (get, post, put, delete)
   - Manages headers

2. **`api/files.js`** - Files API
   - `list()` - List files in directory
   - `get()` - Get file content
   - `create()` - Create file/folder
   - `delete()` - Delete file/folder
   - `rename()` - Rename/move file
   - `upload()` - Upload file
   - `download()` - Download file
   - `exists()` - Check file existence
   - `edit()` - Edit file
   - `merge()` - Merge file edits

3. **`api/git.js`** - Git API
   - `clone()` - Clone repository
   - `pull()` - Pull changes
   - `push()` - Push changes
   - `status()` - Get status
   - `getCurrentBranch()` - Get current branch
   - `listBranches()` - List branches
   - `createBranch()` - Create branch
   - `checkoutBranch()` - Checkout branch
   - `add()` - Add files to staging
   - `commit()` - Commit changes
   - `init()` - Initialize repository
   - `history()` - Get commit history
   - `configUser()` - Configure git user
   - `listKeys()` - List SSH keys

4. **`api/search.js`** - Search API
   - `search()` - Search file contents
   - `searchFileNames()` - Search file names

5. **`api/terminal.js`** - Terminal API
   - `execute()` - Execute terminal command

6. **`api/snapshots.js`** - Snapshots API
   - `commit()` - Create checkpoint
   - `goto()` - Go to checkpoint
   - `listCheckpoints()` - List checkpoints
   - `getCheckpoint()` - Get checkpoint info
   - `getCurrentCheckpoint()` - Get current checkpoint
   - `cleanup()` - Cleanup checkpoints
   - `deleteAfter()` - Delete commits after hash
   - `archive()` - Archive repository
   - `restore()` - Restore from archive
   - `listArchives()` - List archives
   - `getArchive()` - Get archive info
   - `deleteArchive()` - Delete archive
   - `cleanupArchives()` - Cleanup archives

7. **`api/websocket.js`** - WebSocket API
   - `getConnections()` - Get active connections
   - `getConnectionStatus()` - Get connection status
   - `connect()` - Connect to WebSocket
   - `disconnect()` - Disconnect from WebSocket

### Utilities

**`utils/http.js`**
- `request()` - Generic HTTP request with error handling
- `get()` - GET request
- `post()` - POST request
- `put()` - PUT request
- `del()` - DELETE request

## Design Principles

### 1. **Modularity**
Each API is in its own module, making the code easy to navigate and maintain.

### 2. **Consistency**
All API modules follow the same pattern:
- Extend `BaseAPI`
- Use descriptive method names
- Accept options objects as parameters
- Return promises
- Include JSDoc documentation

### 3. **Clean Code**
- Clear separation of concerns
- Self-documenting code
- Comprehensive comments
- Logical file organization

### 4. **Error Handling**
- All methods throw errors on failure
- Network errors are caught and re-thrown with descriptive messages
- HTTP errors include status codes and messages

### 5. **Type Safety**
- Full JSDoc type definitions for JavaScript
- TypeScript definitions for TypeScript users
- IntelliSense support in all modern editors

### 6. **Authentication**
- Token-based authentication
- Automatic header injection via `BaseAPI`
- Secure token handling

## Usage Pattern

Every API follows this pattern:

```javascript
import { SandboxClient } from 'agent-sandbox';

// 1. Initialize client with config
const sandbox = new SandboxClient({
  baseURL: 'https://sandbox.obliencom',
  token: process.env.SANDBOX_TOKEN
});

// 2. Use specific API
const result = await sandbox.files.list({ 
  dirPath: '/opt/app' 
});

// 3. Handle errors
try {
  await sandbox.files.create({ ... });
} catch (error) {
  console.error(error.message);
}
```

## API Endpoint Mapping

| SDK Method | HTTP Endpoint | Method |
|------------|---------------|--------|
| `files.list()` | `/files/list` | POST |
| `files.get()` | `/files/get` | POST |
| `files.create()` | `/files/create` | POST |
| `files.delete()` | `/files/delete` | POST |
| `files.rename()` | `/files/rename` | POST |
| `files.edit()` | `/files/edit` | POST |
| `files.merge()` | `/files/merge` | POST |
| `git.clone()` | `/git/clone` | POST |
| `git.status()` | `/git/status` | POST |
| `git.commit()` | `/git/commit` | POST |
| `search.search()` | `/search` | POST |
| `terminal.execute()` | `/terminal` | POST |
| `snapshots.commit()` | `/snapshots/commit` | POST |
| `websocket.connect()` | `/ws/connect` | POST |
| ... | ... | ... |

## Contributing Guidelines

When adding new features:

1. **Add endpoint** to appropriate API module (or create new one)
2. **Follow naming conventions** - use clear, descriptive method names
3. **Add JSDoc comments** - document parameters and return types
4. **Update TypeScript definitions** - add types to `index.d.ts`
5. **Add examples** - include usage examples in `examples/`
6. **Update README** - document new features in main README

## Testing

To test the SDK:

1. Set environment variable:
   ```bash
   export SANDBOX_TOKEN="your-token"
   ```

2. Run examples:
   ```bash
   cd examples
   npm install
   npm run basic
   ```

## Build & Distribution

To prepare for npm publishing:

1. Update version in `package.json`
2. Test thoroughly
3. Build (if needed)
4. Publish:
   ```bash
   npm publish --access public
   ```

