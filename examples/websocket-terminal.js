/**
 * WebSocket + Terminal examples for agent-sandbox
 * 
 * Documentation: https://oblien.com/agent-sandbox
 */

import { OblienClient } from 'agent-sandbox';

async function terminalExample() {
  console.log('=== Terminal Example (Clean API) ===\n');

  // Create sandbox
  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  const sandbox = await client.createSandbox({
    name: 'terminal-demo'
  });
  console.log(`✓ Sandbox created: ${sandbox.sandboxId}\n`);

  // Create terminal - WebSocket auto-connects!
  console.log('Creating terminal...');
  const terminal = await sandbox.terminal.create({
    cols: 120,
    rows: 30,
    cwd: '/opt/app',
    onData: (data) => {
      // This is called for each output chunk
      process.stdout.write(data);
    },
    onExit: (code, signal) => {
      console.log(`\nTerminal exited with code ${code}`);
    }
  });
  console.log(`✓ Terminal created: ${terminal.id}\n`);

  // Execute some commands
  console.log('Executing commands...\n');
  
  terminal.write('pwd\n');
  await sleep(500);
  
  terminal.write('ls -la\n');
  await sleep(500);
  
  terminal.write('echo "Hello from WebSocket terminal!"\n');
  await sleep(500);

  // Get terminal state
  console.log('\nGetting terminal state...');
  const state = await terminal.getState({
    newOnly: false,
    maxLines: 50
  });
  console.log('State length:', state.length);

  // Resize terminal
  console.log('Resizing terminal...');
  await terminal.resize(150, 40);
  console.log('✓ Terminal resized\n');

  // Close terminal
  console.log('Closing terminal...');
  await terminal.close();
  console.log('✓ Terminal closed\n');

  // Disconnect (optional - auto-disconnects on cleanup)
  sandbox.terminal.disconnect();
  console.log('✓ Disconnected');
}

async function fileWatcherExample() {
  console.log('\n=== File Watcher Example (Clean API) ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  const sandbox = await client.createSandbox({
    name: 'watcher-demo'
  });
  console.log(`✓ Sandbox created: ${sandbox.sandboxId}\n`);

  // Start file watcher - WebSocket auto-connects!
  console.log('Starting file watcher...');
  await sandbox.watcher.start({
    ignorePatterns: ['node_modules', '.git', 'dist'],
    onAdd: (path) => {
      console.log(`📄 File added: ${path}`);
    },
    onChange: (path) => {
      console.log(`✏️  File changed: ${path}`);
    },
    onUnlink: (path) => {
      console.log(`🗑️  File deleted: ${path}`);
    },
    onError: (error) => {
      console.error(` Watcher error:`, error);
    }
  });
  console.log('✓ File watcher started\n');

  console.log('Making some file changes...\n');

  // Create a file (should trigger onAdd)
  await sandbox.files.create({
    fullPath: '/opt/app/test.txt',
    content: 'Initial content'
  });
  await sleep(1000);

  // Modify the file (should trigger onChange)
  await sandbox.files.edit({
    filePath: '/opt/app/test.txt',
    content: 'Modified content'
  });
  await sleep(1000);

  // Delete the file (should trigger onUnlink)
  await sandbox.files.delete({
    filePath: '/opt/app/test.txt'
  });
  await sleep(1000);

  console.log('\nStopping file watcher...');
  sandbox.watcher.stop();
  console.log('✓ File watcher stopped\n');
}

async function multipleTerminalsExample() {
  console.log('\n=== Multiple Terminals Example (Clean API) ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  const sandbox = await client.createSandbox({
    name: 'multi-terminal-demo'
  });
  console.log(`✓ Sandbox created\n`);

  // Create multiple terminals - super clean!
  console.log('Creating 3 terminals...');
  
  const term1 = await sandbox.terminal.create({
    onData: (data) => console.log(`[Terminal 1] ${data.trim()}`)
  });
  
  const term2 = await sandbox.terminal.create({
    onData: (data) => console.log(`[Terminal 2] ${data.trim()}`)
  });
  
  const term3 = await sandbox.terminal.create({
    onData: (data) => console.log(`[Terminal 3] ${data.trim()}`)
  });

  console.log(`✓ Created terminals: ${term1.id}, ${term2.id}, ${term3.id}\n`);

  // List all terminals
  const terminals = await sandbox.terminal.list();
  console.log('Active terminals:', terminals);
  console.log();

  // Run different commands in each
  term1.write('echo "Terminal 1"\n');
  term2.write('echo "Terminal 2"\n');
  term3.write('echo "Terminal 3"\n');

  await sleep(1000);

  // Close all terminals
  console.log('\nClosing all terminals...');
  await term1.close();
  await term2.close();
  await term3.close();
  console.log('✓ All terminals closed\n');
}

async function interactiveTerminalExample() {
  console.log('\n=== Interactive Terminal Example (Clean API) ===\n');

  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  const sandbox = await client.createSandbox({
    name: 'interactive-demo'
  });

  // Create interactive terminal - clean and direct!
  const terminal = await sandbox.terminal.create({
    cols: 120,
    rows: 30,
    onData: (data) => {
      process.stdout.write(data);
    }
  });

  console.log('Terminal ready. Type commands:\n');

  // Run a series of commands
  const commands = [
    'cd /opt/app',
    'ls -la',
    'whoami',
    'pwd',
    'uname -a'
  ];

  for (const cmd of commands) {
    console.log(`\n$ ${cmd}`);
    terminal.write(cmd + '\n');
    await sleep(1000);
  }

  console.log('\n\nGetting full terminal state...');
  const fullState = await terminal.getState({
    newOnly: false,
    maxLines: 100
  });
  
  const decodedState = Buffer.from(fullState, 'base64').toString('utf-8');
  console.log('\nFull terminal output:');
  console.log('='.repeat(60));
  console.log(decodedState);
  console.log('='.repeat(60));

  await terminal.close();
}

// Utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
async function main() {
  try {
    // Run examples (uncomment what you want)
    await terminalExample();
    // await fileWatcherExample();
    // await multipleTerminalsExample();
    // await interactiveTerminalExample();

  } catch (error) {
    console.error('\n Error:', error.message);
    console.error(error.stack);
  }
}

main();

