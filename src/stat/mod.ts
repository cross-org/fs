/**
 * @cross/fs/stat - File system statistics and information utilities
 *
 * This module provides cross-runtime compatible functions for getting file and directory information,
 * checking file existence, finding files, calculating hashes, and locating executables.
 *
 * @example
 * ```typescript
 * import { exists, find, hash, which } from "@cross/fs/stat";
 *
 * // Check if a file exists
 * const exists = await exists("package.json");
 *
 * // Find all JSON files recursively
 * const jsonFiles = await find(".", (path) => path.endsWith(".json"));
 *
 * // Get SHA256 hash of a file
 * const fileHash = await hash("README.md", "sha256");
 *
 * // Find executable path
 * const nodePath = await which("node");
 * ```
 *
 * @module
 */

import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Options for file system statistics operations.
 */
export interface StatOptions {
  /* Request bigInts, Only used with node */
  bigInt: false | undefined;
}

/**
 * Result of a file system statistics operation.
 * Provides information about a file or directory including type, size, timestamps, and permissions.
 */
export interface StatResult {
  /** Common Properties */
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;

  /** Size in bytes */
  size: number;

  /** Last modification time, may be unavailable on some systems */
  mtime: Date | null;
  /** Last access time, may be unavailable on some systems */
  atime: Date | null;
  /** Creation (birth) time, may be unavailable on some systems */
  birthtime: Date | null;

  /** Unix-Specific Properties (Linux/Mac OS) */

  /** ID of the device containing the file */
  dev: number | null;
  /** Inode number */
  ino: number | null;

  /**
   * Raw file mode/permissions. Interpretation depends on file type.
   * For regular files, it's a combination of flags defined in system headers.
   */
  mode: number | null;

  /** Number of hard links pointing to this file */
  nlink: number | null;

  /** User ID of the file owner */
  uid: number | null;
  /** Group ID of the file owner */
  gid: number | null;

  /** Device ID of the file */
  rdev: number | null;

  /** Block size for filesystem I/O */
  blksize: number | null;

  /** Number of 512-byte blocks allocated to the file*/
  blocks: number | null;

  /** True if this represents a block device file */
  isBlockDevice: boolean | null;
  /** True if this represents a character device file */
  isCharDevice: boolean | null;
  /** True if this represents a FIFO (pipe) file */
  isFifo: boolean | null;
  /** True if this represents a socket file */
  isSocket: boolean | null;
}

/**
 * Error thrown when a file or directory is not found during file system operations.
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

async function statWrap(
  path: string,
  options?: StatOptions,
): Promise<StatResult> {
  switch (CurrentRuntime) {
    case Runtime.Node:
      /* Falls through */
    case Runtime.Bun:
      try {
        //@ts-ignore Cross
        const { stat } = await import("node:fs/promises");
        return mapNodeStats(
          //@ts-ignore Cross
          await stat(path, options),
          options?.bigInt === undefined ? true : false,
        );
      } catch (err) {
        //@ts-ignore Cross
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          throw new NotFoundError(`File not found: ${path}`);
        } else {
          throw err;
        }
      }
    case Runtime.Deno:
      try {
        //@ts-ignore Cross
        return mapDenoStats(await Deno.stat(path));
      } catch (err) {
        //@ts-ignore Cross
        if (err instanceof Deno.errors.NotFound) {
          throw new NotFoundError(`File not found: ${path}`);
        } else {
          throw err;
        }
      }
    case Runtime.Browser:
      try {
        const { getBrowserFS } = await import("../utils/browser-fs.ts");
        const fs = await getBrowserFS();
        //@ts-ignore ZenFS typing
        const stats = await fs.promises.stat(path);
        return mapNodeStats(stats, options?.bigInt === undefined ? true : false);
      } catch (err) {
        //@ts-ignore Cross
        if (err.code === "ENOENT") {
          throw new NotFoundError(`File not found: ${path}`);
        } else {
          throw err;
        }
      }

    default:
      throw new Error("Unsupported Runtime");
  }
}

// deno-lint-ignore no-explicit-any
function mapNodeStats(stats: any, bigInt: boolean): StatResult {
  return {
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    isSymlink: stats.isSymbolicLink(),
    size: bigInt ? stats.size : Number(stats.size), // Handle bigInt
    mtime: stats.mtime,
    atime: stats.atime,
    birthtime: stats.birthtime,

    // Unix-specific
    dev: stats.dev,
    ino: stats.ino,
    mode: stats.mode,
    nlink: stats.nlink,
    uid: stats.uid, // The numeric user identifier of the user that owns the file (POSIX)
    gid: stats.gid, // The numeric group identifier of the group that owns the file (POSIX)
    rdev: stats.rdev, // A numeric device identifier if the file represents a device.
    blksize: stats.blksize,
    blocks: stats.blocks,
    isBlockDevice: stats.isBlockDevice(),
    isCharDevice: stats.isCharacterDevice(),
    isFifo: stats.isFIFO(),
    isSocket: stats.isSocket(),
  };
}

function mapDenoStats(stats: Deno.FileInfo): StatResult {
  return {
    // Common
    isFile: stats.isFile,
    isDirectory: stats.isDirectory,
    isSymlink: stats.isSymlink,
    size: stats.size,
    mtime: stats.mtime, // Keep as Date | null
    atime: stats.atime, // Keep as Date | null
    birthtime: stats.birthtime, // Keep as Date | null

    // Unix-specific
    dev: null, // Deno doesn't provide this
    ino: stats.ino,
    mode: stats.mode,
    nlink: stats.nlink,
    uid: stats.uid,
    gid: stats.gid,
    blksize: stats.blksize,
    blocks: stats.blocks,

    // Not supported
    rdev: null,
    isBlockDevice: null,
    isCharDevice: null,
    isFifo: null,
    isSocket: null,
  };
}

export { statWrap as stat };

/**
 * Tests a user's permissions for the file or directory specified by path.
 */
export async function access(path: string, mode?: number): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.access(path, mode);
  } else {
    const { access: nodeAccess } = await import("node:fs/promises");
    await nodeAccess(path, mode);
  }
}

/**
 * Gets information about a symbolic link.
 */
export async function lstat(
  path: string,
  options?: StatOptions,
): Promise<StatResult> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    const stats = await fs.promises.lstat(path);
    return mapNodeStats(stats, options?.bigInt === undefined ? true : false);
  } else {
    const { lstat: nodeLstat } = await import("node:fs/promises");
    //@ts-ignore Cross
    const stats = await nodeLstat(path, options);
    return mapNodeStats(stats, options?.bigInt === undefined ? true : false);
  }
}

// Re-export constants from node:fs/promises for non-browser environments
// For browser, these will need to be imported from ZenFS if needed
export { constants } from "node:fs/promises";

export * from "./is.ts";
export * from "./exists.ts";
export * from "./size.ts";
export * from "./find.ts";
export * from "./hash.ts";
export * from "./which.ts";
