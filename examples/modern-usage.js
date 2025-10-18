/**
 * Modern, clean usage patterns for buildcore
 * 
 * Documentation: https://oblien.com/docs/sandbox
 * 
 * This example shows the cleanest, most modern way to use the SDK.
 */

import { OblienClient } from 'buildcore';

async function modernExample() {
  console.log('=== Modern SDK Usage ===\n');

  // 1. Initialize client with credentials
  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  // 2. Create sandbox - returns ready-to-use client!
  console.log('Creating sandbox...');
  const sandbox = await client.createSandbox({
    name: 'my-app-dev',
    region: 'us-east-1'
  });
  console.log(`✓ Sandbox ready: ${sandbox.sandboxId}\n`);

  // 3. Use it immediately - no need for extra setup!
  console.log('Setting up project...');
  
  // Create project structure
  await sandbox.files.create({
    fullPath: '/opt/app/package.json',
    content: JSON.stringify({
      name: 'my-app',
      version: '1.0.0',
      type: 'module'
    }, null, 2)
  });

  await sandbox.files.create({
    fullPath: '/opt/app/src',
    isFolder: true
  });

  await sandbox.files.create({
    fullPath: '/opt/app/src/index.js',
    content: `export function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
`
  });

  console.log('✓ Project structure created\n');

  // Initialize git
  console.log('Initializing git...');
  await sandbox.git.init({ repoPath: '/opt/app' });
  await sandbox.git.configUser({
    repoPath: '/opt/app',
    name: 'Developer',
    email: 'dev@example.com'
  });
  await sandbox.git.add({ repoPath: '/opt/app', files: ['.'] });
  await sandbox.git.commit({
    repoPath: '/opt/app',
    message: 'Initial commit'
  });
  console.log('✓ Git initialized\n');

  // Create snapshot
  console.log('Creating snapshot...');
  await sandbox.snapshots.commit({
    message: 'Project setup complete'
  });
  console.log('✓ Snapshot created\n');

  // List files
  console.log('Project files:');
  const files = await sandbox.files.list({
    dirPath: '/opt/app',
    recursive: true
  });
  console.log(files);

  console.log('\n✅ All done!');
  console.log(`\n💡 Your sandbox: ${sandbox.sandboxId}`);
  console.log('To reconnect later:\n');
  console.log('  const sandbox = await client.sandbox("' + sandbox.sandboxId + '");');
}

async function reconnectExample() {
  console.log('\n=== Reconnecting to Existing Sandbox ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  // Connect to existing sandbox by ID
  const sandboxId = process.env.SANDBOX_ID;
  if (!sandboxId) {
    console.log('Set SANDBOX_ID to try this example');
    return;
  }

  console.log(`Connecting to sandbox: ${sandboxId}`);
  const sandbox = await client.sandbox(sandboxId);
  console.log('✓ Connected!\n');

  // Use it
  const files = await sandbox.files.list({ dirPath: '/opt/app' });
  console.log('Files:', files);
}

async function listAllSandboxes() {
  console.log('\n=== Managing Multiple Sandboxes ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  // List all sandboxes
  const { sandboxes } = await client.sandboxes.list();
  console.log(`You have ${sandboxes?.length || 0} sandboxes:\n`);

  for (const sb of sandboxes || []) {
    console.log(`  • ${sb.name} (${sb.id}) - ${sb.status}`);
  }

  // Connect to any of them
  if (sandboxes && sandboxes.length > 0) {
    console.log(`\nConnecting to first sandbox: ${sandboxes[0].name}`);
    const sandbox = await client.sandbox(sandboxes[0].id);
    
    const files = await sandbox.files.list({ dirPath: '/opt/app' });
    console.log('Files:', files.files?.length || 0);
  }
}

async function cleanupExample() {
  console.log('\n=== Cleanup & Management ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  // Create a temporary sandbox
  console.log('Creating temporary sandbox...');
  const sandbox = await client.createSandbox({
    name: 'temp-sandbox'
  });
  console.log(`✓ Created: ${sandbox.sandboxId}\n`);

  // Use it
  await sandbox.files.create({
    fullPath: '/opt/app/test.txt',
    content: 'Test content'
  });
  console.log('✓ Did some work\n');

  // Stop it when done
  console.log('Stopping sandbox...');
  await client.sandboxes.stop(sandbox.sandboxId);
  console.log('✓ Sandbox stopped\n');

  // Delete it if no longer needed
  console.log('Deleting sandbox...');
  await client.sandboxes.delete(sandbox.sandboxId);
  console.log('✓ Sandbox deleted\n');
}

// Run examples
async function main() {
  try {
    // Run the modern example
    await modernExample();

    // Uncomment to try other examples:
    // await reconnectExample();
    // await listAllSandboxes();
    // await cleanupExample();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
  }
}

main();

