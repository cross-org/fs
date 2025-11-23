// deno-lint-ignore-file
import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Changes the current working directory in a cross-runtime compatible manner.
 *
 * Note: This operation is not supported in browser environments as browsers don't have
 * a mutable working directory concept. Calling this in a browser will throw an error.
 *
 * @param {string} path - The new working directory path.
 * @throws If the directory change fails or unsupported runtime is encountered.
 * @example
 * import { chdir } from "@cross/fs"; // Assuming you place it in a cross/fs module
 *
 * try {
 *   chdir("/home/user/projects");
 *   console.log("Current working directory changed successfully.");
 * } catch (error) {
 *   console.error("Failed to change directory:", error);
 * }
 */
export function chdir(path: string): void {
  if (CurrentRuntime === Runtime.Deno) {
    //@ts-ignore cross-runtime
    Deno.chdir(path);
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    //@ts-ignore cross-runtime
    process.chdir(path);
  } else if (CurrentRuntime === Runtime.Browser) {
    throw new Error("chdir is not supported in browser environments");
  } else {
    throw new Error("Cannot change directory in the current runtime.");
  }
}
