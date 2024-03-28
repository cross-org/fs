import { assertEquals } from "@std/assert";
import { test } from "@cross/test";

import { isDir, isFile } from "./is.ts";

test("isFile returns true on existing file", async () => {
  const result = await isFile("./mod.ts");
  assertEquals(result, true);
});

test("isFile returns false on non-existiantfile", async () => {
  const result = await isFile("./mod-nonexistant.ts");
  assertEquals(result, false);
});

test("isDir returns false on existing file", async () => {
  const result = await isDir("./mod.ts");
  assertEquals(result, false);
});

test("isFile returns false on existing dir", async () => {
  const result = await isFile("./src");
  assertEquals(result, false);
});

test("isDir returns true on existing dir", async () => {
  const result = await isDir("./src");
  assertEquals(result, true);
});
