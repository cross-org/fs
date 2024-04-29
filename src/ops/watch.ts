import { CurrentRuntime, Runtime } from "@cross/runtime";
import { watch as nodeWatch } from "node:fs/promises";
import type { WatchOptions } from "node:fs";
import { join } from "@std/path";

export interface FileSystemWatcherOptions {
  recursive: boolean;
  signal?: AbortSignal;
}
export type FileSystemEventKind =
  | "error"
  | "any"
  | "access"
  | "create"
  | "modify"
  | "remove"
  | "other";
export interface FileSystemEvent {
  kind: FileSystemEventKind;
  paths: (string | undefined)[];
}
export interface Watcher {
  watch(
    path: string,
    options?: FileSystemWatcherOptions,
  ): AsyncIterable<FileSystemEvent>;
  close(): void;
}
export function FsWatcher(): Watcher {
  let denoWatcher: Deno.FsWatcher | undefined;
  let nodeWatcher: AsyncIterable<unknown>;
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
            yield event;
          }
        } else if (
          CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
        ) {
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
        } else {
          throw new Error("cross/watchFs: Runtime not supported.");
        }
      } catch (err) {
        if (err.name === "AbortError") {
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
      if (nodeWatcher) {
        ac?.abort();
      }
    },
  };
}
