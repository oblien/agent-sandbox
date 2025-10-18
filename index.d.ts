/**
 * TypeScript type definitions for buildcore
 * 
 * Documentation: https://oblien.com/docs/sandbox
 */

export interface OblienConfig {
  clientId: string;
  clientSecret: string;
  apiURL?: string;
}

export interface SandboxConfig {
  baseURL: string;
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

export interface WebSocketConnectOptions {
  token: string;
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

export class WebSocketAPI {
  getConnections(): Promise<any>;
  getConnectionStatus(options: WebSocketConnectOptions): Promise<any>;
  connect(options: WebSocketConnectOptions): Promise<any>;
  disconnect(options: WebSocketConnectOptions): Promise<any>;
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
  terminal: TerminalAPI;
  snapshots: SnapshotsAPI;
  websocket: WebSocketAPI;
  
  testConnection(): Promise<boolean>;
}

