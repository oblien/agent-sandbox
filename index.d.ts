/**
 * TypeScript type definitions for agent-sandbox
 * 
 * Documentation: https://oblien.com/docs/sandbox
 */

export interface OblienConfig {
  clientId: string;
  clientSecret: string;
  apiURL?: string;
}

export interface SandboxConfig {
  baseURL?: string;
  token: string;
}

export interface SandboxCreateOptions {
  name?: string;
  region?: string;
  template?: string;
  config?: any;
}

export interface SandboxListOptions {
  page?: number;
  limit?: number;
  status?: string;
}

export interface SandboxDetails {
  id: string;
  token: string;
  url: string;
  name?: string;
  status: string;
  region?: string;
  createdAt?: string;
}

export interface FileListOptions {
  dirPath: string;
  recursive?: boolean;
  ignorePatterns?: string[];
  nested?: boolean;
  light?: boolean;
  flattenResults?: boolean;
  maxDepth?: number;
  useGitignore?: boolean;
  pathFilter?: string;
  includeHash?: boolean;
  includeContent?: boolean;
  maxContentSize?: number;
  enableChunking?: boolean;
  maxChunkSize?: number;
}

export interface FileGetOptions {
  filePath: string;
  range?: { start: number; end: number };
  withLineNumbers?: boolean;
}

export interface FileCreateOptions {
  parentPath?: string;
  fileName?: string;
  fullPath?: string;
  filePath?: string;
  content?: string;
  isFolder?: boolean;
  withWatcher?: boolean;
}

export interface FileDeleteOptions {
  filePath: string;
  withWatcher?: boolean;
}

export interface FileRenameOptions {
  sourcePath: string;
  destinationPath: string;
  withWatcher?: boolean;
}

export interface FileUploadOptions {
  filePath: string;
  content: string;
  withWatcher?: boolean;
}

export interface FileEditOptions {
  filePath: string;
  content?: string;
  edits?: any;
  withWatcher?: boolean;
}

export interface FileMergeOptions {
  filePath: string;
  content: string;
  options?: any;
  withWatcher?: boolean;
}

export interface GitAuthConfig {
  type?: 'ssh' | 'token';
  sshKey?: string;
  username?: string;
  password?: string;
  token?: string;
}

export interface GitCloneOptions {
  url: string;
  targetDir: string;
  branch?: string;
  auth?: GitAuthConfig;
  root?: boolean;
}

export interface GitPullOptions {
  repoPath: string;
  branch?: string;
  auth?: GitAuthConfig;
}

export interface GitPushOptions {
  repoPath: string;
  branch?: string;
  force?: boolean;
  auth?: GitAuthConfig;
}

export interface GitCommitOptions {
  repoPath: string;
  message: string;
  author?: { name: string; email: string };
}

export interface GitBranchOptions {
  repoPath: string;
  branchName?: string;
  checkout?: boolean;
  includeRemote?: boolean;
}

export interface SearchOptions {
  query: string;
  options?: {
    caseSensitive?: boolean;
    regex?: boolean;
    path?: string;
  };
}

export interface TerminalOptions {
  command: string;
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
}

export interface SnapshotCommitOptions {
  message: string;
}

export interface SnapshotGotoOptions {
  commitHash: string;
}

export interface SnapshotArchiveOptions {
  id: string;
  options?: any;
}

export interface SnapshotRestoreOptions {
  id: string;
  override?: boolean;
}

// ============ Database Types ============

export interface DatabaseCreateOptions {
  name: string;
}

export interface DatabaseDeleteOptions {
  database: string;
}

export interface TableCreateOptions {
  database: string;
  tableName: string;
  columns: Array<{
    name: string;
    type: string;
    primaryKey?: boolean;
    notNull?: boolean;
    unique?: boolean;
    defaultValue?: any;
    autoIncrement?: boolean;
  }>;
}

export interface TableRenameOptions {
  database: string;
  table: string;
  newName: string;
}

export interface TableDataOptions {
  database: string;
  table: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  where?: Record<string, any>;
  filters?: Record<string, any>;
}

export interface RowInsertOptions {
  database: string;
  table: string;
  data: Record<string, any>;
}

export interface RowUpdateOptions {
  database: string;
  table: string;
  data: Record<string, any>;
  where: Record<string, any>;
}

export interface RowDeleteOptions {
  database: string;
  table: string;
  where: Record<string, any>;
}

export interface QueryExecuteOptions {
  database: string;
  query: string;
  params?: any[];
}

export interface TransactionExecuteOptions {
  database: string;
  queries: Array<{
    query: string;
    params?: any[];
  }>;
}

export interface ImportFromJSONOptions {
  database: string;
  table: string;
  data: Array<Record<string, any>>;
  options?: {
    truncate?: boolean;
    skipErrors?: boolean;
  };
}

export interface ColumnAddOptions {
  database: string;
  table: string;
  name: string;
  type: string;
  notNull?: boolean;
  defaultValue?: any;
  unique?: boolean;
  constraints?: Record<string, any>;
}

