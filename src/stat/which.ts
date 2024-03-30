import { constants, stat } from "./mod.ts";
import { getEnv } from "@cross/env";
import { join } from "@std/path";

/**
 * Searches for an executable file within the directories specified by the "PATH" environment variable.
 *
 * Uses stat to check if anyone (as apposed to the current user) has execute permission on the found executable, to avoid getting the current user id, which require higher permission in certain runtimes.
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
        const fileInfo = await stat(fullPath);
        // Soft Permission Check: Check if anyone has execute permission
        if (
          fileInfo && fileInfo.mode &&
          (
            (fileInfo.mode & constants.S_IXOTH) ||
            (fileInfo.mode & constants.S_IXUSR) ||
            (fileInfo.mode & constants.S_IXGRP)
          )
        ) {
          return fullPath;
        }
      } catch (_err) {
        // Ignore and try the next path
      }
    }
  }
  return null; // Not found
}
