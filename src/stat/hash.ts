import { CurrentRuntime, Runtime } from "@cross/runtime";
import { readFile } from "../io/mod.ts";

/**
 * Calculates the hash of a file.
 * - Uses node:crypto in Node.js/Deno/Bun (supports sha256, sha1, md5, etc.)
 * - Uses Web Crypto API in browsers (supports sha256, sha1, sha384, sha512)
 *
 * @param filePath - The path to the file.
 * @param algorithm - The algorithm to use. In browsers, only sha256, sha1, sha384, sha512 are supported.
 * @returns The hash as a hexadecimal string.
 */
export async function hash(
  filePath: string,
  algorithm: string = "sha256",
): Promise<string> {
  const fileData = await readFile(filePath);
  
  if (CurrentRuntime === Runtime.Browser) {
    // Use Web Crypto API in browsers
    const algoMap: Record<string, string> = {
      'sha256': 'SHA-256',
      'sha1': 'SHA-1',
      'sha384': 'SHA-384',
      'sha512': 'SHA-512',
    };
    
    const webAlgo = algoMap[algorithm.toLowerCase()];
    if (!webAlgo) {
      throw new Error(`Hash algorithm '${algorithm}' is not supported in browsers. Supported: sha256, sha1, sha384, sha512`);
    }
    
    const hashBuffer = await crypto.subtle.digest(webAlgo, fileData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Use node:crypto in Node.js/Deno/Bun
    const nodeCrypto = await import("node:crypto");
    const hash = nodeCrypto.createHash(algorithm);
    hash.update(fileData);
    return hash.digest("hex");
  }
}