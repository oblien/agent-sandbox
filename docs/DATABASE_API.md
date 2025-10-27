# Database API Reference

Complete reference for database management operations in agent-sandbox.

## Quick Start

```javascript
import { SandboxClient } from 'agent-sandbox';

const sandbox = new SandboxClient({
  token: 'your_sandbox_token'
});

// Create database
await sandbox.database.createDatabase({ name: 'myapp' });

// Create table
await sandbox.database.createTable({
  database: 'myapp',
  tableName: 'users',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'name', type: 'TEXT', notNull: true }
  ]
});
```

## Database Operations

### `listDatabases()`

List all available databases.

```javascript
const result = await sandbox.database.listDatabases();
```

**Returns:** `Promise<Object>` - List of databases

---

### `createDatabase(options)`

Create a new database.

```javascript
await sandbox.database.createDatabase({ 
  name: 'myapp' 
});
```

**Parameters:**
- `options.name` (string, required) - Database name

**Returns:** `Promise<Object>` - Creation result

---

### `deleteDatabase(options)`

Delete a database.

```javascript
await sandbox.database.deleteDatabase({ 
  database: 'myapp' 
});
```

**Parameters:**
- `options.database` (string, required) - Database name

**Returns:** `Promise<Object>` - Deletion result

---

### `getDatabaseInfo(database)`

Get information about a database.

```javascript
const info = await sandbox.database.getDatabaseInfo('myapp');
```

**Parameters:**
- `database` (string, required) - Database name

**Returns:** `Promise<Object>` - Database information

---

## Table Operations

### `listTables(database)`

List all tables in a database.

```javascript
const tables = await sandbox.database.listTables('myapp');
```

**Parameters:**
- `database` (string, required) - Database name

**Returns:** `Promise<Object>` - List of tables

---

### `getTableSchema(database, table)`

Get table schema information.

