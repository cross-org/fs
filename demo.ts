import { stat } from "node:fs/promises";

const stats = await stat("./demo.ts");

console.log(stats);
