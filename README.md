# @cross/fs

**Work in progress** Cross Runtime filesystem operations for JavaScript and
TypeScript.

Available for Node, Deno Bun and Browser at
[jsr.io/@cross/fs](https://jsr.io/@cross/fs), works seamlessly with both
JavaScript and TypeScript.

For cross rutime path operations, [jsr.io/@std/path](https://jsr.io/@std/path)
will cover most scenarios, this library focuses on the file system operations.

## Coverage

| Method    | Deno | Node | Bun | Browser (LocalStorage) |
| --------- | ---- | ---- | --- | ---------------------- |
| stat      | X    | X    | X   |                        |
| exists    | X    | X    | X   |                        |
| isDir     | X    | X    | X   |                        |
| isFile    | X    | X    | X   |                        |
| isSymlink | X    | X    | X   |                        |
| ...       |      |      |     |                        |

## Contribution guide

## Deno

```bash
# Run an example using Deno
deno run -A examples/stat.ts
```

## Bun

```bash
# Install deps locally
bun jsr add @cross/runtime
```

```bash
# Run an example using Bun
bun run examples/stat.ts
```

## Node

````bash
# Install deps locally
npx jsr add @cross/runtime
``

```bash
# Run an example using tsx in Node
npx tsx examples/stat.ts
````
