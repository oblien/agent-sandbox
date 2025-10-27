import { BaseAPI } from './base.js';

/**
 * Database API - Handle all database operations
 */
export class DatabaseAPI extends BaseAPI {
  // ============ Database Operations ============

  /**
   * List all databases
   * @returns {Promise<Object>} List of databases
   */
  async listDatabases() {
    return this.get('/database/list');
  }

  /**
   * Create a new database
   * @param {Object} options - Create options
   * @param {string} options.name - Database name
   * @returns {Promise<Object>} Create result
   */
  async createDatabase(options) {
    return this.post('/database/create', options);
  }

  /**
   * Delete a database
   * @param {Object} options - Delete options
   * @param {string} options.database - Database name
   * @returns {Promise<Object>} Delete result
   */
  async deleteDatabase(options) {
    return this.post('/database/delete', options);
  }

  /**
   * Get database information
   * @param {string} database - Database name
   * @returns {Promise<Object>} Database info
   */
  async getDatabaseInfo(database) {
    return this.get(`/database/${database}/info`);
  }

  // ============ Table Operations ============

  /**
   * List tables in a database
   * @param {string} database - Database name
   * @returns {Promise<Object>} List of tables
   */
  async listTables(database) {
    return this.get(`/database/${database}/tables`);
  }

  /**
   * Get table schema
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} Table schema
   */
  async getTableSchema(database, table) {
    return this.get(`/database/${database}/tables/${table}/schema`);
  }

  /**
   * Create a new table
   * @param {Object} options - Create options
   * @param {string} options.database - Database name
   * @param {string} options.tableName - Table name
   * @param {Array<Object>} options.columns - Column definitions
   * @returns {Promise<Object>} Create result
   */
  async createTable(options) {
    const { database, ...body } = options;
    return this.post(`/database/${database}/tables/create`, body);
  }

  /**
   * Drop a table
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} Drop result
   */
  async dropTable(database, table) {
    return this.post(`/database/${database}/tables/${table}/drop`);
  }

  /**
   * Rename a table
   * @param {Object} options - Rename options
   * @param {string} options.database - Database name
   * @param {string} options.table - Current table name
   * @param {string} options.newName - New table name
   * @returns {Promise<Object>} Rename result
   */
  async renameTable(options) {
    const { database, table, newName } = options;
    return this.post(`/database/${database}/tables/${table}/rename`, { newName });
  }

  // ============ Data Operations ============

  /**
   * Get table data with pagination and sorting
   * @param {Object} options - Query options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {number} [options.page] - Page number
   * @param {number} [options.limit] - Results per page
   * @param {string} [options.sortBy] - Column to sort by
   * @param {string} [options.sortOrder] - Sort order (asc/desc)
   * @param {Object} [options.where] - Where conditions
   * @returns {Promise<Object>} Table data
   */
  async getTableData(options) {
    const { database, table, ...body } = options;
    return this.post(`/database/${database}/tables/${table}/data`, body);
  }

  /**
   * Insert a row into a table
   * @param {Object} options - Insert options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {Object} options.data - Row data
   * @returns {Promise<Object>} Insert result
   */
  async insertRow(options) {
    const { database, table, data } = options;
    return this.post(`/database/${database}/tables/${table}/insert`, { data });
  }

  /**
   * Update rows in a table
   * @param {Object} options - Update options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {Object} options.data - New data
   * @param {Object} options.where - Where conditions
   * @returns {Promise<Object>} Update result
   */
  async updateRow(options) {
    const { database, table, data, where } = options;
    return this.post(`/database/${database}/tables/${table}/update`, { data, where });
  }

  /**
   * Delete rows from a table
   * @param {Object} options - Delete options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {Object} options.where - Where conditions
   * @returns {Promise<Object>} Delete result
   */
  async deleteRow(options) {
    const { database, table, where } = options;
    return this.post(`/database/${database}/tables/${table}/delete`, { where });
  }

  // ============ Query Operations ============

