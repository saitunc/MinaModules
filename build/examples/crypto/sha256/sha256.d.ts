export { SHA256Program, Bytes12 };
declare const Bytes12_base: typeof import("o1js/dist/node/lib/provable/bytes").Bytes;
declare class Bytes12 extends Bytes12_base {
}
declare let SHA256Program: {
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
    verify: (proof: import("o1js").Proof<undefined, import("o1js/dist/node/lib/provable/bytes").Bytes>) => Promise<boolean>;
    digest: () => Promise<string>;
    analyzeMethods: () => Promise<{
        sha256: {
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
            publicInputSize: number;
            print(): void;
            summary(): Partial<Record<import("o1js/dist/node/snarky").GateType | "Total rows", number>>;
        };
    }>;
    publicInputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<undefined, undefined, null>;
    publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js/dist/node/lib/provable/bytes").Bytes, {
        bytes: {
            value: string;
        }[];
    }>;
    privateInputTypes: {
        sha256: [import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<import("o1js/dist/node/lib/provable/bytes").Bytes, {
            bytes: {
                value: string;
            }[];
        }>];
    };
    rawMethods: {
        sha256: (...args: [import("o1js/dist/node/lib/provable/bytes").Bytes] & any[]) => Promise<import("o1js/dist/node/lib/provable/bytes").Bytes>;
    };
} & {
    sha256: (...args: [import("o1js/dist/node/lib/provable/bytes").Bytes] & any[]) => Promise<import("o1js").Proof<undefined, import("o1js/dist/node/lib/provable/bytes").Bytes>>;
};
