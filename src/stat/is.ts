import { NotFoundError, stat } from "./mod.ts";

/**
 * Checks if the specified path is a directory.
 *
 * @param path - The path to check.
 * @returns True if the path exists and is a directory, false otherwise.
 */
export async function isDir(path: string): Promise<boolean> {
  try {
    const result = await stat(path);
    return result.isDirectory;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    } else {
      throw error;
    }
  }
}

/**
 * Checks if the specified path is a regular file.
 *
 * @param path - The path to check.
 * @returns True if the path exists and is a regular file, false otherwise.
 */
export async function isFile(path: string): Promise<boolean> {
  try {
    const result = await stat(path);
    return result.isFile;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    } else {
      throw error;
    }
  }
}

/**
 * Checks if the specified path is a symbolic link.
 *
 * @param path - The path to check.
 * @returns True if the path exists and is a symbolic link, false otherwise.
 */
export async function isSymlink(path: string): Promise<boolean> {
  try {
    const result = await stat(path);
    return result.isSymlink;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    } else {
      throw error;
    }
  }
}
