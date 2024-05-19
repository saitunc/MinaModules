export { keccakAndEcdsa, ecdsa, Secp256k1, Ecdsa, Bytes32 };
declare const Secp256k1_base: typeof import("o1js").ForeignCurve;
declare class Secp256k1 extends Secp256k1_base {
}
declare const Ecdsa_base: typeof import("o1js").EcdsaSignature;
declare class Ecdsa extends Ecdsa_base {
}
declare const Bytes32_base: typeof import("o1js/dist/node/lib/provable/bytes").Bytes;
declare class Bytes32 extends Bytes32_base {
}
declare const keccakAndEcdsa: {
    name: string;
    compile: (options?: {
        cache?: import("o1js").Cache | undefined;
        forceRecompile?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<import("o1js/dist/node/lib/provable/bytes").Bytes, import("o1js/dist/node/lib/provable/bool").Bool>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        verifyEcdsa: {
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    }>;
    publicInputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js/dist/node/lib/provable/bytes").Bytes, {
        bytes: {
            value: string;
        }[];
    }>;
    publicOutputType: typeof import("o1js/dist/node/lib/provable/bool").Bool & ((x: boolean | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/bool").Bool) => import("o1js/dist/node/lib/provable/bool").Bool);
    privateInputTypes: {
        verifyEcdsa: [import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js").EcdsaSignature, {
            r: string;
            s: string;
        }>, import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js").ForeignCurve, {
            x: string;
            y: string;
        }>];
    };
    rawMethods: {
        verifyEcdsa: (publicInput: import("o1js/dist/node/lib/provable/bytes").Bytes, ...args: [import("o1js").EcdsaSignature, import("o1js").ForeignCurve] & any[]) => Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    };
} & {
    verifyEcdsa: (publicInput: import("o1js/dist/node/lib/provable/bytes").Bytes, ...args: [import("o1js").EcdsaSignature, import("o1js").ForeignCurve] & any[]) => Promise<import("o1js").Proof<import("o1js/dist/node/lib/provable/bytes").Bytes, import("o1js/dist/node/lib/provable/bool").Bool>>;
};
declare const ecdsa: {
    name: string;
    compile: (options?: {
        cache?: import("o1js").Cache | undefined;
        forceRecompile?: boolean | undefined;
    } | undefined) => Promise<{
        verificationKey: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        };
    }>;
    verify: (proof: import("o1js").Proof<import("o1js").AlmostForeignField, import("o1js/dist/node/lib/provable/bool").Bool>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        verifySignedHash: {
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    }>;
    publicInputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js").AlmostForeignField, bigint, string>;
    publicOutputType: typeof import("o1js/dist/node/lib/provable/bool").Bool & ((x: boolean | import("o1js/dist/node/lib/provable/core/fieldvar").FieldVar | import("o1js/dist/node/lib/provable/bool").Bool) => import("o1js/dist/node/lib/provable/bool").Bool);
    privateInputTypes: {
        verifySignedHash: [import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js").EcdsaSignature, {
            r: string;
            s: string;
        }>, import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js").ForeignCurve, {
            x: string;
            y: string;
        }>];
    };
    rawMethods: {
        verifySignedHash: (publicInput: import("o1js").AlmostForeignField, ...args: [import("o1js").EcdsaSignature, import("o1js").ForeignCurve] & any[]) => Promise<import("o1js/dist/node/lib/provable/bool").Bool>;
    };
} & {
    verifySignedHash: (publicInput: import("o1js").AlmostForeignField, ...args: [import("o1js").EcdsaSignature, import("o1js").ForeignCurve] & any[]) => Promise<import("o1js").Proof<import("o1js").AlmostForeignField, import("o1js/dist/node/lib/provable/bool").Bool>>;
};
