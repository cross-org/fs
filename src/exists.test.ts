import { assertEquals } from "@std/assert";
import { test } from "@cross/test";

import { exists } from "./exists.ts";

test("exists returns true on existing file", async () => {
  const result = await exists("./mod.ts");
  assertEquals(result, true);
});

test("exists returns false on non-existant file", async () => {
  const result = await exists("./mod-nonexistant.ts");
  assertEquals(result, false);
});
