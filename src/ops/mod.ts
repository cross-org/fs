/**
 * @cross/fs/ops - File system operations and utilities
 *
 * This module provides cross-runtime compatible functions for file system operations including
 * directory management, file watching, temporary file creation, and working directory operations.
 *
 * @example
 * ```typescript
 * import { mktempdir, cwd, chdir, FsWatcher } from "@cross/fs/ops";
 *
 * // Create a temporary directory
 * const tempDir = await mktempdir("my-app");
 *
 * // Get current working directory
 * const currentDir = cwd();
 *
 * // Change directory
 * chdir("/path/to/directory");
 *
 * // Watch for file changes
 * const watcher = FsWatcher();
 * for await (const event of watcher.watch(".")) {
 *   console.log("File changed:", event);
 * }
 * ```
 *
 * @module
 */

export {
  chmod,
  chown,
  cp,
  link,
  mkdir,
  open,
  readdir,
  readlink,
  realpath,
  rename,
  rm,
  rmdir,
  truncate,
  unlink,
} from "node:fs/promises";

export type { FSWatcher } from "node:fs";

export * from "./mktempdir.ts";
export * from "./tempfile.ts";
export * from "./chdir.ts";
export * from "./cwd.ts";
export * from "./watch.ts";
