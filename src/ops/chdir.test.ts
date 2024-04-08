import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { chdir, cwd } from "./mod.ts";
import { mktempdir, rmdir } from "./mod.ts";

test("chdir successfully changes working directory", async () => {
  // Set up a temporary working directory
  const tempDir = await mktempdir();

  try {
    const originalCwd = cwd();

    // Change to the temporary directory
    chdir(tempDir);

    // Assert that the current working directory has changed
    assertEquals(cwd(), tempDir);

    // Change back to original working directory for cleanup
    chdir(originalCwd);
  } finally {
    // Clean up temporary directory
    await rmdir(tempDir);
  }
});
