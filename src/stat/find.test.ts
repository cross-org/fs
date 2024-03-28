import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { find } from "./find.ts";

test("find locates find.test.ts file", async () => {
  const results = await find(".", (path) => path.endsWith("find.test.ts"));
  assertEquals(results.length > 0, true);
  assertEquals(
    results.find((path) => path.includes("/src/stat/find.test.ts"))?.includes(
      "/src/stat/find.test.ts",
    ),
    true,
  );
});

test("find doest not locate findnonexistant.test.ts file", async () => {
  const results = await find(
    ".",
    (path) => path.endsWith("findnonexistant.test.ts"),
  );
  assertEquals(results.length === 0, true);
  assertEquals(
    results.find((path) => path.includes("/src/stat/findnonexistant.test.ts")),
    undefined,
  );
});