```javascript
const schema = await sandbox.database.getTableSchema('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - Table schema

---

### `createTable(options)`

Create a new table.

```javascript
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
      unique: true 
    }
  ]
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.tableName` (string, required) - Table name
- `options.columns` (array, required) - Column definitions
  - `name` (string) - Column name
  - `type` (string) - Column type (INTEGER, TEXT, REAL, BLOB, etc.)
  - `primaryKey` (boolean) - Is primary key
  - `autoIncrement` (boolean) - Auto increment
  - `notNull` (boolean) - Not null constraint
  - `unique` (boolean) - Unique constraint
  - `defaultValue` (any) - Default value

**Returns:** `Promise<Object>` - Creation result

---

### `dropTable(database, table)`

Drop a table.

```javascript
await sandbox.database.dropTable('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - Drop result

---

### `renameTable(options)`

Rename a table.

```javascript
await sandbox.database.renameTable({
  database: 'myapp',
  table: 'users',
  newName: 'customers'
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Current table name
- `options.newName` (string, required) - New table name

**Returns:** `Promise<Object>` - Rename result

---

## Data Operations

### `getTableData(options)`

Get table data with pagination and filtering.

```javascript
const data = await sandbox.database.getTableData({
  database: 'myapp',
  table: 'users',
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc',
  where: { age: 25 }
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.page` (number) - Page number
- `options.limit` (number) - Results per page
- `options.sortBy` (string) - Column to sort by
- `options.sortOrder` (string) - Sort order ('asc' or 'desc')
- `options.where` (object) - Where conditions

**Returns:** `Promise<Object>` - Table data

---

### `insertRow(options)`

Insert a row into a table.

```javascript
await sandbox.database.insertRow({
  database: 'myapp',
  table: 'users',
  data: { 
    name: 'John Doe', 
    email: 'john@example.com' 
  }
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.data` (object, required) - Row data

**Returns:** `Promise<Object>` - Insert result

---

### `updateRow(options)`

Update rows in a table.

```javascript
await sandbox.database.updateRow({
  database: 'myapp',
  table: 'users',
  data: { age: 31 },
  where: { email: 'john@example.com' }
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.data` (object, required) - New data
- `options.where` (object, required) - Where conditions

**Returns:** `Promise<Object>` - Update result

---

### `deleteRow(options)`

Delete rows from a table.

```javascript
await sandbox.database.deleteRow({
  database: 'myapp',
  table: 'users',
  where: { id: 5 }
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.where` (object, required) - Where conditions

**Returns:** `Promise<Object>` - Delete result

---

## Query Operations

### `executeQuery(options)`

Execute a custom SQL query.

```javascript
const result = await sandbox.database.executeQuery({
  database: 'myapp',
  query: 'SELECT * FROM users WHERE age > ?',
  params: [25]
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.query` (string, required) - SQL query
- `options.params` (array) - Query parameters

**Returns:** `Promise<Object>` - Query result

---

### `executeTransaction(options)`

Execute multiple queries in a transaction.

```javascript
await sandbox.database.executeTransaction({
  database: 'myapp',
  queries: [
    {
      query: 'INSERT INTO users (name, email) VALUES (?, ?)',
      params: ['Alice', 'alice@example.com']
    },
    {
      query: 'UPDATE users SET age = ? WHERE name = ?',
      params: [28, 'Alice']
    }
  ]
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.queries` (array, required) - Array of query objects
  - `query` (string) - SQL query
  - `params` (array) - Query parameters

**Returns:** `Promise<Object>` - Transaction result

---

## Import/Export Operations

### `exportTableToJSON(database, table)`

Export table data to JSON.

```javascript
const json = await sandbox.database.exportTableToJSON('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - JSON export

---

### `exportTableToCSV(database, table)`

Export table data to CSV.

```javascript
const csv = await sandbox.database.exportTableToCSV('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - CSV export

---

### `importFromJSON(options)`

Import data from JSON.

```javascript
await sandbox.database.importFromJSON({
  database: 'myapp',
  table: 'users',
  data: [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ],
  options: {
    truncate: false,
    skipErrors: true
  }
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.data` (array, required) - Data to import
- `options.options` (object) - Import options
  - `truncate` (boolean) - Truncate table before import
  - `skipErrors` (boolean) - Skip errors during import

**Returns:** `Promise<Object>` - Import result

---

### `exportDatabaseToSQL(database)`

Export entire database to SQL.

```javascript
const sql = await sandbox.database.exportDatabaseToSQL('myapp');
```

**Parameters:**
- `database` (string, required) - Database name

**Returns:** `Promise<Object>` - SQL export

---

## Schema Management

### `addColumn(options)`

Add a column to a table.

```javascript
await sandbox.database.addColumn({
  database: 'myapp',
  table: 'users',
  name: 'status',
  type: 'TEXT',
  defaultValue: 'active'
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.name` (string, required) - Column name
- `options.type` (string, required) - Column type
- `options.notNull` (boolean) - Not null constraint
- `options.defaultValue` (any) - Default value
- `options.unique` (boolean) - Unique constraint

**Returns:** `Promise<Object>` - Add column result

---

### `listIndexes(database, table)`

List indexes for a table.

```javascript
const indexes = await sandbox.database.listIndexes('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - List of indexes

---

### `createIndex(options)`

Create an index on a table.

```javascript
await sandbox.database.createIndex({
  database: 'myapp',
  table: 'users',
  name: 'idx_email',
  columns: ['email'],
  unique: true
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.table` (string, required) - Table name
- `options.name` (string, required) - Index name
- `options.columns` (array, required) - Columns to index
- `options.unique` (boolean) - Whether index is unique

**Returns:** `Promise<Object>` - Create index result

---

### `dropIndex(database, indexName)`

Drop an index.

```javascript
await sandbox.database.dropIndex('myapp', 'idx_email');
```

**Parameters:**
- `database` (string, required) - Database name
- `indexName` (string, required) - Index name

**Returns:** `Promise<Object>` - Drop index result

---

### `listForeignKeys(database, table)`

List foreign keys for a table.

```javascript
const foreignKeys = await sandbox.database.listForeignKeys('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - List of foreign keys

---

### `setForeignKeyConstraints(options)`

Toggle foreign key constraints.

```javascript
await sandbox.database.setForeignKeyConstraints({
  database: 'myapp',
  enabled: true
});
```

**Parameters:**
- `options.database` (string, required) - Database name
- `options.enabled` (boolean, required) - Enable or disable

**Returns:** `Promise<Object>` - Toggle result

---

### `getForeignKeyStatus(database)`

Get foreign key constraints status.

```javascript
const status = await sandbox.database.getForeignKeyStatus('myapp');
```

**Parameters:**
- `database` (string, required) - Database name

**Returns:** `Promise<Object>` - Foreign key status

---

### `getTableSchemaFull(database, table)`

Get full table schema including columns, indexes, and foreign keys.

```javascript
const schema = await sandbox.database.getTableSchemaFull('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - Full schema information

---

### `analyzeTable(database, table)`

Analyze table for optimization.

```javascript
const analysis = await sandbox.database.analyzeTable('myapp', 'users');
```

**Parameters:**
- `database` (string, required) - Database name
- `table` (string, required) - Table name

**Returns:** `Promise<Object>` - Analysis result

---

## TypeScript Support

All methods are fully typed. Import types as needed:

```typescript
import { 
  SandboxClient,
  DatabaseCreateOptions,
  TableCreateOptions,
  RowInsertOptions,
  QueryExecuteOptions
} from 'agent-sandbox';

const sandbox = new SandboxClient({ token: 'your_token' });

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

All methods return promises and should be wrapped in try-catch blocks:

```javascript
try {
  await sandbox.database.createTable({
    database: 'myapp',
    tableName: 'users',
    columns: [/* ... */]
  });
} catch (error) {
  console.error('Failed to create table:', error.message);
}
```

## Examples

See the [complete example](./examples/database-example.js) for detailed usage patterns.

