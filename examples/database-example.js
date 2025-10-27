/**
 * Database Management Example
 * 
 * This example demonstrates how to use the database API to:
 * - Create and manage databases
 * - Create tables with schemas
 * - Insert, update, and delete data
 * - Execute queries
 * - Import/export data
 */

import { OblienClient } from 'agent-sandbox';

async function databaseExample() {
  // Initialize client
  const client = new OblienClient({
    clientId: process.env.OBLIEN_CLIENT_ID,
    clientSecret: process.env.OBLIEN_CLIENT_SECRET
  });

  // Create a sandbox
  const sandbox = await client.createSandbox({
    name: 'database-demo'
  });

  console.log('Sandbox created:', sandbox.sandboxId);

  try {
    // ============ Database Operations ============
    
    // Create a new database
    console.log('\n1. Creating database...');
    await sandbox.database.createDatabase({ name: 'myapp' });
    
    // List all databases
    const databases = await sandbox.database.listDatabases();
    console.log('Available databases:', databases);

    // ============ Table Operations ============
    
    // Create a users table
    console.log('\n2. Creating users table...');
    await sandbox.database.createTable({
      database: 'myapp',
      tableName: 'users',
      columns: [
        { 
          name: 'id', 
          type: 'INTEGER', 
          primaryKey: true, 
          autoIncrement: true 
        },
        { 
          name: 'name', 
          type: 'TEXT', 
          notNull: true 
        },
        { 
          name: 'email', 
          type: 'TEXT', 
          unique: true,
          notNull: true
        },
        { 
          name: 'age', 
          type: 'INTEGER' 
        },
        { 
          name: 'created_at', 
          type: 'DATETIME',
          defaultValue: 'CURRENT_TIMESTAMP'
        }
      ]
    });

    // List tables
    const tables = await sandbox.database.listTables('myapp');
    console.log('Tables in database:', tables);

    // Get table schema
    const schema = await sandbox.database.getTableSchema('myapp', 'users');
    console.log('Users table schema:', schema);

    // ============ Data Operations ============
    
    // Insert users
    console.log('\n3. Inserting data...');
    await sandbox.database.insertRow({
      database: 'myapp',
      table: 'users',
      data: { 
        name: 'John Doe', 
        email: 'john@example.com',
        age: 30
      }
    });

    await sandbox.database.insertRow({
      database: 'myapp',
      table: 'users',
      data: { 
        name: 'Jane Smith', 
        email: 'jane@example.com',
        age: 25
      }
    });

    await sandbox.database.insertRow({
      database: 'myapp',
      table: 'users',
      data: { 
        name: 'Bob Johnson', 
        email: 'bob@example.com',
        age: 35
      }
    });

    // Get table data
    console.log('\n4. Querying data...');
    const userData = await sandbox.database.getTableData({
      database: 'myapp',
      table: 'users',
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    console.log('Users:', userData);

    // Update data
    console.log('\n5. Updating data...');
    await sandbox.database.updateRow({
      database: 'myapp',
      table: 'users',
      data: { age: 31 },
      where: { email: 'john@example.com' }
    });

    // ============ Query Operations ============
    
    // Execute custom query
    console.log('\n6. Executing custom query...');
    const queryResult = await sandbox.database.executeQuery({
      database: 'myapp',
      query: 'SELECT * FROM users WHERE age > ?',
      params: [25]
    });
    console.log('Users older than 25:', queryResult);

    // Execute transaction
    console.log('\n7. Executing transaction...');
    await sandbox.database.executeTransaction({
      database: 'myapp',
      queries: [
        {
          query: 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
          params: ['Alice Brown', 'alice@example.com', 28]
        },
        {
          query: 'UPDATE users SET age = age + 1 WHERE name = ?',
          params: ['Alice Brown']
        }
      ]
    });

    // ============ Schema Management ============
    
    // Add a column
    console.log('\n8. Adding column...');
    await sandbox.database.addColumn({
      database: 'myapp',
      table: 'users',
      name: 'status',
      type: 'TEXT',
      defaultValue: 'active'
    });

    // Create index
    console.log('\n9. Creating index...');
    await sandbox.database.createIndex({
      database: 'myapp',
      table: 'users',
      name: 'idx_email',
      columns: ['email'],
      unique: true
    });

    // List indexes
    const indexes = await sandbox.database.listIndexes('myapp', 'users');
    console.log('Indexes:', indexes);

    // Get full schema
    const fullSchema = await sandbox.database.getTableSchemaFull('myapp', 'users');
    console.log('Full schema:', fullSchema);

    // ============ Import/Export Operations ============
    
    // Export to JSON
    console.log('\n10. Exporting data...');
    const jsonExport = await sandbox.database.exportTableToJSON('myapp', 'users');
    console.log('Exported JSON:', jsonExport);

    // Export to CSV
    const csvExport = await sandbox.database.exportTableToCSV('myapp', 'users');
    console.log('Exported CSV:', csvExport);

    // Export entire database to SQL
    const sqlExport = await sandbox.database.exportDatabaseToSQL('myapp');
    console.log('Database SQL export created');

    // Import from JSON
    console.log('\n11. Importing data...');
    await sandbox.database.importFromJSON({
      database: 'myapp',
      table: 'users',
      data: [
        { name: 'Charlie Wilson', email: 'charlie@example.com', age: 32 },
        { name: 'Diana Prince', email: 'diana@example.com', age: 29 }
      ],
      options: {
        skipErrors: true
      }
    });

    // ============ Cleanup Example ============
    
    // Delete a row
    console.log('\n12. Deleting data...');
    await sandbox.database.deleteRow({
      database: 'myapp',
      table: 'users',
      where: { email: 'bob@example.com' }
    });

    // Analyze table
    const analysis = await sandbox.database.analyzeTable('myapp', 'users');
    console.log('Table analysis:', analysis);

    // Get database info
    const dbInfo = await sandbox.database.getDatabaseInfo('myapp');
    console.log('Database info:', dbInfo);

    console.log('\n✅ Database operations completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Run the example
databaseExample().catch(console.error);

