/**
 * RSA signature verification with o1js
 */
import { Field, Provable, Unconstrained } from 'o1js';
export { Bigint2048, rsaVerify65537 };
declare const Bigint2048_base: (new (value: {
    fields: import("o1js/dist/node/lib/provable/field").Field[];
    value: Unconstrained<bigint>;
}) => {
    fields: import("o1js/dist/node/lib/provable/field").Field[];
    value: Unconstrained<bigint>;
}) & {
    _isStruct: true;
} & Provable<{
    fields: import("o1js/dist/node/lib/provable/field").Field[];
    value: Unconstrained<bigint>;
}, {
    fields: bigint[];
    value: any;
}> & {
    fromValue: (value: {
        fields: import("o1js/dist/node/lib/provable/field").Field[] | bigint[];
        value: any;
    }) => {
        fields: import("o1js/dist/node/lib/provable/field").Field[];
        value: Unconstrained<bigint>;
    };
    toInput: (x: {
        fields: import("o1js/dist/node/lib/provable/field").Field[];
        value: Unconstrained<bigint>;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        fields: import("o1js/dist/node/lib/provable/field").Field[];
        value: Unconstrained<bigint>;
    }) => {
        fields: string[];
        value: {
            toFields: {};
            toAuxiliary: {};
            fromFields: {};
            sizeInFields: {};
            check: {};
            toValue: {};
            fromValue: {};
        };
    };
    fromJSON: (x: {
        fields: string[];
        value: {
            toFields: {};
            toAuxiliary: {};
            fromFields: {};
            sizeInFields: {};
            check: {};
            toValue: {};
            fromValue: {};
        };
    }) => {
        fields: import("o1js/dist/node/lib/provable/field").Field[];
        value: Unconstrained<bigint>;
    };
    empty: () => {
        fields: import("o1js/dist/node/lib/provable/field").Field[];
        value: Unconstrained<bigint>;
    };
};
declare class Bigint2048 extends Bigint2048_base {
    modMul(x: Bigint2048, y: Bigint2048): Bigint2048;
    modSquare(x: Bigint2048): Bigint2048;
    toBigint(): bigint;
    static from(x: bigint): Bigint2048;
    static check(x: {
        fields: Field[];
    }): void;
}
/**
 * RSA signature verification
 *
 * TODO this is a bit simplistic; according to RSA spec, message must be 256 bits
 * and the remaining bits must follow a specific pattern.
 */
declare function rsaVerify65537(message: Bigint2048, signature: Bigint2048, modulus: Bigint2048): void;
