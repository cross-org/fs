import { tempfile } from "./tempfile.ts";
import { mkdir } from "./mod.ts";

/**
 * Creates a uniquely named directory under the system temp directory.
 *
 * @param prefix - An optional prefix for the generated directory name.
 * @returns The full path to the newly created temporary directory.
 * @throws On error
 */
export async function mktempdir(prefix?: string): Promise<string> {
  const tempDirPath = await tempfile(prefix);
  await mkdir(tempDirPath, { recursive: true });
  return tempDirPath;
}
