import { dir } from "@cross/dir";
import { join } from "@std/path";
import { uniqueFileName } from "../utils/unique.ts";

/**
 * Creates a unique path suitable for a new temporary file or directory
 *
 * @param prefix - An optional prefix for the generated file name.
 *
 * @returns The full path suitable for a new temporary file
 *
 * @throws On error
 */
export async function tempfile(prefix?: string): Promise<string> {
  const tempBaseDir = await dir("tmp");
  const uniqueName = `${prefix ? `${prefix}-` : ""}${uniqueFileName()}`;
  const tempDirPath = join(tempBaseDir, uniqueName);
  return tempDirPath;
}
