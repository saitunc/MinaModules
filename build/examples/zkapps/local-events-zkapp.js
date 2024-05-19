var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, state, State, method, PrivateKey, SmartContract, Mina, AccountUpdate, UInt32, PublicKey, Struct, } from 'o1js';
const doProofs = false;
class Event extends Struct({ pub: PublicKey, value: Field }) {
}
class LocalEvents extends SmartContract {
    constructor() {
        super(...arguments);
        this.x = State();
        this.events = {
            complexEvent: Event,
            simpleEvent: Field,
        };
    }
    init() {
        super.init();
        this.x.set(initialState);
    }
    async update(y) {
        this.emitEvent('complexEvent', {
            pub: PrivateKey.random().toPublicKey(),
            value: y,
        });
        this.emitEvent('simpleEvent', y);
        let x = this.x.get();
        this.x.requireEquals(x);
        this.x.set(x.add(y));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], LocalEvents.prototype, "x", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], LocalEvents.prototype, "update", null);
let Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);
// a test account that pays all the fees, and puts additional funds into the zkapp
const [feePayer] = Local.testAccounts;
let contractAccount = Mina.TestPublicKey.random();
let contract = new LocalEvents(contractAccount);
let initialState = Field(1);
if (doProofs) {
    console.log('compile');
    await LocalEvents.compile();
}
console.log('deploy');
let tx = await Mina.transaction(feePayer, async () => {
    AccountUpdate.fundNewAccount(feePayer);
    await contract.deploy();
});
await tx.sign([feePayer.key, contractAccount.key]).send();
console.log('call update');
tx = await Mina.transaction(feePayer, async () => {
    await contract.update(Field(1));
});
await tx.prove();
await tx.sign([feePayer.key]).send();
console.log('call update');
tx = await Mina.transaction(feePayer, async () => {
    await contract.update(Field(2));
});
await tx.prove();
await tx.sign([feePayer.key]).send();
console.log('---- emitted events: ----');
// fetches all events from zkapp starting block height 0
let events = await contract.fetchEvents(UInt32.from(0));
console.log(events);
console.log('---- emitted events: ----');
// fetches all events from zkapp starting block height 0 and ending at block height 10
events = await contract.fetchEvents(UInt32.from(0), UInt32.from(10));
console.log(events);
console.log('---- emitted events: ----');
// fetches all events
events = await contract.fetchEvents();
console.log(events);
//# sourceMappingURL=local-events-zkapp.js.map