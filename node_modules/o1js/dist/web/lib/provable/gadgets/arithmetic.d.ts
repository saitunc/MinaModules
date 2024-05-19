import { Field } from '../wrapped.js';
export { divMod32, addMod32 };
declare function divMod32(n: Field, quotientBits?: number): {
    remainder: import("../field.js").Field;
    quotient: import("../field.js").Field;
};
declare function addMod32(x: Field, y: Field): import("../field.js").Field;
