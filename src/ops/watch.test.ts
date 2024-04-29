import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { mktempdir, rm } from "./mod.ts";
import { join } from "@std/path";
import { type FileSystemEvent, FsWatcher } from "./watch.ts";
import { writeFile } from "../io/mod.ts";

test("FsWatcher watches for file changes", async () => {
  const watcher = FsWatcher();
  const tempdir = await mktempdir();
  const filePath = join(tempdir, "test.txt");
  const events: FileSystemEvent[] = [];
  setTimeout(async () => {
    await writeFile(filePath, "Hello");
  }, 1000);
  for await (const event of watcher.watch(tempdir)) {
    if (event.kind === "rename" && filePath == event.paths[0]) {
      events.push(event);
      break; // Stop watching after the creation event
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow some time
  watcher.close();
  await rm(tempdir, { recursive: true });
  assertEquals(events.length, 1);
  assertEquals(events[0].kind, "rename");
  assertEquals(events[0].paths[0], filePath);
});
