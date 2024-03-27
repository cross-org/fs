# @cross/fs

A cross-runtime utility library collecting best practices around filesystem
operations for JavaScript and TypeScript. Available for Node, Deno Bun and
Browser at [jsr.io/@cross/fs](https://jsr.io/@cross/fs).

For cross rutime _path_ operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

**Note:** This is work in progress.

## Modules

### Stat

Example:

```
import { exists } from "@cross/fs/stat";

console.log(await exists("my/file"));
// -> true / false
```

Methods:

| Method    | Deno | Node | Bun | Browser (LocalStorage) |
| --------- | ---- | ---- | --- | ---------------------- |
| stat      | X    | X    | X   |                        |
| exists    | X    | X    | X   |                        |
| isDir     | X    | X    | X   |                        |
| isFile    | X    | X    | X   |                        |
| isSymlink | X    | X    | X   |                        |

### Io

Example:

```
import { readFile } from "@cross/fs/io";

console.log(await readFile("my/file"));
// -> My file content
```

| Method    | Deno | Node | Bun | Browser (LocalStorage) |
| --------- | ---- | ---- | --- | ---------------------- |
| readFile  | X    | X    | X   |                        |
| writeFile | X    | X    | X   |                        |

### Ops

Example:

```
import { mktempdir } from "@cross/fs/ops";

console.log(await mktempdir("my-prefix"));
// -> /tmp/my-prefix-7a8s78-as67d6as6-asd67a6sd-asdyda/
```

| Method    | Deno | Node | Bun | Browser (LocalStorage) |
| --------- | ---- | ---- | --- | ---------------------- |
| unlink    | X    | X    | X   |                        |
| mkdir     | X    | X    | X   |                        |
| mktempdir | X    | X    | X   |                        |
| rmdir     | X    | X    | X   |                        |
