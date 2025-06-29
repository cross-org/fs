import { CurrentRuntime, Runtime } from "@cross/runtime";
import { watch as nodeWatch } from "node:fs/promises";
import type { WatchOptions } from "node:fs";
import { join } from "@std/path";

/**
 * Options for configuring file system watchers.
 */
export interface FileSystemWatcherOptions {
  recursive: boolean;
  signal?: AbortSignal;
}

/**
 * Types of file system events that can be detected by watchers.
 */
export type FileSystemEventKind =
  | "error"
  | "any"
  | "access"
  | "modify"
  | "remove"
  | "rename"
  | "other";

/**
 * Represents a file system event with its type and affected paths.
 */
export interface FileSystemEvent {
  kind: FileSystemEventKind;
  paths: (string | undefined)[];
}

/**
 * Interface for file system watchers that can monitor directories for changes.
 */
export interface Watcher {
  watch(
    path: string,
    options?: FileSystemWatcherOptions,
  ): AsyncIterable<FileSystemEvent>;
  close(): void;
}

/**
 * Creates a cross-runtime compatible file system watcher.
 *
 * @returns A watcher instance that can monitor file system changes.
 *
 * @example
 * ```typescript
 * const watcher = FsWatcher();
 *
 * for await (const event of watcher.watch(".")) {
 *   console.log("File changed:", event.kind, event.paths);
 * }
 *
 * // Don't forget to close the watcher when done
 * watcher.close();
 * ```
 */
export function FsWatcher(): Watcher {
  let denoWatcher: Deno.FsWatcher | undefined;
  let nodeWatcher: AsyncIterable<unknown>;
  let bunWatcher: AsyncIterable<unknown>;
  const ac = new AbortController();
  return {
    async *watch(
      path: string,
      options?: FileSystemWatcherOptions,
    ): AsyncIterable<FileSystemEvent> {
      try {
        if (CurrentRuntime === Runtime.Deno) {
          denoWatcher = Deno.watchFs(path, options);
          for await (const event of denoWatcher) {
            const generatedEvent: FileSystemEvent = {
              kind: (event.kind === "create"
                ? "rename"
                : event.kind) as FileSystemEventKind,
              paths: event.paths,
            };
            yield generatedEvent;
          }
        } else if (CurrentRuntime === Runtime.Node) {
          const usedOptions: FileSystemWatcherOptions = options
            ? options
            : { recursive: true };
          if (!options?.signal) usedOptions.signal = ac.signal;
          nodeWatcher = await nodeWatch(path, usedOptions as WatchOptions);
          for await (const event of nodeWatcher) {
            //@ts-ignore cross-runtime
            if (event.filename) {
              const generatedEvent = {
                //@ts-ignore cross-runtime
                kind: (event.eventType === "change"
                  ? "modify"
                  //@ts-ignore cross-runtime
                  : event.eventType) as FileSystemEventKind,
                //@ts-ignore cross-runtime
                paths: [join(path, event.filename?.toString())],
              };
              yield generatedEvent;
            }
          }
        } else if (CurrentRuntime === Runtime.Bun) {
          const usedOptions: FileSystemWatcherOptions = options
            ? options
            : { recursive: true };
          if (!options?.signal) usedOptions.signal = ac.signal;
          bunWatcher = await nodeWatch(path, usedOptions as WatchOptions);
          for await (const event of bunWatcher) {
            //@ts-ignore cross-runtime
            if (event.filename) {
              // @ts-ignore cross-runtime
              let kind = event.eventType;
              if (kind === "change") kind = "modify";
              const generatedEvent = {
                //@ts-ignore cross-runtime
                kind: kind as FileSystemEventKind,
                //@ts-ignore cross-runtime
                paths: [join(path, event.filename?.toString())],
              };
              yield generatedEvent;
            }
          }
        } else {
          throw new Error("cross/watchFs: Runtime not supported.");
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          /* Ok! */
        } else {
          throw new Error(
            "Cannot start asynchronous filesystem watcher using current runtime.",
          );
        }
      }
    },
    close() {
      if (denoWatcher) {
        try {
          denoWatcher.close();
        } catch (_e) { /* Ignore */ }
      }
      if (nodeWatcher || bunWatcher) {
        ac?.abort();
      }
    },
  };
}
