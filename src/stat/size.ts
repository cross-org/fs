import { readdir } from "node:fs/promises";
import { stat } from "./mod.ts";
import { join } from "@std/path";

/**
 * Calculates the actual disk usage of a file or directory (considering file system block sizes).
 *
 * @param inPath - The path to the file or directory.
 * @param recursive - If `true`, calculates disk usage recursively for directories. Defaults to `false`.
 * @returns The total disk usage in bytes.
 * @remarks With `recursive: true`, directory symlinks that form a cycle (e.g. pointing at an ancestor) may cause non-termination; avoid such structures or use shallow traversal.
 */
export async function diskusage(
  inPath: string,
  recursive?: boolean,
): Promise<number> {
  const statSelf = await stat(inPath);
  const blockSize = statSelf.blksize;
  const actualSize = Math.max(blockSize!, statSelf.size);
  if (statSelf.isFile) {
    return actualSize;
  }
  if (statSelf.isDirectory) {
    const files = await readdir(inPath, { withFileTypes: true });
    if (!recursive) {
      const childUsage = await Promise.all(
        files.map((file) => {
          const path = join(inPath, file.name);
          return stat(path).then((s) => Math.max(s.blksize ?? 0, s.size));
        }),
      );
      return actualSize + childUsage.reduce((a, b) => a + b, 0);
    }
    const paths: Promise<number>[] = files.map((file) => {
      const path = join(inPath, file.name);
      return diskusage(path, recursive);
    });
    const results = await Promise.allSettled(paths);
    const sizes = results
      .map((result) => result.status === "fulfilled" ? result.value : 0)
      .flat(Infinity)
      .reduce((i, size) => i + size, 0);
    return sizes + actualSize;
  }
  return actualSize;
}

/**
 * Calculates the total size of a file or directory.
 *
 * @param inPath - The path to the file or directory.
 * @param recursive - If `true`, calculates size recursively for directories. Defaults to `false`.
 * @returns The total size in bytes.
 * @remarks With `recursive: true`, directory symlinks that form a cycle (e.g. pointing at an ancestor) may cause non-termination; avoid such structures or use shallow traversal.
 */
export async function size(
  inPath: string,
  recursive?: boolean,
): Promise<number> {
  const statSelf = await stat(inPath);
  if (statSelf.isFile) {
    return statSelf.size;
  }
  if (statSelf.isDirectory) {
    const files = await readdir(inPath, { withFileTypes: true });
    if (!recursive) {
      const childSizes = await Promise.all(
        files.map((file) => {
          const path = join(inPath, file.name);
          return stat(path).then((s) => s.size);
        }),
      );
      return statSelf.size + childSizes.reduce((a, b) => a + b, 0);
    }
    const paths: Promise<number>[] = files.map((file) => {
      const path = join(inPath, file.name);
      return size(path, recursive);
    });
    const results = await Promise.allSettled(paths);
    const sizes = results
      .map((result) => result.status === "fulfilled" ? result.value : 0)
      .flat(Infinity)
      .reduce((i, size) => i + size, 0);
    return sizes + statSelf.size;
  }
  return statSelf.size;
}
