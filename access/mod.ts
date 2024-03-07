import { CurrentRuntime, Runtime } from "@cross/runtime";

// Defailt to failure
// deno-lint-ignore prefer-const
let access = () => { throw new Error("Unsupported Runtime") };

switch (CurrentRuntime) {
    case Runtime.Node:
        break;
    case Runtime.Deno:
        break;
    case Runtime.Bun:
        break;
    case Runtime.Browser:
        break;
}

export { access };