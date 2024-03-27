import { dir } from "@cross/dir";
import { generate } from "@std/uuid/v1";
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
  let uuid = generate();
  if (prefix) {
    uuid = `${prefix}-${uuid}`;
  }
  const tempDirPath = join(tempBaseDir, uuid.toString());
  await mkdir(tempDirPath, { recursive: true });
  return tempDirPath;
}
