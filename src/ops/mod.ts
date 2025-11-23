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

import { CurrentRuntime, Runtime } from "@cross/runtime";

export type { FSWatcher } from "node:fs";

export * from "./mktempdir.ts";
export * from "./tempfile.ts";
export * from "./chdir.ts";
export * from "./cwd.ts";
export * from "./watch.ts";

/**
 * Creates a directory.
 */
export async function mkdir(
  path: string,
  options?: { recursive?: boolean; mode?: number }
): Promise<string | undefined> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    return await fs.promises.mkdir(path, options);
  } else {
    const { mkdir: nodeMkdir } = await import("node:fs/promises");
    return await nodeMkdir(path, options);
  }
}

/**
 * Removes a directory.
 */
export async function rmdir(path: string, options?: { recursive?: boolean }): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.rmdir(path, options);
  } else {
    const { rmdir: nodeRmdir } = await import("node:fs/promises");
    await nodeRmdir(path, options);
  }
}

/**
 * Removes a file or directory.
 */
export async function rm(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.rm(path, options);
  } else {
    const { rm: nodeRm } = await import("node:fs/promises");
    await nodeRm(path, options);
  }
}

/**
 * Removes a file.
 */
export async function unlink(path: string): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.unlink(path);
  } else {
    const { unlink: nodeUnlink } = await import("node:fs/promises");
    await nodeUnlink(path);
  }
}

/**
 * Reads the contents of a directory.
 */
export async function readdir(
  path: string,
  options?: { encoding?: BufferEncoding | null; withFileTypes?: false } | BufferEncoding | null
): Promise<string[]>;
export async function readdir(
  path: string,
  options: { encoding?: BufferEncoding | null; withFileTypes: true }
): Promise<Array<{ name: string; isFile(): boolean; isDirectory(): boolean; isSymbolicLink(): boolean }>>;
export async function readdir(
  path: string,
  options?: { encoding?: BufferEncoding | null; withFileTypes?: boolean } | BufferEncoding | null
): Promise<string[] | Array<{ name: string; isFile(): boolean; isDirectory(): boolean; isSymbolicLink(): boolean }>> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    return await fs.promises.readdir(path, options);
  } else {
    const { readdir: nodeReaddir } = await import("node:fs/promises");
    //@ts-ignore Cross-runtime typing
    return await nodeReaddir(path, options);
  }
}

/**
 * Renames a file or directory.
 */
export async function rename(oldPath: string, newPath: string): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.rename(oldPath, newPath);
  } else {
    const { rename: nodeRename } = await import("node:fs/promises");
    await nodeRename(oldPath, newPath);
  }
}

/**
 * Copies a file or directory.
 */
export async function cp(source: string, destination: string, options?: { recursive?: boolean }): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.cp(source, destination, options);
  } else {
    const { cp: nodeCp } = await import("node:fs/promises");
    await nodeCp(source, destination, options);
  }
}

/**
 * Operations that require platform-specific implementations or are not supported in browsers.
 * These are only exported for Node.js, Deno, and Bun runtimes.
 */
export {
  chmod,
  chown,
  link,
  open,
  readlink,
  realpath,
  truncate,
} from "node:fs/promises";
