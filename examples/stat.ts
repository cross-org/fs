import { stat } from "../mod.ts";

console.debug(await stat("mod.ts", { bigInt: false }));
