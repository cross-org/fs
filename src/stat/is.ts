import { NotFoundError, stat } from "./mod.ts";

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
