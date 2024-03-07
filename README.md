# @cross/fs

**This is deprecated**

We started working on this library just to realise that there is already a fs
module supporting all runtimes, built into all runtimes - `node:fs/promises`.

If you want to work with paths, there is `@std/path`.

Here's how to use it, using stat as an example:

```js
import { stat } from "node:fs/promises";

const stats = await stat("mod.ts");

console.log(stats);
```

Run using

## Deno:

```bash
deno run --allow-read demo.ts
```

## Node:

```bash
npx tsx demo.ts
```

## Bun:

```bash
bun run demo.ts
```
