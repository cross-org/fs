import { access, constants } from "./mod.ts";
import { getEnv } from "@cross/env";
import { join } from "@std/path";

/**
 * Searches for an executable file within the directories specified by the "PATH" environment variable.
 *
 * @param command - The name of the executable file to locate.
 * @returns The full path to the executable if found, otherwise null.
 */
export async function which(command: string): Promise<string | null> {
  const paths = getEnv("PATH")?.split(":");
  if (paths) {
    for (const dir of paths) {
      const fullPath = join(dir, command);
      try {
        await access(fullPath, constants.X_OK); // Check if executable
        return fullPath;
      } catch (_err) {
        // Ignore and try the next path
      }
    }
  }
  return null; // Not found
}
