import { readdir } from "node:fs/promises";
import { stat } from "./mod.ts";
import type { StatResult } from "./mod.ts";
import { isAbsolute, join, resolve } from "@std/path";
import { cwd } from "@cross/utils/cwd";

/**
 * Recursively finds files and directories within a specified path, optionally applying advanced filtering.
 *
 * @param inPath - The starting directory path for the search.
 * @param fileFilter - A filter function that takes the absolute file/directory path and its
 *                     stat result as arguments. The function should return `true` if the item should be included
 *                     in the results and `false` otherwise.
 * @param recursive - Whether to search subdirectories recursively (default: `true`).
 * @returns A `Promise` resolving to an array of absolute paths matching the filter criteria.
 *
 * **Examples:**
 *
 * **Simple Usage (Filename filtering):**
 * ```typescript
 * console.log(await find("../", (path) => path.endsWith("package.json")));
 * ```
 *
 * **Advanced Usage (Filtering based on file type, size, etc.):**
 * ```typescript
 * console.log(await find("./documents", (path, stat) =>
 *   stat.isFile() && stat.size > 1024 * 1024 // Find files larger than 1MB
 * ));
 * ```
 */
export async function find(
  inPath: string,
  fileFilter: (path: string, stat: StatResult) => boolean,
  recursive: boolean = true,
): Promise<string[]> {
  const statSelf = await stat(inPath);
  const resolvedPath = isAbsolute(inPath)
    ? resolve(inPath)
    : resolve(cwd(), inPath);
  if (statSelf.isFile || statSelf.isSymlink) {
    if (!fileFilter || fileFilter(resolvedPath, statSelf)) {
      return [resolvedPath]; // Return the file path directly
    } else {
      return []; // File doesn't match the filter
    }
  }
  if (statSelf.isDirectory) {
    // Include the directory itself if it passes the filter
    let results: string[] = [];
    if (fileFilter(resolvedPath, statSelf)) {
      results.push(resolvedPath);
    }
    const files = await readdir(resolvedPath, { withFileTypes: true });
    const paths: Promise<string[]>[] = files.map((file) => {
      const path = join(resolvedPath, file.name);
      return find(path, fileFilter, recursive);
    });
    const promiseResults = await Promise.allSettled(paths);
    results = results.concat(
      promiseResults
        .filter((result): result is PromiseFulfilledResult<string[]> =>
          result.status === "fulfilled"
        )
        .map((result) => result.value)
        .flat(),
    );
    return results;
  }
  return []; // Not a directory or file
}
