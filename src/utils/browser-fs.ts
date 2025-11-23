/**
 * Browser filesystem adapter using ZenFS
 * 
 * This module provides a unified interface for filesystem operations in the browser
 * using ZenFS. It initializes ZenFS with an in-memory backend by default.
 * 
 * @module
 */

import { CurrentRuntime, Runtime } from "@cross/runtime";

let zenFS: typeof import("@zenfs/core").fs | null = null;
let zenFSInitialized = false;
let initializationPromise: Promise<typeof import("@zenfs/core").fs> | null = null;

/**
 * Initializes ZenFS for browser environment with default configuration
 * Uses InMemory backend by default for maximum compatibility
 */
async function initializeZenFS() {
  // Return existing initialization if in progress or completed
  if (initializationPromise) {
    return initializationPromise;
  }
  
  if (zenFSInitialized) {
    return zenFS!;
  }

  if (CurrentRuntime !== Runtime.Browser) {
    throw new Error("ZenFS should only be initialized in browser runtime");
  }

  initializationPromise = (async () => {
    try {
      const { configure, InMemory, fs } = await import("@zenfs/core");
      
      // Configure with in-memory filesystem by default
      await configure({
        mounts: {
          '/': { backend: InMemory },
        }
      });
      
      zenFS = fs;
      zenFSInitialized = true;
      return zenFS;
    } catch (error) {
      initializationPromise = null; // Reset on failure
      throw new Error(`Failed to initialize ZenFS: ${error}`);
    }
  })();
  
  return initializationPromise;
}

/**
 * Gets the ZenFS instance, initializing it if necessary
 * @returns The ZenFS fs instance
 */
export async function getBrowserFS(): Promise<typeof import("@zenfs/core").fs> {
  if (CurrentRuntime !== Runtime.Browser) {
    throw new Error("Browser filesystem can only be used in browser runtime");
  }
  
  if (!zenFSInitialized) {
    await initializeZenFS();
  }
  
  return zenFS!;
}

/**
 * Checks if ZenFS is available and initialized
 * @returns True if ZenFS is initialized
 */
export function isBrowserFSInitialized(): boolean {
  return zenFSInitialized;
}

/**
 * Allows manual configuration of ZenFS with custom backends
 * This should be called before any filesystem operations
 * 
 * @param config - ZenFS configuration object
 */
export async function configureBrowserFS(config: Parameters<typeof import("@zenfs/core").configure>[0]) {
  if (CurrentRuntime !== Runtime.Browser) {
    throw new Error("Browser filesystem can only be configured in browser runtime");
  }

  // If initialization is already in progress or complete, wait for it
  if (initializationPromise) {
    await initializationPromise;
    // Reset to allow reconfiguration
    zenFSInitialized = false;
    initializationPromise = null;
  }

  // Set up new initialization promise
  initializationPromise = (async () => {
    const { configure, fs } = await import("@zenfs/core");
    await configure(config);
    zenFS = fs;
    zenFSInitialized = true;
    return fs;
  })();
  
  await initializationPromise;
}
