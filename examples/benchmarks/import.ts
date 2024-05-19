let start = performance.now();
import { initializeBindings } from "o1js";
let time = performance.now() - start;

console.log(`import o1js: ${time.toFixed(0)}ms`);

start = performance.now();
await initializeBindings();
time = performance.now() - start;

console.log(`initialize bindings: ${time.toFixed(0)}ms`);
