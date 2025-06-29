/**
 * @cross/fs - A cross-runtime utility library for file system operations
 *
 * This package provides cross-runtime compatible file system operations for Node.js, Deno, and Bun.
 * It includes utilities for file/directory operations, file system watching, and common file system tasks.
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
 * @module
 */

export * from "./src/stat/mod.ts";
export * from "./src/io/mod.ts";
export * from "./src/ops/mod.ts";
