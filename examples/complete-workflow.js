/**
 * Complete workflow example showing authentication, sandbox creation, and usage
 * 
 * Documentation: https://oblien.com/docs/sandbox
 */

import { OblienClient, SandboxClient } from 'buildcore';

async function completeWorkflow() {
  console.log('=== Complete Oblien Sandbox Workflow ===\n');

  // Step 1: Authenticate with Oblien
  console.log('Step 1: Authenticating with Oblien...');
  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });
  console.log('✓ Authenticated\n');

  // Step 2: Create a new sandbox (automatically returns ready-to-use client)
  console.log('Step 2: Creating a new sandbox...');
  const sandbox = await client.createSandbox({
    name: 'demo-sandbox',
    region: 'us-east-1'
  });
  console.log('✓ Sandbox created and connected!');
  console.log(`  ID: ${sandbox.sandboxId}`);
  console.log(`  Name: ${sandbox.sandboxName}\n`);

  // Step 3: Work with the sandbox (it's ready to use!)
  console.log('Step 3: Working with files...');
  
  // Create a directory
  await sandbox.files.create({
    fullPath: '/opt/app/src',
    isFolder: true
  });
  console.log('✓ Created directory: /opt/app/src');

  // Create a file
  await sandbox.files.create({
    fullPath: '/opt/app/src/index.js',
    content: `console.log('Hello from Oblien Sandbox!');

function greet(name) {
  return \`Hello, \${name}!\`;
}

module.exports = { greet };
`
  });
  console.log('✓ Created file: /opt/app/src/index.js');

  // Read the file back
  const fileContent = await sandbox.files.get({
    filePath: '/opt/app/src/index.js'
  });
  console.log('✓ Read file successfully');

  // List files
  const files = await sandbox.files.list({
    dirPath: '/opt/app',
    recursive: true
  });
  console.log(`✓ Found ${files.files?.length || 0} files\n`);

  // Step 4: Initialize git repository
  console.log('Step 4: Setting up git...');
  
  await sandbox.git.init({
    repoPath: '/opt/app'
  });
  console.log('✓ Initialized git repository');

  await sandbox.git.configUser({
    repoPath: '/opt/app',
    name: 'Demo User',
    email: 'demo@example.com'
  });
  console.log('✓ Configured git user');

  await sandbox.git.add({
    repoPath: '/opt/app',
    files: ['.']
  });
  console.log('✓ Added files to git');

  await sandbox.git.commit({
    repoPath: '/opt/app',
    message: 'Initial commit'
  });
  console.log('✓ Created initial commit\n');

  // Step 5: Create a snapshot
  console.log('Step 5: Creating snapshot...');
  const snapshot = await sandbox.snapshots.commit({
    message: 'Initial project setup'
  });
  console.log(`✓ Snapshot created: ${snapshot.commitHash}\n`);

  // Step 6: Execute a command
  console.log('Step 6: Running terminal command...');
  const result = await sandbox.terminal.execute({
    command: 'ls -la /opt/app',
    cwd: '/opt/app'
  });
  console.log('✓ Command executed successfully\n');

  // Step 7: Search for content
  console.log('Step 7: Searching files...');
  const searchResults = await sandbox.search.search({
    query: 'greet',
    options: { path: '/opt/app' }
  });
  console.log(`✓ Found ${searchResults.matches?.length || 0} matches\n`);

  // Step 8: List all sandboxes
  console.log('Step 8: Listing all sandboxes...');
  const allSandboxes = await client.sandboxes.list();
  console.log(`✓ You have ${allSandboxes.sandboxes?.length || 0} sandbox(es)\n`);

  // Step 9: Get sandbox metrics
  console.log('Step 9: Getting sandbox metrics...');
  const metrics = await client.sandboxes.metrics(sandbox.sandboxId);
  console.log('✓ Metrics retrieved:', metrics);

  console.log('\n=== Workflow Complete! ===\n');
  console.log('💡 Tips:');
  console.log('  - Keep your sandbox token secure');
  console.log('  - Use snapshots to save important states');
  console.log('  - Stop sandboxes when not in use to save resources');
  console.log('  - Visit https://oblien.com/docs/sandbox for full documentation');
  console.log('\n🧹 Cleanup (optional):');
  console.log(`  await client.sandboxes.delete('${sandbox.sandboxId}');\n`);

  return sandbox;
}

// Run the workflow
async function main() {
  try {
    const sandbox = await completeWorkflow();
    
    // Optionally clean up (uncomment to delete sandbox after demo)
    // console.log('\nCleaning up...');
    // await client.sandboxes.delete(sandbox.id);
    // console.log('✓ Sandbox deleted');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();

