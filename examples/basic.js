/**
 * Basic usage examples for agent-sandbox
 * 
 * Documentation: https://oblien.com/agent-sandbox
 * 
 * Prerequisites:
 * - Set OBLIEN_CLIENT_ID environment variable
 * - Set OBLIEN_CLIENT_SECRET environment variable
 * - Optionally set SANDBOX_ID to connect to existing sandbox
 */

import { OblienClient } from 'agent-sandbox';

// Initialize Oblien client
const client = new OblienClient({
  clientId: process.env.OBLIEN_CLIENT_ID,
  clientSecret: process.env.OBLIEN_CLIENT_SECRET
});

// Get sandbox client - either create new or connect to existing
let sandbox;
if (process.env.SANDBOX_ID) {
  // Connect to existing sandbox
  sandbox = await client.sandbox(process.env.SANDBOX_ID);
} else {
  // Create new sandbox (returns ready-to-use client)
  sandbox = await client.createSandbox({
    name: 'basic-examples-sandbox'
  });
  console.log(`Created sandbox: ${sandbox.sandboxId}\n`);
}

async function basicFileOperations() {
  console.log('=== File Operations ===\n');

  // List files
  console.log('1. Listing files...');
  const files = await sandbox.files.list({ 
    dirPath: '/opt/app',
    recursive: false
  });
  console.log('Files:', files);

  // Create a file
  console.log('\n2. Creating a file...');
  await sandbox.files.create({
    fullPath: '/opt/app/example.txt',
    content: 'Hello from SDK!'
  });
  console.log('File created');

  // Read the file
  console.log('\n3. Reading file content...');
  const content = await sandbox.files.get({
    filePath: '/opt/app/example.txt'
  });
  console.log('Content:', content);

  // Check if file exists
  console.log('\n4. Checking if file exists...');
  const exists = await sandbox.files.exists({
    filePath: '/opt/app/example.txt'
  });
  console.log('Exists:', exists);

  // Rename the file
  console.log('\n5. Renaming file...');
  await sandbox.files.rename({
    sourcePath: '/opt/app/example.txt',
    destinationPath: '/opt/app/renamed.txt'
  });
  console.log('File renamed');

  // Delete the file
  console.log('\n6. Deleting file...');
  await sandbox.files.delete({
    filePath: '/opt/app/renamed.txt'
  });
  console.log('File deleted');
}

async function gitOperations() {
  console.log('\n=== Git Operations ===\n');

  const repoPath = '/opt/app';

  // Check if it's a git repository
  console.log('1. Checking if directory is a git repo...');
  const isRepo = await sandbox.git.check({ repoPath });
  console.log('Is git repo:', isRepo);

  // Get current branch
  console.log('\n2. Getting current branch...');
  const branch = await sandbox.git.getCurrentBranch({ repoPath });
  console.log('Current branch:', branch);

  // Get status
  console.log('\n3. Getting git status...');
  const status = await sandbox.git.status({ repoPath });
  console.log('Status:', status);

  // List branches
  console.log('\n4. Listing branches...');
  const branches = await sandbox.git.listBranches({ 
    repoPath,
    includeRemote: true
  });
  console.log('Branches:', branches);

  // Get commit history
  console.log('\n5. Getting commit history...');
  const history = await sandbox.git.history({ 
    repoPath,
    limit: 5
  });
  console.log('Recent commits:', history);
}

async function searchOperations() {
  console.log('\n=== Search Operations ===\n');

  // Search file contents
  console.log('1. Searching file contents...');
  const contentResults = await sandbox.search.search({
    query: 'function',
    options: {
      caseSensitive: false,
      path: '/opt/app'
    }
  });
  console.log('Content search results:', contentResults);

  // Search file names
  console.log('\n2. Searching file names...');
  const nameResults = await sandbox.search.searchFileNames({
    query: 'index',
    options: { path: '/opt/app' }
  });
  console.log('Filename search results:', nameResults);
}

async function snapshotOperations() {
  console.log('\n=== Snapshot Operations ===\n');

  // Create a checkpoint
  console.log('1. Creating checkpoint...');
  const checkpoint = await sandbox.snapshots.commit({
    message: 'Example checkpoint from SDK'
  });
  console.log('Checkpoint created:', checkpoint);

  // List checkpoints
  console.log('\n2. Listing checkpoints...');
  const checkpoints = await sandbox.snapshots.listCheckpoints({ 
    limit: 10 
  });
  console.log('Checkpoints:', checkpoints);

  // Get current checkpoint
  console.log('\n3. Getting current checkpoint...');
  const current = await sandbox.snapshots.getCurrentCheckpoint();
  console.log('Current checkpoint:', current);

  // List archives
  console.log('\n4. Listing archives...');
  const archives = await sandbox.snapshots.listArchives();
  console.log('Archives:', archives);
}

async function terminalOperations() {
  console.log('\n=== Terminal Operations ===\n');

  // Execute a command
  console.log('1. Executing command...');
  const result = await sandbox.terminal.execute({
    command: 'ls -la',
    cwd: '/opt/app'
  });
  console.log('Command result:', result);
}

async function main() {
  try {
    // Get sandbox client
    let sandbox;
    if (process.env.SANDBOX_ID) {
      console.log('Connecting to existing sandbox...');
      sandbox = await client.sandbox(process.env.SANDBOX_ID);
    } else {
      console.log('Creating new sandbox...');
      sandbox = await client.createSandbox({
        name: 'basic-examples-sandbox'
      });
      console.log(`✓ Sandbox created: ${sandbox.sandboxId}\n`);
    }

    // Run examples (uncomment what you want to test)
    await basicFileOperations();
    // await gitOperations();
    // await searchOperations();
    // await snapshotOperations();
    // await terminalOperations();

    console.log('\n✅ Examples completed!');
    console.log('\n💡 Tip: Set SANDBOX_ID to reuse this sandbox:');
    console.log(`   export SANDBOX_ID="${sandbox.sandboxId}"`);

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the examples
main();

