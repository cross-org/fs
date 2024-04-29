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

For cross rutime _path_ operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

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

| Method    | Deno | Node | Bun | Base implementation |
| --------- | ---- | ---- | --- | ------------------- |
| stat      | X    | X    | X   | runtime native      |
| lstat     | X    | X    | X   | node:fs/promises    |
| exists    | X    | X    | X   | custom              |
| isDir     | X    | X    | X   | custom              |
| isFile    | X    | X    | X   | custom              |
| isSymlink | X    | X    | X   | custom              |
| size      | X    | X    | X   | custom              |
| find      | X    | X    | X   | custom              |
| diskusage | X    | X    | X   | custom              |
| hash      | X    | X    | X   | custom              |
| which     | X    | X    | X   | custom              |

### Io

Example:

```ts
import { readFile } from "@cross/fs/io";

console.log(await readFile("my/file"));
// -> My file content
```

Methods:

| Method     | Deno | Node | Bun | Base implementation |
| ---------- | ---- | ---- | --- | ------------------- |
| appendFile | X    | X    | X   | node:fs/promises    |
| readFile   | X    | X    | X   | node:fs/promises    |
| writeFile  | X    | X    | X   | node:fs/promises    |

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

| Method    | Deno | Node | Bun | Base implementation |
| --------- | ---- | ---- | --- | ------------------- |
| FsWatcher | X    | X    | X   | custom              |
| unlink    | X    | X    | X   | node:fs/promises    |
| dirpath   | X    | X    | X   | @cross/dir          |
| mkdir     | X    | X    | X   | node:fs/promises    |
| cwd       | X    | X    | X   | custom              |
| chdir     | X    | X    | X   | custom              |
| mktempdir | X    | X    | X   | custom              |
| rm        | X    | X    | X   | node:fs/promises    |
| rmdir     | X    | X    | X   | node:fs/promises    |
| cp        | X    | X    | X   | node:fs/promises    |
| tempfile  | X    | X    | X   | custom              |
| link      | X    | X    | X   | node:fs/promises    |
| unlink    | X    | X    | X   | node:fs/promises    |
| readdir   | X    | X    | X   | node:fs/promises    |
| readlink  | X    | X    | X   | node:fs/promises    |
| rename    | X    | X    | X   | node:fs/promises    |
| chmod     | X    | X    | X   | node:fs/promises    |
| chown     | X    | X    | X   | node:fs/promises    |
| rename    | X    | X    | X   | node:fs/promises    |
| truncate  | X    | X    | X   | node:fs/promises    |
| open      | X    | X    | X   | node:fs/promises    |
| access    | X    | X    | X   | node:fs/promises    |
| constants | X    | X    | X   | node:fs/promises    |

Types:

| Method    | Deno | Node | Bun | Base implementation |
| --------- | ---- | ---- | --- | ------------------- |
| FSWatcher | X    | X    | X   | node:fs/promises    |
