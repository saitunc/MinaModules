var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { state, State, method, UInt64, PrivateKey, SmartContract, Mina, AccountUpdate, } from 'o1js';
class SimpleZkapp extends SmartContract {
    constructor() {
        super(...arguments);
        this.x = State();
    }
    init() {
        super.init();
        this.x.set(new UInt64(0));
    }
    async increment() {
        let x = this.x.get();
        this.x.requireEquals(x);
        let newX = x.add(1);
        this.x.set(newX);
    }
}
__decorate([
    state(UInt64),
    __metadata("design:type", Object)
], SimpleZkapp.prototype, "x", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SimpleZkapp.prototype, "increment", null);
let Local = await Mina.LocalBlockchain({ proofsEnabled: false });
Mina.setActiveInstance(Local);
// a test account that pays all the fees, and puts additional funds into the zkapp
let [sender] = Local.testAccounts;
// the zkapp account
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();
let initialBalance = 10000000000;
let zkapp = new SimpleZkapp(zkappAddress);
await SimpleZkapp.analyzeMethods();
await Mina.transaction(sender, async () => {
    let senderUpdate = AccountUpdate.fundNewAccount(sender);
    senderUpdate.send({ to: zkappAddress, amount: initialBalance });
    await zkapp.deploy();
})
    .sign([sender.key, zkappKey])
    .send()
    .wait();
console.log('initial state: ' + zkapp.x.get());
console.log('increment');
await Mina.transaction(sender, async () => {
    await zkapp.increment();
})
    .prove()
    .sign([sender.key])
    .send()
    .wait();
console.log('final state: ' + zkapp.x.get());
const a = Mina.transaction(sender, async () => {
    await zkapp.increment();
});
a;
const b = a.prove();
const c = b.sign([sender.key]);
await c.send().wait();
//# sourceMappingURL=chaining-tx-methods.js.map