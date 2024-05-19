var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * This example shows how to iterate through incoming actions, not using `Reducer.reduce` but by
 * treating the actions as a merkle list.
 *
 * This is mainly intended as an example for using `MerkleList`, but it might also be useful as
 * a blueprint for processing actions in a custom and more explicit way.
 */
import { Bool, Mina, PublicKey, Reducer, SmartContract, method, assert, } from 'o1js';
const Action = PublicKey;
// constants for our static-sized provable code
const MAX_UPDATES_WITH_ACTIONS = 100;
const MAX_ACTIONS_PER_UPDATE = 2;
/**
 * This contract allows you to push either 1 or 2 public keys as actions,
 * and has a reducer-like method which checks whether a given public key is contained in those actions.
 */
class MerkleListReducing extends SmartContract {
    constructor() {
        super(...arguments);
        this.reducer = Reducer({ actionType: Action });
    }
    async postAddress(address) {
        this.reducer.dispatch(address);
    }
    // to exhibit the generality of reducer: can dispatch more than 1 action per account update
    async postTwoAddresses(a1, a2) {
        this.reducer.dispatch(a1);
        this.reducer.dispatch(a2);
    }
    async assertContainsAddress(address) {
        let actions = this.reducer.getActions();
        // prove that we know the correct action state
        this.account.actionState.requireEquals(actions.hash);
        // our provable code to process actions in reverse order is very straight-forward
        // (note: if we're past the actual sizes, `.pop()` returns a dummy Action -- in this case, the "empty" public key which is not equal to any real address)
        let hasAddress = Bool(false);
        for (let i = 0; i < MAX_UPDATES_WITH_ACTIONS; i++) {
            let merkleActions = actions.pop();
            for (let j = 0; j < MAX_ACTIONS_PER_UPDATE; j++) {
                let action = merkleActions.pop();
                hasAddress = hasAddress.or(action.equals(address));
            }
        }
        assert(actions.isEmpty()); // we processed all actions
        assert(hasAddress); // we found the address
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], MerkleListReducing.prototype, "postAddress", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey, PublicKey]),
    __metadata("design:returntype", Promise)
], MerkleListReducing.prototype, "postTwoAddresses", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], MerkleListReducing.prototype, "assertContainsAddress", null);
// TESTS
// set up a local blockchain
let Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);
let [sender, contractAccount, otherAddress, anotherAddress] = Local.testAccounts;
let contract = new MerkleListReducing(contractAccount);
// deploy the contract
await MerkleListReducing.compile();
console.log(`rows for ${MAX_UPDATES_WITH_ACTIONS} updates with actions`, (await MerkleListReducing.analyzeMethods()).assertContainsAddress.rows);
let deployTx = await Mina.transaction(sender, async () => contract.deploy());
await deployTx.sign([sender.key, contractAccount.key]).send();
// push some actions
let dispatchTx = await Mina.transaction(sender, async () => {
    await contract.postAddress(otherAddress);
    await contract.postAddress(contractAccount);
    await contract.postTwoAddresses(anotherAddress, sender);
    await contract.postAddress(anotherAddress);
    await contract.postTwoAddresses(contractAccount, otherAddress);
});
await dispatchTx.prove();
await dispatchTx.sign([sender.key]).send();
assert(contract.reducer.getActions().data.get().length === 5);
// check if the actions contain the `sender` address
Local.setProofsEnabled(true);
let containsTx = await Mina.transaction(sender, () => contract.assertContainsAddress(sender));
await containsTx.prove();
await containsTx.sign([sender.key]).send();
//# sourceMappingURL=actions-as-merkle-list.js.map