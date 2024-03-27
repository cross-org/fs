import { NotFoundError, stat } from "./mod.ts";
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