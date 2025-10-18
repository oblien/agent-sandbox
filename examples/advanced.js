/**
 * Advanced usage examples for agent-sandbox
 */

import { SandboxClient } from 'agent-sandbox';

const sandbox = new SandboxClient({
  baseURL: 'https://sandbox.oblien.com:55872',
  token: process.env.SANDBOX_TOKEN
});

/**
 * Example: Complete Git Workflow
 */
async function gitWorkflow() {
  console.log('=== Complete Git Workflow ===\n');

  const repoPath = '/opt/my-project';

  // Initialize repository
  console.log('1. Initializing repository...');
  await sandbox.git.init({ repoPath });

  // Configure user
  console.log('2. Configuring git user...');
  await sandbox.git.configUser({
    repoPath,
    name: 'Developer',
    email: 'dev@example.com'
  });

  // Create some files
  console.log('3. Creating files...');
  await sandbox.files.create({
    fullPath: `${repoPath}/README.md`,
    content: '# My Project\n\nA sample project'
  });
  await sandbox.files.create({
    fullPath: `${repoPath}/index.js`,
    content: 'console.log("Hello World");'
  });

  // Add files to staging
  console.log('4. Adding files to staging...');
  await sandbox.git.add({
    repoPath,
    files: ['.']
  });

  // Commit
  console.log('5. Committing changes...');
  await sandbox.git.commit({
    repoPath,
    message: 'Initial commit'
  });

  // Create a feature branch
  console.log('6. Creating feature branch...');
  await sandbox.git.createBranch({
    repoPath,
    branchName: 'feature/new-feature',
    checkout: true
  });

  // Make changes
  console.log('7. Making changes...');
  await sandbox.files.edit({
    filePath: `${repoPath}/index.js`,
    content: 'console.log("Hello from feature branch!");'
  });

  // Commit feature changes
  await sandbox.git.add({ repoPath, files: ['.'] });
  await sandbox.git.commit({
    repoPath,
    message: 'Add new feature'
  });

  // Switch back to main
  console.log('8. Switching back to main...');
  await sandbox.git.checkoutBranch({
    repoPath,
    branchName: 'main'
  });

  console.log('\nGit workflow completed!');
}

/**
 * Example: Snapshot and Archive Management
 */
async function snapshotArchiveWorkflow() {
  console.log('\n=== Snapshot & Archive Workflow ===\n');

  // Create initial checkpoint
  console.log('1. Creating initial checkpoint...');
  const cp1 = await sandbox.snapshots.commit({
    message: 'Before major changes'
  });
  console.log('Checkpoint:', cp1.commitHash);

  // Make some changes
  console.log('2. Making changes...');
  await sandbox.files.create({
    fullPath: '/opt/app/temp-file.txt',
    content: 'Temporary content'
  });

  // Create another checkpoint
  console.log('3. Creating second checkpoint...');
  const cp2 = await sandbox.snapshots.commit({
    message: 'After adding temp file'
  });
  console.log('Checkpoint:', cp2.commitHash);

  // Archive the current state
  console.log('4. Creating archive...');
  await sandbox.snapshots.archive({
    id: 'stable-v1',
    options: {}
  });

  // List all archives
  console.log('5. Listing archives...');
  const archives = await sandbox.snapshots.listArchives();
  console.log('Archives:', archives);

  // Go back to first checkpoint
  console.log('6. Rolling back to first checkpoint...');
  await sandbox.snapshots.goto({
    commitHash: cp1.commitHash
  });

  console.log('\nSnapshot workflow completed!');
}

/**
 * Example: Batch File Operations
 */
async function batchFileOperations() {
  console.log('\n=== Batch File Operations ===\n');

  const baseDir = '/opt/app/components';

  // Create directory structure
  console.log('1. Creating directory structure...');
  await sandbox.files.create({
    fullPath: baseDir,
    isFolder: true
  });

  // Create multiple files
  const components = ['Header', 'Footer', 'Sidebar', 'Main'];
  
  console.log('2. Creating component files...');
  for (const component of components) {
    const content = `export default function ${component}() {
  return <div>${component}</div>;
}`;
    
    await sandbox.files.create({
      fullPath: `${baseDir}/${component}.jsx`,
      content
    });
  }

  // List all created files
  console.log('3. Listing created files...');
  const files = await sandbox.files.list({
    dirPath: baseDir,
    recursive: true
  });
  console.log('Created files:', files);

  // Search for specific pattern
  console.log('4. Searching for "export" in files...');
  const searchResults = await sandbox.search.search({
    query: 'export default',
    options: { path: baseDir }
  });
  console.log('Search results:', searchResults);

  console.log('\nBatch operations completed!');
}

/**
 * Example: Project Setup Automation
 */
async function automateProjectSetup() {
  console.log('\n=== Automated Project Setup ===\n');

  const projectPath = '/opt/app/new-project';

  // Clone template repository
  console.log('1. Cloning template repository...');
  await sandbox.git.clone({
    url: 'https://github.com/user/template.git',
    targetDir: projectPath,
    branch: 'main'
  });

  // Configure git
  console.log('2. Configuring git...');
  await sandbox.git.configUser({
    repoPath: projectPath,
    name: 'CI Bot',
    email: 'ci@example.com'
  });

  // Install dependencies
  console.log('3. Installing dependencies...');
  await sandbox.terminal.execute({
    command: 'npm install',
    cwd: projectPath,
    timeout: 60000
  });

  // Create environment file
  console.log('4. Creating .env file...');
  await sandbox.files.create({
    fullPath: `${projectPath}/.env`,
    content: `NODE_ENV=development
API_URL=https://api.example.com
`
  });

  // Run build
  console.log('5. Running build...');
  await sandbox.terminal.execute({
    command: 'npm run build',
    cwd: projectPath,
    timeout: 120000
  });

  // Create checkpoint
  console.log('6. Creating checkpoint...');
  await sandbox.snapshots.commit({
    message: 'Project setup complete'
  });

  console.log('\nProject setup completed!');
}

/**
 * Example: Error Handling and Retry Logic
 */
async function errorHandlingExample() {
  console.log('\n=== Error Handling Example ===\n');

  async function retryOperation(operation, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        console.log(`Attempt ${i + 1} failed: ${error.message}`);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  try {
    // Try to read a file with retry logic
    const content = await retryOperation(async () => {
      return await sandbox.files.get({
        filePath: '/opt/app/potentially-missing-file.txt'
      });
    });
    console.log('File content:', content);
  } catch (error) {
    console.error('Failed after retries:', error.message);
    
    // Create the file if it doesn't exist
    console.log('Creating missing file...');
    await sandbox.files.create({
      fullPath: '/opt/app/potentially-missing-file.txt',
      content: 'Created by error handler'
    });
  }

  console.log('\nError handling example completed!');
}

async function main() {
  try {
    // Test connection
    const connected = await sandbox.testConnection();
    if (!connected) {
      console.error('Failed to connect to sandbox API');
      return;
    }

    // Run examples (uncomment what you want to test)
    // await gitWorkflow();
    // await snapshotArchiveWorkflow();
    await batchFileOperations();
    // await automateProjectSetup();
    // await errorHandlingExample();

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the examples
main();

