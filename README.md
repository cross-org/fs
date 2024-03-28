# @cross/fs

A cross-runtime utility library offering best practices for file system
operations in JavaScript and TypeScript.

Available for Node, Deno Bun and Browser at
[jsr.io/@cross/fs](https://jsr.io/@cross/fs).

The library adheres to node:fs/promises conventions for familiarity, diverging
only for strategic performance, compatibility advantages or additional
convenience functions. To ensure cross-runtime reliability, the library
undergoes rigorous automated testing on Node LTS to current (>= 18), Deno and
Bun.

For cross rutime _path_ operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

## Modules

### Stat

Example:

```
import { exists, find } from "@cross/fs/stat";

// Check if my/file exists
console.log(await exists("my/file"));
// false

// Search for package.json recursively, starting from parent folder
console.log(await find("../", (path) => path.endsWith("package.json")));
// ["/home/.../package.json","/home/.../.../package.json"]
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

### Io

Example:

```
import { readFile } from "@cross/fs/io";

console.log(await readFile("my/file"));
// -> My file content
```

| Method     | Deno | Node | Bun | Base implementation |
| ---------- | ---- | ---- | --- | ------------------- |
| appendFile | X    | X    | X   | node:fs/promises    |
| readFile   | X    | X    | X   | node:fs/promises    |
| writeFile  | X    | X    | X   | node:fs/promises    |

### Ops

Example:

```
import { mktempdir, dirpath } from "@cross/fs/ops";

console.log(await mktempdir("my-prefix"));
// -> /tmp/my-prefix-luaepc2x-74plp8j8tf7-gzaurxst88g

console.log(await dirpath("config"));
// -> /home/user/.config
```

| Method    | Deno | Node | Bun | Base implementation |
| --------- | ---- | ---- | --- | ------------------- |
| unlink    | X    | X    | X   | node:fs/promises    |
| dirpath   | X    | X    | X   | @cross/dir          |
| mkdir     | X    | X    | X   | node:fs/promises    |
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
| watch     | X    | X    | X   | node:fs/promises    |
| truncate  | X    | X    | X   | node:fs/promises    |
