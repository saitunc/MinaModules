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
 * zkApps composability
 */
import { Field, method, Mina, AccountUpdate, SmartContract, state, State, } from 'o1js';
import { getProfiler } from '../utils/profiler.js';
const doProofs = true;
// contract which can add 1 to a number
class Incrementer extends SmartContract {
    async increment(x) {
        return x.add(1);
    }
}
__decorate([
    method.returns(Field),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], Incrementer.prototype, "increment", null);
// contract which can add two numbers, plus 1, and return the result
// incrementing by one is outsourced to another contract (it's cleaner that way, we want to stick to the single responsibility principle)
class Adder extends SmartContract {
    async addPlus1(x, y) {
        // compute result
        let sum = x.add(y);
        // call the other contract to increment
        let incrementer = new Incrementer(incrementerAccount);
        return await incrementer.increment(sum);
    }
}
__decorate([
    method.returns(Field),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], Adder.prototype, "addPlus1", null);
// contract which calls the Adder, stores the result on chain & emits an event
class Caller extends SmartContract {
    constructor() {
        super(...arguments);
        this.sum = State();
        this.events = { sum: Field };
    }
    async callAddAndEmit(x, y) {
        let adder = new Adder(adderAccount);
        let sum = await adder.addPlus1(x, y);
        this.emitEvent('sum', sum);
        this.sum.set(sum);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Caller.prototype, "sum", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], Caller.prototype, "callAddAndEmit", null);
const ComposabilityProfiler = getProfiler('Composability zkApp');
ComposabilityProfiler.start('Composability test flow');
// script to deploy zkapps and do interactions
let Local = await Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
const [feePayer] = Local.testAccounts;
let incrementerAccount = Mina.TestPublicKey.random();
let incrementer = new Incrementer(incrementerAccount);
let adderAccount = Mina.TestPublicKey.random();
let adder = new Adder(adderAccount);
let callerAccount = Mina.TestPublicKey.random();
let caller = new Caller(callerAccount);
if (doProofs) {
    console.log('compile (incrementer)');
    await Incrementer.compile();
    console.log('compile (adder)');
    await Adder.compile();
    console.log('compile (caller)');
    await Caller.compile();
}
console.log('deploy');
let tx = await Mina.transaction(feePayer, async () => {
    AccountUpdate.fundNewAccount(feePayer, 3);
    await caller.deploy();
    await adder.deploy();
    await incrementer.deploy();
});
await tx
    .sign([
    feePayer.key,
    callerAccount.key,
    adderAccount.key,
    incrementerAccount.key,
])
    .send();
console.log('call interaction');
tx = await Mina.transaction(feePayer, async () => {
    // we just call one contract here, nothing special to do
    await caller.callAddAndEmit(Field(5), Field(6));
});
console.log('proving (3 proofs.. can take a bit!)');
await tx.prove();
console.log(tx.toPretty());
await tx.sign([feePayer.key]).send();
// should hopefully be 12 since we added 5 + 6 + 1
console.log('state: ' + caller.sum.get());
ComposabilityProfiler.stop().store();
//# sourceMappingURL=composability.js.map