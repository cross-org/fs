import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { hash } from "./hash.ts";

test("hash is calculated correctly", async () => {
  const sha = await hash("./LICENSE");
  assertEquals(
    sha,
    "f8c9819eb0c322eef28a0d0948877df068276f487b81326af842d3a20e7c9bbc",
  );
});
