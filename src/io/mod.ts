/**
 * @cross/fs/io - File input/output operations
 *
 * This module provides cross-runtime compatible functions for reading and writing files.
 * It re-exports the core file I/O functions from node:fs/promises for consistency.
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

export { readFile, writeFile } from "node:fs/promises";
