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
 * treating the actions as a merkle list and using the built in `Iterator`.
 *
 * This is mainly intended as an example for using `Iterator` and `MerkleList`, but it might also be useful as
 * a blueprint for processing actions in a custom and more explicit way.
 */
import { Field, Mina, State, state, Reducer, SmartContract, method, assert, } from 'o1js';
// constants for our static-sized provable code
const MAX_UPDATES_WITH_ACTIONS = 100;
const MAX_ACTIONS_PER_UPDATE = 2;
/**
 * This contract allows you to push custom increments
 * and has a reducer-like method which accumulates all increments
 */
class ActionsContract extends SmartContract {
    constructor() {
        super(...arguments);
        this.reducer = Reducer({ actionType: Field });
        this.counter = State();
    }
    async increment(inc) {
        this.reducer.dispatch(inc);
    }
    async twoIncrements(inc1, inc2) {
        this.reducer.dispatch(inc1);
        this.reducer.dispatch(inc2);
    }
    async accumulate() {
        // get actions and, in a witness block, wrap them in a Merkle list of lists
        // get all actions
        let actions = this.reducer.getActions();
        // prove that we know the correct action state
        this.account.actionState.requireEquals(actions.hash);
        let counter = Field(0);
        let iter = actions.startIterating();
        let lastAction = Field(0);
        for (let i = 0; i < MAX_UPDATES_WITH_ACTIONS; i++) {
            let merkleActions = iter.next();
            let innerIter = merkleActions.startIterating();
            for (let j = 0; j < MAX_ACTIONS_PER_UPDATE; j++) {
                let action = innerIter.next();
                counter = counter.add(action);
                // we require that every action is greater than the previous one, except for dummy (0) actions
                // this checks that actions are applied in the right order
                assert(action.equals(0).or(action.greaterThan(lastAction)));
                lastAction = action;
            }
            innerIter.assertAtEnd();
        }
        iter.assertAtEnd();
        this.counter.set(this.counter.getAndRequireEquals().add(counter));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], ActionsContract.prototype, "counter", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], ActionsContract.prototype, "increment", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], ActionsContract.prototype, "twoIncrements", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActionsContract.prototype, "accumulate", null);
// TESTS
// set up a local blockchain
let Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);
let [sender, contractAddress] = Local.testAccounts;
let contract = new ActionsContract(contractAddress);
// deploy the contract
await ActionsContract.compile();
console.log(`rows for ${MAX_UPDATES_WITH_ACTIONS} updates with actions`, (await ActionsContract.analyzeMethods()).accumulate.rows);
let deployTx = await Mina.transaction(sender, async () => contract.deploy());
await deployTx.sign([sender.key, contractAddress.key]).send();
// push some actions
let dispatchTx = await Mina.transaction(sender, async () => {
    await contract.increment(Field(1));
    await contract.increment(Field(3));
    await contract.increment(Field(5));
    await contract.increment(Field(9));
    await contract.twoIncrements(Field(18), Field(19));
});
await dispatchTx.prove();
await dispatchTx.sign([sender.key]).send();
assert(contract.reducer.getActions().data.get().length === 5);
// accumulate actions
Local.setProofsEnabled(true);
let accTx = await Mina.transaction(sender, () => contract.accumulate());
await accTx.prove();
await accTx.sign([sender.key]).send();
assert(contract.counter.get().toBigInt() === 55n);
//# sourceMappingURL=actions-as-merkle-list-iterator.js.map