# @cross/fs

A cross-runtime utility library offering best practices for file system
operations in JavaScript and TypeScript. Available for Node.js, Deno, Bun, and
browsers at [jsr.io/@cross/fs](https://jsr.io/@cross/fs).

Automated testing across Node.js (>=18), Deno, and Bun ensures cross-runtime
reliability of all included methods. The library includes useful convenience
functions such as `which`, `find`, `diskusage`, `size` and `hash`. It uses
selected parts of `node:fs/promises` as a foundation for core operations,
strategically diverging to offer performance optimizations or broader
compatibility.

For browser environments, the library uses [ZenFS](https://zenfs.dev/core/) to
provide a Node.js-compatible filesystem API with support for various storage
backends including in-memory, IndexedDB, and more.

For cross rutime _path_ operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

## Browser Support

This library supports browser environments through ZenFS, which provides a
Node.js-compatible filesystem API. By default, an in-memory filesystem is used,
but you can configure different backends such as IndexedDB for persistent
storage.

### Basic Browser Usage

```ts
import { readFile, writeFile } from "@cross/fs/io";
import { exists, mkdir } from "@cross/fs";

// Use filesystem operations - in-memory by default
await mkdir("/data");
await writeFile("/data/test.txt", "Hello from the browser!");
console.log(await readFile("/data/test.txt", "utf8"));
// "Hello from the browser!"
```

### Configuring Persistent Storage

For persistent browser storage using IndexedDB or other backends:

```ts
import { configureBrowserFS } from "@cross/fs";

// Import ZenFS backends you want to use
// Note: Install @zenfs/dom separately for IndexedDB and WebAccess backends
const { IndexedDB, InMemory } = await import("@zenfs/dom");

// Configure before using filesystem operations
await configureBrowserFS({
  mounts: {
    '/storage': { backend: IndexedDB },  // Persistent storage
    '/tmp': { backend: InMemory }        // Temporary in-memory storage
  }
});

// Now use the filesystem with persistent storage
import { writeFile, readFile } from "@cross/fs/io";
await writeFile("/storage/config.json", JSON.stringify({ theme: "dark" }));
```

### Browser Limitations

Some operations are not available or have limitations in browser environments:

- `chdir()` - Not supported (throws error)
- `cwd()` - Always returns "/" 
- `which()` - Not applicable in browsers
- File permissions (chmod, chown) - Limited or not supported
- Symbolic links - Depends on ZenFS backend

## Modules

### Stat

Example:

```ts
import { exists, find, hash, which } from "@cross/fs/stat";

// Check if my/file exists
console.log(await exists("my/file"));
// false

// Search for package.json recursively, starting from parent folder
console.log(await find("../", (path) => path.endsWith("package.json")));
// ["/home/.../package.json","/home/.../.../package.json"]

// Get the sha256 hash of a file
console.log(await hash("LICENSE.md", "sha256"));
// f8c9819eb0c322eef28a0d0948877df068276f487b81326af842d3a20e7c9bbc

// Find the installation folder of bun
console.log(await which("bun"));
// /home/hexagon/.bun/bin/bun
```

Methods:

| Method    | Deno | Node | Bun | Browser | Base implementation |
| --------- | ---- | ---- | --- | ------- | ------------------- |
| stat      | X    | X    | X   | X       | runtime native      |
| lstat     | X    | X    | X   | X       | node:fs/promises    |
| exists    | X    | X    | X   | X       | custom              |
| isDir     | X    | X    | X   | X       | custom              |
| isFile    | X    | X    | X   | X       | custom              |
| isSymlink | X    | X    | X   | X       | custom              |
| size      | X    | X    | X   | X       | custom              |
| find      | X    | X    | X   | X       | custom              |
| diskusage | X    | X    | X   | -       | custom              |
| hash      | X    | X    | X   | X       | custom              |
| which     | X    | X    | X   | -       | custom              |

### Io

Example:

```ts
import { readFile } from "@cross/fs/io";

console.log(await readFile("my/file"));
// -> My file content
```

Methods:

| Method     | Deno | Node | Bun | Browser | Base implementation |
| ---------- | ---- | ---- | --- | ------- | ------------------- |
| readFile   | X    | X    | X   | X       | node:fs/promises    |
| writeFile  | X    | X    | X   | X       | node:fs/promises    |

### Ops

Example:

```ts
import { dirpath, mktempdir } from "@cross/fs/ops";

console.log(await mktempdir("my-prefix"));
// -> /tmp/my-prefix-luaepc2x-74plp8j8tf7-gzaurxst88g

console.log(await dirpath("config"));
// -> /home/user/.config
```

Methods:

| Method    | Deno | Node | Bun | Browser | Base implementation |
| --------- | ---- | ---- | --- | ------- | ------------------- |
| FsWatcher | X    | X    | X   | -       | custom              |
| unlink    | X    | X    | X   | X       | node:fs/promises    |
| dirpath   | X    | X    | X   | -       | @cross/dir          |
| mkdir     | X    | X    | X   | X       | node:fs/promises    |
| cwd       | X    | X    | X   | X*      | custom              |
| chdir     | X    | X    | X   | -       | custom              |
| mktempdir | X    | X    | X   | X       | custom              |
| rm        | X    | X    | X   | X       | node:fs/promises    |
| rmdir     | X    | X    | X   | X       | node:fs/promises    |
| cp        | X    | X    | X   | X       | node:fs/promises    |
| tempfile  | X    | X    | X   | X       | custom              |
| link      | X    | X    | X   | -       | node:fs/promises    |
| readdir   | X    | X    | X   | X       | node:fs/promises    |
| readlink  | X    | X    | X   | -       | node:fs/promises    |
| realpath  | X    | X    | X   | -       | node:fs/promises    |
| rename    | X    | X    | X   | X       | node:fs/promises    |
| chmod     | X    | X    | X   | -       | node:fs/promises    |
| chown     | X    | X    | X   | -       | node:fs/promises    |
| truncate  | X    | X    | X   | -       | node:fs/promises    |
| open      | X    | X    | X   | -       | node:fs/promises    |
| access    | X    | X    | X   | X       | node:fs/promises    |
| constants | X    | X    | X   | X       | node:fs/promises    |

*Browser: `cwd()` always returns "/"

Types:

| Method    | Deno | Node | Bun | Browser | Base implementation |
| --------- | ---- | ---- | --- | ------- | ------------------- |
| FSWatcher | X    | X    | X   | -       | node:fs/promises    |

Examples:

```typescript
const watcher = FsWatcher();
for await (const event of watcher.watch(tempdir)) {
  if (event.kind === "modify" && filePath == event.paths[0]) {
    console.log(event);
    break; // Stop watching after the first creation event
  }
}
watcher.close();
```
