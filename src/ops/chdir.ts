import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Changes the current working directory in a cross-runtime compatible manner.
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
  } else {
    throw new Error("Cannot change directory in the current runtime.");
  }
}
