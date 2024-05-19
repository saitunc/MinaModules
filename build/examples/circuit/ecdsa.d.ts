import { Circuit } from 'o1js';
export { Secp256k1, Ecdsa, Bytes32, Reserves };
declare const Secp256k1_base: typeof import("o1js").ForeignCurve;
declare class Secp256k1 extends Secp256k1_base {
}
declare const Ecdsa_base: typeof import("o1js").EcdsaSignature;
declare class Ecdsa extends Ecdsa_base {
}
declare const Bytes32_base: typeof import("o1js/dist/node/lib/provable/bytes").Bytes;
declare class Bytes32 extends Bytes32_base {
}
declare class Reserves extends Circuit {
    static main(message: Bytes32, signature: Ecdsa, publicKey: Secp256k1): void;
}
