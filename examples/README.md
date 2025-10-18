# SDK Examples

This directory contains examples demonstrating how to use the `buildcore`.

📚 **[Full Documentation](https://oblien.com/docs/sandbox)**

## Running Examples

1. Set your credentials:
```bash
export OBLIEN_CLIENT_ID="your-client-id"
export OBLIEN_CLIENT_SECRET="your-client-secret"
```

Get your credentials from [oblien.com/account/api](https://oblien.com/account/api).

2. Install dependencies (from the examples directory):
```bash
npm install
```

3. Run an example:
```bash
# Modern usage (RECOMMENDED - cleanest API)
npm run modern

# Complete workflow (step-by-step)
npm run complete

# Basic examples
npm run basic

# Advanced examples
npm run advanced
```

## Files

- **modern-usage.js** - **START HERE!** Modern, clean API usage:
  - Shows the simplest way to use the SDK
  - One-step sandbox creation and connection
  - Reconnecting to existing sandboxes
  - Managing multiple sandboxes

- **complete-workflow.js** - Complete end-to-end example:
  - Authentication with OblienClient
  - Creating a sandbox
  - Connecting to the sandbox
  - File operations, git, snapshots, and more
  - Best practices and cleanup

- **basic.js** - Basic usage examples covering:
  - File operations (create, read, delete, rename)
  - Git operations (status, branches, history)
  - Search operations
  - Snapshot operations
  - Terminal operations

- **advanced.js** - Advanced usage examples covering:
  - Complete git workflow
  - Snapshot and archive management
  - Batch file operations
  - Project setup automation
  - Error handling and retry logic

## Environment Variables

Required:
- `OBLIEN_CLIENT_ID` - Your Oblien client ID
- `OBLIEN_CLIENT_SECRET` - Your Oblien client secret

Optional (for basic/advanced examples):
- `SANDBOX_URL` - Sandbox URL (if using existing sandbox)
- `SANDBOX_TOKEN` - Sandbox token (if using existing sandbox)

## Customization

Feel free to modify these examples to test specific features or workflows. Each example is self-contained and can be run independently.

