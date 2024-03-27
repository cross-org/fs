# @cross/fs

A cross-runtime utility library collecting best practices around filesystem
operations for JavaScript and TypeScript. Available for Node, Deno Bun and
Browser at [jsr.io/@cross/fs](https://jsr.io/@cross/fs).

For cross rutime _path_ operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

**Note:** This is work in progress.

## Coverage

| Module | Method     | Deno | Node | Bun | Browser (LocalStorage) |
| ------ | ---------- | ---- | ---- | --- | ---------------------- |
| stat   | stat       | X    | X    | X   |                        |
| stat   | exists     | X    | X    | X   |                        |
| stat   | isDir      | X    | X    | X   |                        |
| stat   | isFile     | X    | X    | X   |                        |
| stat   | isSymlink  | X    | X    | X   |                        |
| ------ | ---------- | ---- | ---- | --- | ---------------------- |
| io     | readFile   | X    | X    | X   |                        |
| io     | writeFile  | X    | X    | X   |                        |
| ------ | ---------- | ---- | ---- | --- | ---------------------- |
| ops    | unlink     | X    | X    | X   |                        |
| ops    | mkdir      | X    | X    | X   |                        |
| ops    | mktempdir  | X    | X    | X   |                        |
| ops    | rmdir      | X    | X    | X   |                        |
| ------ | ---------- | ---- | ---- | --- | ---------------------- |
