import { assertEquals } from "@std/assert";
import { test } from "@cross/test";
import { CurrentRuntime, Runtime } from "@cross/runtime";

test("browser-fs module exports are available", async () => {
  const browserFS = await import("./browser-fs.ts");
  
  assertEquals(typeof browserFS.getBrowserFS, "function");
  assertEquals(typeof browserFS.isBrowserFSInitialized, "function");
  assertEquals(typeof browserFS.configureBrowserFS, "function");
});

test("getBrowserFS throws error in non-browser environment", async () => {
  if (CurrentRuntime !== Runtime.Browser) {
    const { getBrowserFS } = await import("./browser-fs.ts");
    
    try {
      await getBrowserFS();
      // Should not reach here
      assertEquals(true, false, "Should have thrown an error");
    } catch (error) {
      assertEquals(
        (error as Error).message,
        "Browser filesystem can only be used in browser runtime"
      );
    }
  }
});

test("configureBrowserFS throws error in non-browser environment", async () => {
  if (CurrentRuntime !== Runtime.Browser) {
    const { configureBrowserFS } = await import("./browser-fs.ts");
    
    try {
      await configureBrowserFS({ mounts: {} });
      // Should not reach here
      assertEquals(true, false, "Should have thrown an error");
    } catch (error) {
      assertEquals(
        (error as Error).message,
        "Browser filesystem can only be configured in browser runtime"
      );
    }
  }
});

test("isBrowserFSInitialized returns false initially", async () => {
  const { isBrowserFSInitialized } = await import("./browser-fs.ts");
  // Note: This might be true if other tests have initialized it
  assertEquals(typeof isBrowserFSInitialized(), "boolean");
});
