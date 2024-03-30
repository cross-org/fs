import { NotFoundError, stat } from "./mod.ts";

/**
 * Checks if a file or directory exists at the specified path.
 *
 * @param path - The path to the file or directory.
 * @returns True if the file or directory exists, otherwise false.
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    } else {
      throw error;
    }
  }
}
