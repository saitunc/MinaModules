import { Field, PublicKey, UInt64, Poseidon, MerkleWitness, Struct, } from 'o1js';
export class MyMerkleWitness extends MerkleWitness(3) {
}
let w = {
    isLeft: false,
    sibling: Field(0),
};
let dummyWitness = Array.from(Array(MyMerkleWitness.height - 1).keys()).map(() => w);
export class Member extends Struct({
    publicKey: PublicKey,
    balance: UInt64,
    // need this to keep track of votes for candidates
    votes: Field,
    witness: MyMerkleWitness,
    votesWitness: MyMerkleWitness,
}) {
    constructor(publicKey, balance) {
        super({
            publicKey,
            balance,
            votes: Field(0),
            witness: new MyMerkleWitness(dummyWitness),
            votesWitness: new MyMerkleWitness(dummyWitness),
        });
    }
    getHash() {
        return Poseidon.hash(this.publicKey
            .toFields()
            .concat(this.balance.toFields())
            .concat(this.votes.toFields()));
    }
    addVote() {
        this.votes = this.votes.add(1);
        return this;
    }
    static empty() {
        return new Member(PublicKey.empty(), UInt64.zero);
    }
    static from(publicKey, balance) {
        return new Member(publicKey, balance);
    }
}
//# sourceMappingURL=member.js.map