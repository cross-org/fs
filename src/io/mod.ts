/**
 * @cross/fs/io - File input/output operations
 *
 * This module provides cross-runtime compatible functions for reading and writing files.
 * It re-exports the core file I/O functions from node:fs/promises for Node.js/Deno/Bun,
 * and uses ZenFS for browser environments.
 *
 * @example
 * ```typescript
 * import { readFile, writeFile } from "@cross/fs/io";
 *
 * // Read a file
 * const content = await readFile("config.json", "utf8");
 *
 * // Write a file
 * await writeFile("output.txt", "Hello, World!");
 * ```
 *
 * @module
 */

import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Reads the entire contents of a file.
 * 
 * @param path - The path to the file
 * @param options - Optional encoding or options object
 * @returns The contents of the file
 */
export async function readFile(
  path: string | URL,
  options?: { encoding?: null; flag?: string } | null
): Promise<Uint8Array>;
export async function readFile(
  path: string | URL,
  options: { encoding: BufferEncoding; flag?: string } | BufferEncoding
): Promise<string>;
export async function readFile(
  path: string | URL,
  options?: { encoding?: BufferEncoding | null; flag?: string } | BufferEncoding | null
): Promise<string | Uint8Array> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    return await fs.promises.readFile(path, options);
  } else {
    const { readFile: nodeReadFile } = await import("node:fs/promises");
    //@ts-ignore Cross-runtime typing
    return await nodeReadFile(path, options);
  }
}

/**
 * Writes data to a file, replacing the file if it already exists.
 * 
 * @param path - The path to the file
 * @param data - The data to write
 * @param options - Optional encoding or options object
 */
export async function writeFile(
  path: string | URL,
  data: string | Uint8Array,
  options?: { encoding?: BufferEncoding | null; mode?: number; flag?: string } | BufferEncoding | null
): Promise<void> {
  if (CurrentRuntime === Runtime.Browser) {
    const { getBrowserFS } = await import("../utils/browser-fs.ts");
    const fs = await getBrowserFS();
    //@ts-ignore ZenFS typing
    await fs.promises.writeFile(path, data, options);
  } else {
    const { writeFile: nodeWriteFile } = await import("node:fs/promises");
    //@ts-ignore Cross-runtime typing
    await nodeWriteFile(path, data, options);
  }
}

