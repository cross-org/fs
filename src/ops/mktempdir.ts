import { dir } from "@cross/dir";
import { join } from "@std/path";
import { mkdir } from "./mkdir.ts";

/**
 * Creates a uniquely named directory under the system temp directory.
 *
 * @param prefix - An optional prefix for the generated directory name.
 * @returns The full path to the newly created temporary directory.
 * @throws On error
 */
export async function mktempdir(prefix?: string): Promise<string> {
  const tempBaseDir = await dir("tmp");

  // Generate a unique identifier without relying on something else
  // does not need to be cryptographically perfect
  const timestamp = performance.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2); // Remove '0.'
  const uniqueName = `${prefix ? `${prefix}-` : ""}${timestamp}-${randomPart}`;
  const tempDirPath = join(tempBaseDir, uniqueName);
  await mkdir(tempDirPath, { recursive: true });
  return tempDirPath;
}
