import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { writeFile } from "../io/mod.ts";
import { mkdir, mktempdir, rm } from "../ops/mod.ts";
import { diskusage, size } from "./size.ts";

test("size(dir, false) includes direct children only, size(dir, true) includes all descendants", async () => {
  const dir = await mktempdir("size-test");
  try {
    const subdir = `${dir}/sub`;
    await mkdir(subdir, { recursive: true });
    await writeFile(`${dir}/top.txt`, "x");
    await writeFile(`${subdir}/nested.txt`, "hello world");
    const sizeNonRecursive = await size(dir, false);
    const sizeRecursive = await size(dir, true);
    assertEquals(sizeNonRecursive < sizeRecursive, true);
    assertEquals(sizeRecursive >= 6, true);
  } finally {
    await rm(dir, { recursive: true });
  }
});

test("diskusage(dir, false) includes direct children only, diskusage(dir, true) includes all descendants", async () => {
  const dir = await mktempdir("diskusage-test");
  try {
    const subdir = `${dir}/sub`;
    await mkdir(subdir, { recursive: true });
    await writeFile(`${dir}/top.txt`, "x");
    await writeFile(`${subdir}/nested.txt`, "hello world");
    const diskusageNonRecursive = await diskusage(dir, false);
    const diskusageRecursive = await diskusage(dir, true);
    assertEquals(diskusageNonRecursive < diskusageRecursive, true);
  } finally {
    await rm(dir, { recursive: true });
  }
});
