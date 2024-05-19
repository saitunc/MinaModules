import { SmartContract, State } from 'o1js';
declare const Bytes32_base: typeof import("o1js/dist/node/lib/provable/bytes").Bytes;
declare class Bytes32 extends Bytes32_base {
}
export declare class HashStorage extends SmartContract {
    commitment: State<import("o1js/dist/node/lib/provable/field").Field>;
    init(): void;
    SHA256(xs: Bytes32): Promise<void>;
    SHA384(xs: Bytes32): Promise<void>;
    SHA512(xs: Bytes32): Promise<void>;
    Keccak256(xs: Bytes32): Promise<void>;
}
export {};
