import { CurrentRuntime, Runtime } from "@cross/runtime";

/**
 * Returns the current working directory in a cross-runtime compatible manner.
 *
 * @returns {string} The current working directory path.
 * @throws
 * @example
 * // import { cwd } from "@cross/utils";
 *
 * const cwd = cwd();
 * console.log("The current working directory is:", cwd);
 */
export function cwd(): string {
  if (CurrentRuntime === Runtime.Deno) {
    //@ts-ignore cross-runtime
    return Deno.cwd();
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    //@ts-ignore cross-runtime
    return process.cwd();
  } else {
    throw new Error(
      "Cannot determine working directory using current runtime.",
    );
  }
}
