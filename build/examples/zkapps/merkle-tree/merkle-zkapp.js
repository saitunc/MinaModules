/*
Description:

This example describes how developers can use Merkle Trees as a basic off-chain storage tool.

zkApps on Mina can only store a small amount of data on-chain, but many use cases require your application to at least reference big amounts of data.
Merkle Trees give developers the power of storing large amounts of data off-chain, but proving its integrity to the on-chain smart contract!


! Unfamiliar with Merkle Trees? No problem! Check out https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartContract, Poseidon, Field, State, state, PublicKey, Mina, method, UInt32, AccountUpdate, MerkleTree, MerkleWitness, Struct, } from 'o1js';
const doProofs = true;
class MyMerkleWitness extends MerkleWitness(8) {
}
class Account extends Struct({
    publicKey: PublicKey,
    points: UInt32,
}) {
    hash() {
        return Poseidon.hash(Account.toFields(this));
    }
    addPoints(points) {
        return new Account({
            publicKey: this.publicKey,
            points: this.points.add(points),
        });
    }
}
// we need the initiate tree root in order to tell the contract about our off-chain storage
let initialCommitment = Field(0);
/*
  We want to write a smart contract that serves as a leaderboard,
  but only has the commitment of the off-chain storage stored in an on-chain variable.
  The accounts of all participants will be stored off-chain!
  If a participant can guess the preimage of a hash, they will be granted one point :)
*/
class Leaderboard extends SmartContract {
    constructor() {
        super(...arguments);
        // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
        this.commitment = State();
    }
    async init() {
        super.init();
        this.commitment.set(initialCommitment);
    }
    async guessPreimage(guess, account, path) {
        // this is our hash! its the hash of the preimage "22", but keep it a secret!
        let target = Field('17057234437185175411792943285768571642343179330449434169483610110583519635705');
        // if our guess preimage hashes to our target, we won a point!
        Poseidon.hash([guess]).assertEquals(target);
        // we fetch the on-chain commitment
        let commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);
        // we check that the account is within the committed Merkle Tree
        path.calculateRoot(account.hash()).assertEquals(commitment);
        // we update the account and grant one point!
        let newAccount = account.addPoints(1);
        // we calculate the new Merkle Root, based on the account changes
        let newCommitment = path.calculateRoot(newAccount.hash());
        this.commitment.set(newCommitment);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Leaderboard.prototype, "commitment", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Leaderboard.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Account, MyMerkleWitness]),
    __metadata("design:returntype", Promise)
], Leaderboard.prototype, "guessPreimage", null);
let Local = await Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
let initialBalance = 10000000000;
let [feePayer] = Local.testAccounts;
let contractAccount = Mina.TestPublicKey.random();
// this map serves as our off-chain in-memory storage
let Accounts = new Map(['Bob', 'Alice', 'Charlie', 'Olivia'].map((name, index) => {
    return [
        name,
        new Account({
            publicKey: Local.testAccounts[index + 1], // `+ 1` is to avoid reusing the account aliased as `feePayer`
            points: UInt32.from(0),
        }),
    ];
}));
// we now need "wrap" the Merkle tree around our off-chain storage
// we initialize a new Merkle Tree with height 8
const Tree = new MerkleTree(8);
Tree.setLeaf(0n, Accounts.get('Bob').hash());
Tree.setLeaf(1n, Accounts.get('Alice').hash());
Tree.setLeaf(2n, Accounts.get('Charlie').hash());
Tree.setLeaf(3n, Accounts.get('Olivia').hash());
// now that we got our accounts set up, we need the commitment to deploy our contract!
initialCommitment = Tree.getRoot();
let contract = new Leaderboard(contractAccount);
console.log('Deploying leaderboard..');
if (doProofs) {
    await Leaderboard.compile();
}
let tx = await Mina.transaction(feePayer, async () => {
    AccountUpdate.fundNewAccount(feePayer).send({
        to: contractAccount,
        amount: initialBalance,
    });
    await contract.deploy();
});
await tx.prove();
await tx.sign([feePayer.key, contractAccount.key]).send();
console.log('Initial points: ' + Accounts.get('Bob')?.points);
console.log('Making guess..');
await makeGuess('Bob', 0n, 22);
console.log('Final points: ' + Accounts.get('Bob')?.points);
async function makeGuess(name, index, guess) {
    let account = Accounts.get(name);
    let w = Tree.getWitness(index);
    let witness = new MyMerkleWitness(w);
    let tx = await Mina.transaction(feePayer, async () => {
        await contract.guessPreimage(Field(guess), account, witness);
    });
    await tx.prove();
    await tx.sign([feePayer.key, contractAccount.key]).send();
    // if the transaction was successful, we can update our off-chain storage as well
    account.points = account.points.add(1);
    Tree.setLeaf(index, account.hash());
    contract.commitment.get().assertEquals(Tree.getRoot());
}
//# sourceMappingURL=merkle-zkapp.js.map