import { Field } from 'o1js';
export { OffchainStorage };
declare class OffchainStorage<V extends {
    getHash(): Field;
}> extends Map<bigint, V> {
    readonly height: number;
    private merkleTree;
    constructor(height: number);
    set(key: bigint, value: V): this;
    get(key: bigint): V | undefined;
    getWitness(key: bigint): {
        isLeft: boolean;
        sibling: Field;
    }[];
    getRoot(): Field;
}
