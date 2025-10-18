# Quick Start Guide

📚 **[Full Documentation](https://oblien.com/docs/sandbox)**

## Installation

```bash
npm install buildcore
```

## Basic Setup

### Modern Way (Recommended)

```javascript
import { OblienClient } from 'buildcore';

const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// Create sandbox - returns ready-to-use client!
const sandbox = await client.createSandbox({
  name: 'my-dev-sandbox'
});

// Use immediately
await sandbox.files.list({ dirPath: '/opt/app' });
```

### Reconnect to Existing Sandbox

```javascript
const sandbox = await client.sandbox('sandbox_abc123');
await sandbox.files.list({ dirPath: '/opt/app' });
```

## Common Operations

### Files

```javascript
// List files
await sandbox.files.list({ dirPath: '/opt/app' });

// Read file
await sandbox.files.get({ filePath: '/opt/app/file.js' });

// Create file
await sandbox.files.create({
  fullPath: '/opt/app/new.js',
  content: 'console.log("hi");'
});

// Delete file
await sandbox.files.delete({ filePath: '/opt/app/old.js' });

// Rename file
await sandbox.files.rename({
  sourcePath: '/opt/app/old.js',
  destinationPath: '/opt/app/new.js'
});
```

### Git

```javascript
// Clone
await sandbox.git.clone({
  url: 'https://github.com/user/repo.git',
  targetDir: '/opt/app'
});

// Status
await sandbox.git.status({ repoPath: '/opt/app' });

// Add & Commit
await sandbox.git.add({ repoPath: '/opt/app', files: ['.'] });
await sandbox.git.commit({
  repoPath: '/opt/app',
  message: 'Update'
});

// Push
await sandbox.git.push({ repoPath: '/opt/app' });
```

### Search

```javascript
// Search content
await sandbox.search.search({
  query: 'searchTerm',
  options: { path: '/opt/app' }
});

// Search filenames
await sandbox.search.searchFileNames({
  query: 'component'
});
```

### Snapshots

```javascript
// Create checkpoint
await sandbox.snapshots.commit({ message: 'Checkpoint' });

// List checkpoints
await sandbox.snapshots.listCheckpoints({ limit: 10 });

// Go to checkpoint
await sandbox.snapshots.goto({ commitHash: 'abc123' });

// Archive
await sandbox.snapshots.archive({ id: 'v1' });
```

### Terminal

```javascript
// Run command
await sandbox.terminal.execute({
  command: 'npm install',
  cwd: '/opt/app'
});
```

## Error Handling

```javascript
try {
  await sandbox.files.get({ filePath: '/missing.txt' });
} catch (error) {
  console.error('Error:', error.message);
}
```

## Full Documentation

See [README.md](README.md) for complete API reference and [examples/](examples/) for detailed examples.

