import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { mktempdir, rmdir } from "./mod.ts";
import { isDir } from "../stat/mod.ts";

test("mktempdir creates a temporary directory", async () => {
  const tempDir = await mktempdir();
  try {
    assertEquals(await isDir(tempDir), true);
  } finally {
    await rmdir(tempDir);
  }
});

test("mktempdir creates a temporary directory with prefix", async () => {
  const tempDir = await mktempdir("test");
  assertEquals(tempDir.includes("test-"), true);
  try {
    assertEquals(await isDir(tempDir), true);
  } finally {
    await rmdir(tempDir);
  }
});