  /**
   * Execute a custom SQL query
   * @param {Object} options - Query options
   * @param {string} options.database - Database name
   * @param {string} options.query - SQL query
   * @param {Array} [options.params] - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async executeQuery(options) {
    const { database, query, params } = options;
    return this.post(`/database/${database}/query`, { query, params });
  }

  /**
   * Execute a transaction with multiple queries
   * @param {Object} options - Transaction options
   * @param {string} options.database - Database name
   * @param {Array<Object>} options.queries - Array of query objects
   * @returns {Promise<Object>} Transaction result
   */
  async executeTransaction(options) {
    const { database, queries } = options;
    return this.post(`/database/${database}/transaction`, { queries });
  }

  // ============ Import/Export Operations ============

  /**
   * Export table data to JSON
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} JSON export result
   */
  async exportTableToJSON(database, table) {
    return this.get(`/database/${database}/tables/${table}/export/json`);
  }

  /**
   * Export table data to CSV
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} CSV export result
   */
  async exportTableToCSV(database, table) {
    return this.get(`/database/${database}/tables/${table}/export/csv`);
  }

  /**
   * Import data from JSON
   * @param {Object} options - Import options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {Array<Object>} options.data - Data to import
   * @param {Object} [options.options] - Import options
   * @returns {Promise<Object>} Import result
   */
  async importFromJSON(options) {
    const { database, table, data, options: importOptions } = options;
    return this.post(`/database/${database}/tables/${table}/import/json`, { 
      data, 
      options: importOptions 
    });
  }

  /**
   * Export entire database to SQL
   * @param {string} database - Database name
   * @returns {Promise<Object>} SQL export result
   */
  async exportDatabaseToSQL(database) {
    return this.get(`/database/${database}/export/sql`);
  }

  // ============ Schema Management Operations ============

  /**
   * Add a column to a table
   * @param {Object} options - Column options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {string} options.name - Column name
   * @param {string} options.type - Column type
   * @param {Object} [options.constraints] - Column constraints
   * @returns {Promise<Object>} Add column result
   */
  async addColumn(options) {
    const { database, table, ...columnDef } = options;
    return this.post(`/database/${database}/tables/${table}/columns/add`, columnDef);
  }

  /**
   * List indexes for a table
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} List of indexes
   */
  async listIndexes(database, table) {
    return this.get(`/database/${database}/tables/${table}/indexes`);
  }

  /**
   * Create an index on a table
   * @param {Object} options - Index options
   * @param {string} options.database - Database name
   * @param {string} options.table - Table name
   * @param {string} options.name - Index name
   * @param {Array<string>} options.columns - Columns to index
   * @param {boolean} [options.unique] - Whether index is unique
   * @returns {Promise<Object>} Create index result
   */
  async createIndex(options) {
    const { database, table, ...indexDef } = options;
    return this.post(`/database/${database}/tables/${table}/indexes/create`, indexDef);
  }

  /**
   * Drop an index
   * @param {string} database - Database name
   * @param {string} indexName - Index name
   * @returns {Promise<Object>} Drop index result
   */
  async dropIndex(database, indexName) {
    return this.post(`/database/${database}/indexes/${indexName}/drop`);
  }

  /**
   * List foreign keys for a table
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} List of foreign keys
   */
  async listForeignKeys(database, table) {
    return this.get(`/database/${database}/tables/${table}/foreign-keys`);
  }

  /**
   * Toggle foreign key constraints
   * @param {Object} options - Toggle options
   * @param {string} options.database - Database name
   * @param {boolean} options.enabled - Enable or disable foreign keys
   * @returns {Promise<Object>} Toggle result
   */
  async setForeignKeyConstraints(options) {
    const { database, enabled } = options;
    return this.post(`/database/${database}/foreign-keys/toggle`, { enabled });
  }

  /**
   * Get foreign key constraints status
   * @param {string} database - Database name
   * @returns {Promise<Object>} Foreign key status
   */
  async getForeignKeyStatus(database) {
    return this.get(`/database/${database}/foreign-keys/status`);
  }

  /**
   * Get full table schema (columns, indexes, foreign keys)
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} Full schema information
   */
  async getTableSchemaFull(database, table) {
    return this.get(`/database/${database}/tables/${table}/schema/full`);
  }

  /**
   * Analyze table for optimization
   * @param {string} database - Database name
   * @param {string} table - Table name
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeTable(database, table) {
    return this.post(`/database/${database}/tables/${table}/analyze`);
  }
}

