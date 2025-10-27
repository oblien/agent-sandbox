# Database Quick Start Guide

## Installation

```bash
npm install agent-sandbox
```

## Basic Setup

```javascript
import { SandboxClient } from 'agent-sandbox';

const sandbox = new SandboxClient({
  token: 'your_sandbox_token'
});
```

## Common Operations

### Create Database & Table

```javascript
// Create database
await sandbox.database.createDatabase({ name: 'myapp' });

// Create table
await sandbox.database.createTable({
  database: 'myapp',
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'TEXT', notNull: true },
    { name: 'email', type: 'TEXT', unique: true },
    { name: 'age', type: 'INTEGER' }
  ]
});
```

### Insert Data

```javascript
await sandbox.database.insertRow({
  database: 'myapp',
  table: 'users',
  data: { 
    name: 'John Doe', 
    email: 'john@example.com',
    age: 30
  }
});
```

### Query Data

```javascript
// Get all data with pagination
const result = await sandbox.database.getTableData({
  database: 'myapp',
  table: 'users',
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc'
});

// Custom SQL query
const users = await sandbox.database.executeQuery({
  database: 'myapp',
  query: 'SELECT * FROM users WHERE age > ?',
  params: [25]
});
```

### Update Data

```javascript
await sandbox.database.updateRow({
  database: 'myapp',
  table: 'users',
  data: { age: 31 },
  where: { email: 'john@example.com' }
});
```

### Delete Data

```javascript
await sandbox.database.deleteRow({
  database: 'myapp',
  table: 'users',
  where: { id: 5 }
});
```

### Export Data

```javascript
// Export to JSON
const json = await sandbox.database.exportTableToJSON('myapp', 'users');

// Export to CSV
const csv = await sandbox.database.exportTableToCSV('myapp', 'users');

// Export entire database to SQL
const sql = await sandbox.database.exportDatabaseToSQL('myapp');
```

### Schema Management

```javascript
// Add column
await sandbox.database.addColumn({
  database: 'myapp',
  table: 'users',
  name: 'status',
  type: 'TEXT',
  defaultValue: 'active'
});

// Create index
await sandbox.database.createIndex({
  database: 'myapp',
  table: 'users',
  name: 'idx_email',
  columns: ['email'],
  unique: true
});

// Get full schema
const schema = await sandbox.database.getTableSchemaFull('myapp', 'users');
```

## TypeScript

```typescript
import { 
  SandboxClient, 
  TableCreateOptions,
  RowInsertOptions 
} from 'agent-sandbox';

const sandbox = new SandboxClient({ token: 'xxx' });

const tableOptions: TableCreateOptions = {
  database: 'myapp',
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true }
  ]
};

await sandbox.database.createTable(tableOptions);
```

## Error Handling

```javascript
try {
  await sandbox.database.createTable({
    database: 'myapp',
    tableName: 'users',
    columns: [/* ... */]
  });
} catch (error) {
  console.error('Error:', error.message);
}
```

## All Available Methods

### Database Operations
- `listDatabases()`
- `createDatabase({ name })`
- `deleteDatabase({ database })`
- `getDatabaseInfo(database)`

### Table Operations
- `listTables(database)`
- `getTableSchema(database, table)`
- `createTable({ database, tableName, columns })`
- `dropTable(database, table)`
- `renameTable({ database, table, newName })`

### Data Operations
- `getTableData({ database, table, ...options })`
- `insertRow({ database, table, data })`
- `updateRow({ database, table, data, where })`
- `deleteRow({ database, table, where })`

### Query Operations
- `executeQuery({ database, query, params })`
- `executeTransaction({ database, queries })`

### Import/Export
- `exportTableToJSON(database, table)`
- `exportTableToCSV(database, table)`
- `importFromJSON({ database, table, data, options })`
- `exportDatabaseToSQL(database)`

### Schema Management
- `addColumn({ database, table, name, type, ... })`
- `listIndexes(database, table)`
- `createIndex({ database, table, name, columns, unique })`
- `dropIndex(database, indexName)`
- `listForeignKeys(database, table)`
- `setForeignKeyConstraints({ database, enabled })`
- `getForeignKeyStatus(database)`
- `getTableSchemaFull(database, table)`
- `analyzeTable(database, table)`

## More Resources

- 📖 [Complete API Reference](./DATABASE_API.md)
- 💻 [Full Example](./examples/database-example.js)
- 📚 [Main Documentation](./README.md)
- 🌐 [Online Docs](https://oblien.com/docs/sandbox/database)

