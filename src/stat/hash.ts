import crypto from "node:crypto";
import { readFile } from "../io/mod.ts";

/**
 * Calculates the MD5 hash of a file.
 * - uses node:crypto for widest compatibility
 *
 * @param filePath - The path to the file.
 * @param algorithm - The algorithm to use
 * @returns The hash as a hexadecimal string.
 */
export async function hash(
  filePath: string,
  algorithm: string = "sha256",
): Promise<string> {
  const hash = crypto.createHash(algorithm);
  const fileData = await readFile(filePath);
  hash.update(fileData);
  return hash.digest("hex");
}
