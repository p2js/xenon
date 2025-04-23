import { minify } from "terser";
import { readFileSync, writeFileSync } from "fs";

let code = readFileSync("xenon.js", "utf8");

let result = await minify(code, {
    compress: {
        unused: false,
    },
    mangle: {
        eval: true,
        reserved: ["instance"],
        properties: {
            undeclared: true
        }
    }
});

console.log(`${code.length}B ==> ${result.code.length}B`);

writeFileSync("xenon.min.js", result.code);