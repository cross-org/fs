import { readdir, stat } from "node:fs/promises";
import { join } from "@std/path";

export async function diskusage(
  inPath: string,
  recursive?: boolean,
): Promise<number> {
  const statSelf = await stat(inPath);
  const blockSize = statSelf.blksize;
  const actualSize = Math.max(blockSize, statSelf.size);
  if (statSelf.isFile()) {
    return actualSize;
  }
  if (statSelf.isDirectory()) {
    const files = await readdir(inPath, { withFileTypes: true });
    const paths: Promise<number>[] = files.map((file) => {
      const path = join(inPath, file.name);
      return size(path, recursive);
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

export async function size(
  inPath: string,
  recursive?: boolean,
): Promise<number> {
  const statSelf = await stat(inPath);
  if (statSelf.isFile()) {
    return statSelf.size;
  }
  if (statSelf.isDirectory()) {
    const files = await readdir(inPath, { withFileTypes: true });
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
