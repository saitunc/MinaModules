import { Field, PrivateKey, SmartContract, State } from 'o1js';
export declare const adminPrivateKey: PrivateKey;
export declare const adminPublicKey: import("o1js").PublicKey;
export declare class HelloWorld extends SmartContract {
    x: State<import("o1js/dist/node/lib/provable/field").Field>;
    init(): void;
    update(squared: Field, admin: PrivateKey): Promise<void>;
}