export interface IndexCreateOptions {
  database: string;
  table: string;
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface ForeignKeyConstraintsOptions {
  database: string;
  enabled: boolean;
}

export class FilesAPI {
  list(options: FileListOptions): Promise<any>;
  get(options: FileGetOptions): Promise<any>;
  create(options: FileCreateOptions): Promise<any>;
  delete(options: FileDeleteOptions): Promise<any>;
  rename(options: FileRenameOptions): Promise<any>;
  upload(options: FileUploadOptions): Promise<any>;
  download(options: { filePath: string }): Promise<any>;
  exists(options: { filePath: string }): Promise<any>;
  edit(options: FileEditOptions): Promise<any>;
  merge(options: FileMergeOptions): Promise<any>;
}

export class GitAPI {
  listKeys(): Promise<any>;
  configUser(options: { repoPath: string; name: string; email: string }): Promise<any>;
  check(options: { repoPath: string }): Promise<any>;
  clone(options: GitCloneOptions): Promise<any>;
  pull(options: GitPullOptions): Promise<any>;
  push(options: GitPushOptions): Promise<any>;
  status(options: { repoPath: string }): Promise<any>;
  getCurrentBranch(options: { repoPath: string }): Promise<any>;
  listBranches(options: GitBranchOptions): Promise<any>;
  createBranch(options: GitBranchOptions): Promise<any>;
  checkoutBranch(options: GitBranchOptions): Promise<any>;
  add(options: { repoPath: string; files: string[] }): Promise<any>;
  commit(options: GitCommitOptions): Promise<any>;
  init(options: { repoPath: string }): Promise<any>;
  history(options: { repoPath: string; limit?: number }): Promise<any>;
}

export class SearchAPI {
  search(options: SearchOptions): Promise<any>;
  searchFileNames(options: SearchOptions): Promise<any>;
}

export class TerminalAPI {
  execute(options: TerminalOptions): Promise<any>;
}

export class SnapshotsAPI {
  commit(options: SnapshotCommitOptions): Promise<any>;
  goto(options: SnapshotGotoOptions): Promise<any>;
  listCheckpoints(options?: { limit?: number }): Promise<any>;
  getCheckpoint(commitHash: string): Promise<any>;
  getCurrentCheckpoint(): Promise<any>;
  cleanup(): Promise<any>;
  deleteAfter(options: { commitHash: string }): Promise<any>;
  archive(options: SnapshotArchiveOptions): Promise<any>;
  restore(options: SnapshotRestoreOptions): Promise<any>;
  listArchives(): Promise<any>;
  getArchive(id: string): Promise<any>;
  deleteArchive(id: string): Promise<any>;
  cleanupArchives(options?: any): Promise<any>;
}

export interface WebSocketConnectOptions {
  binary?: boolean;
  silent?: boolean;
}

export interface TerminalCreateOptions {
  terminalId?: number;
  cols?: number;
  rows?: number;
  cwd?: string;
  command?: string;
  args?: string[];
  task?: boolean;
  force?: boolean;
  onData?: (data: string) => void;
  onExit?: (code: number, signal?: string) => void;
}

export interface TerminalStateOptions {
  newOnly?: boolean;
  maxLines?: number;
  direction?: 'top' | 'bottom';
}

export interface FileWatcherOptions {
  ignorePatterns?: string[];
  onChange?: (path: string) => void;
  onAdd?: (path: string) => void;
  onUnlink?: (path: string) => void;
  onError?: (error: any) => void;
}

export class Terminal {
  readonly id: number;
  write(data: string): void;
  resize(cols: number, rows: number): Promise<void>;
  getState(options?: TerminalStateOptions): Promise<string>;
  onData(callback: (data: string) => void): void;
  onExit(callback: (code: number, signal?: string) => void): void;
  close(force?: boolean): Promise<void>;
}

export class TerminalManager {
  create(options?: TerminalCreateOptions): Promise<Terminal>;
  list(): Promise<Array<{ id: number }>>;
  get(terminalId: number): Terminal | null;
  close(terminalId: number, force?: boolean): Promise<void>;
  disconnect(): void;
}

export class WatcherManager {
  readonly isWatching: boolean;
  start(options?: FileWatcherOptions): Promise<void>;
  stop(): void;
  on(event: 'add' | 'change' | 'unlink' | 'error', handler: (path: string) => void): void;
  off(event: 'add' | 'change' | 'unlink' | 'error', handler: (path: string) => void): void;
  disconnect(): void;
}

export class WebSocketClient {
  readonly isConnected: boolean;
  connect(options?: WebSocketConnectOptions): Promise<void>;
  disconnect(): void;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
  once(event: string, handler: (...args: any[]) => void): void;
}

export class WebSocketAPI {
  readonly terminal: TerminalManager;
  readonly watcher: WatcherManager;
  readonly client: WebSocketClient;
  readonly isConnected: boolean;
  
