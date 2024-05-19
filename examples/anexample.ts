import { Field } from "o1js";


const d = Field.from(12).mul(124523n).sub(3);
console.log(d.value[2]);
