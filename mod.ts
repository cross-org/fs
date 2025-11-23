/**
 * @cross/fs - A cross-runtime utility library for file system operations
 *
 * This package provides cross-runtime compatible file system operations for Node.js, Deno, Bun, and browsers.
 * It includes utilities for file/directory operations, file system watching, and common file system tasks.
 *
 * For browser environments, it uses ZenFS to provide a Node.js-compatible filesystem API.
 *
 * @example
 * ```typescript
 * import { exists, find, hash } from "@cross/fs";
 *
 * // Check if a file exists
 * const fileExists = await exists("package.json");
 *
 * // Find all TypeScript files
 * const tsFiles = await find(".", (path) => path.endsWith(".ts"));
 *
 * // Get file hash
 * const fileHash = await hash("README.md", "sha256");
 * ```
 *
 * @example Browser usage with custom ZenFS configuration
 * ```typescript
 * import { configureBrowserFS } from "@cross/fs";
 * import { IndexedDB } from "@zenfs/dom";
 *
 * // Configure ZenFS before using filesystem operations
 * await configureBrowserFS({
 *   mounts: {
 *     '/storage': IndexedDB,
 *     '/tmp': { backend: InMemory }
 *   }
 * });
 *
 * // Now use filesystem operations normally
 * import { writeFile, readFile } from "@cross/fs/io";
 * await writeFile("/storage/myfile.txt", "Hello browser!");
 * console.log(await readFile("/storage/myfile.txt", "utf8"));
 * ```
 *
 * @module
 */

export * from "./src/stat/mod.ts";
export * from "./src/io/mod.ts";
export * from "./src/ops/mod.ts";

// Export browser configuration utilities
export { configureBrowserFS, getBrowserFS, isBrowserFSInitialized } from "./src/utils/browser-fs.ts";
