import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { find } from "./find.ts";

// Helper function to normalize path for cross-platform comparison
function normalizePath(path: string): string {
  return path.replace(/[\/\\]/g, "");
}

test("find locates find.test.ts file", async () => {
  const results = await find(".", (path) => path.endsWith("find.test.ts"));
  assertEquals(results.length > 0, true);

  // Normalize paths for cross-platform comparison
  const normalizedResults = results.map(normalizePath);
  const expectedPath = normalizePath("srcstatfind.test.ts");

  assertEquals(
    normalizedResults.some((path) => path.includes(expectedPath)),
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
