// Merkle Tree and off chain storage
import { MerkleTree } from 'o1js';
export { OffchainStorage };
class OffchainStorage extends Map {
    constructor(height) {
        super();
        this.height = height;
        this.merkleTree = new MerkleTree(height);
    }
    set(key, value) {
        super.set(key, value);
        this.merkleTree.setLeaf(key, value.getHash());
        return this;
    }
    get(key) {
        return super.get(key);
    }
    getWitness(key) {
        return this.merkleTree.getWitness(key);
    }
    getRoot() {
        return this.merkleTree.getRoot();
    }
}
//# sourceMappingURL=off-chain-storage.js.map