  connect(options?: WebSocketConnectOptions): Promise<WebSocketAPI>;
  disconnect(): void;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
}

export interface BrowserPageContentOptions {
  url: string;
  path?: string;
  pageUrl?: string;
  waitFor?: number;
  selector?: string;
  extract?: string;
  waitForFullLoad?: boolean;
  useProxy?: boolean;
}

export interface BrowserMonitorOptions {
  url: string;
  path?: string;
  duration?: number;
  filterTypes?: string[];
  useProxy?: boolean;
}

export interface BrowserScreenshotOptions {
  url: string;
  path?: string;
  width?: number;
  height?: number;
  deviceType?: string;
  scale?: number;
  scrollPosition?: { x: number; y: number };
  fullPage?: boolean;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  selector?: string;
  waitFor?: number;
  save?: boolean;
  fullPageOptions?: any;
  useProxy?: boolean;
  timeout?: number;
}

export interface BrowserConsoleLogsOptions {
  url: string;
  path?: string;
  waitFor?: number;
  selector?: string;
  includeNetworkErrors?: boolean;
  flatten?: boolean;
  useProxy?: boolean;
}

export class BrowserAPI {
  getPageContent(options: BrowserPageContentOptions): Promise<any>;
  monitorRequests(options: BrowserMonitorOptions): Promise<any>;
  screenshot(options: BrowserScreenshotOptions): Promise<any>;
  cleanScreenshots(options: { url: string }): Promise<any>;
  getConsoleLogs(options: BrowserConsoleLogsOptions): Promise<any>;
  getDevicePresets(): Promise<any>;
  getStatus(): Promise<any>;
}

export class DatabaseAPI {
  // Database Operations
  listDatabases(): Promise<any>;
  createDatabase(options: DatabaseCreateOptions): Promise<any>;
  deleteDatabase(options: DatabaseDeleteOptions): Promise<any>;
  getDatabaseInfo(database: string): Promise<any>;

  // Table Operations
  listTables(database: string): Promise<any>;
  getTableSchema(database: string, table: string): Promise<any>;
  createTable(options: TableCreateOptions): Promise<any>;
  dropTable(database: string, table: string): Promise<any>;
  renameTable(options: TableRenameOptions): Promise<any>;

  // Data Operations
  getTableData(options: TableDataOptions): Promise<any>;
  insertRow(options: RowInsertOptions): Promise<any>;
  updateRow(options: RowUpdateOptions): Promise<any>;
  deleteRow(options: RowDeleteOptions): Promise<any>;

  // Query Operations
  executeQuery(options: QueryExecuteOptions): Promise<any>;
  executeTransaction(options: TransactionExecuteOptions): Promise<any>;

  // Import/Export Operations
  exportTableToJSON(database: string, table: string): Promise<any>;
  exportTableToCSV(database: string, table: string): Promise<any>;
  importFromJSON(options: ImportFromJSONOptions): Promise<any>;
  exportDatabaseToSQL(database: string): Promise<any>;

  // Schema Management Operations
  addColumn(options: ColumnAddOptions): Promise<any>;
  listIndexes(database: string, table: string): Promise<any>;
  createIndex(options: IndexCreateOptions): Promise<any>;
  dropIndex(database: string, indexName: string): Promise<any>;
  listForeignKeys(database: string, table: string): Promise<any>;
  setForeignKeyConstraints(options: ForeignKeyConstraintsOptions): Promise<any>;
  getForeignKeyStatus(database: string): Promise<any>;
  getTableSchemaFull(database: string, table: string): Promise<any>;
  analyzeTable(database: string, table: string): Promise<any>;
}

export class SandboxesAPI {
  create(options?: SandboxCreateOptions): Promise<SandboxDetails>;
  list(options?: SandboxListOptions): Promise<any>;
  get(sandboxId: string): Promise<SandboxDetails>;
  delete(sandboxId: string): Promise<any>;
  start(sandboxId: string): Promise<SandboxDetails>;
  stop(sandboxId: string): Promise<SandboxDetails>;
  restart(sandboxId: string): Promise<SandboxDetails>;
  regenerateToken(sandboxId: string): Promise<any>;
  metrics(sandboxId: string): Promise<any>;
}

export class OblienClient {
  constructor(config: OblienConfig);
  
  sandboxes: SandboxesAPI;
  
  authenticate(): Promise<string>;
  getAuthHeaders(): Promise<Record<string, string>>;
  get(path: string): Promise<any>;
  post(path: string, body?: any): Promise<any>;
  delete(path: string): Promise<any>;
}

export class SandboxClient {
  constructor(config: SandboxConfig);
  
  files: FilesAPI;
  git: GitAPI;
  search: SearchAPI;
  snapshots: SnapshotsAPI;
  browser: BrowserAPI;
  database: DatabaseAPI;
  terminal: TerminalManager;
  watcher: WatcherManager;
  websocket: WebSocketAPI;
  
  testConnection(): Promise<boolean>;
}

