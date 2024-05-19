var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, state, State, method, UInt64, PrivateKey, SmartContract, Mina, AccountUpdate, Bool, PublicKey, } from 'o1js';
const doProofs = true;
const beforeGenesis = UInt64.from(Date.now());
class Simple extends SmartContract {
    constructor() {
        super(...arguments);
        this.x = State();
        this.events = { update: Field, payout: UInt64, payoutReceiver: PublicKey };
    }
    async init() {
        super.init();
        this.x.set(initialState);
    }
    async update(y) {
        this.account.provedState.requireEquals(Bool(true));
        this.network.timestamp.requireBetween(beforeGenesis, UInt64.MAXINT());
        this.emitEvent('update', y);
        let x = this.x.get();
        this.x.requireEquals(x);
        let newX = x.add(y);
        this.x.set(newX);
        return newX;
    }
    /**
     * This method allows a certain privileged account to claim half of the contract balance, but only once
     * @param caller the privileged account
     */
    async payout(caller) {
        this.account.provedState.requireEquals(Bool(true));
        // check that caller is the privileged account
        let callerAddress = caller.toPublicKey();
        callerAddress.assertEquals(privileged);
        // assert that the caller account is new - this way, payout can only happen once
        let callerAccountUpdate = AccountUpdate.create(callerAddress);
        callerAccountUpdate.account.isNew.requireEquals(Bool(true));
        // pay out half of the contract balance to the caller
        let balance = this.account.balance.get();
        this.account.balance.requireEquals(balance);
        let halfBalance = balance.div(2);
        this.send({ to: callerAccountUpdate, amount: halfBalance });
        // emit some events
        this.emitEvent('payoutReceiver', callerAddress);
        this.emitEvent('payout', halfBalance);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Simple.prototype, "x", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Simple.prototype, "init", null);
__decorate([
    method.returns(Field),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], Simple.prototype, "update", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PrivateKey]),
    __metadata("design:returntype", Promise)
], Simple.prototype, "payout", null);
let Local = await Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
// a test account that pays all the fees, and puts additional funds into the contract
let [sender] = Local.testAccounts;
let contractAccount = Mina.TestPublicKey.random();
// a special account that is allowed to pull out half of the contract balance, once
let privileged = Mina.TestPublicKey(PrivateKey.fromBase58('EKEeoESE2A41YQnSht9f7mjiKpJSeZ4jnfHXYatYi8xJdYSxWBep'));
let initialBalance = 10000000000;
let initialState = Field(1);
let contract = new Simple(contractAccount);
if (doProofs) {
    console.log('compile');
    await Simple.compile();
}
console.log('deploy');
let tx = await Mina.transaction(sender, async () => {
    let senderUpdate = AccountUpdate.fundNewAccount(sender);
    senderUpdate.send({ to: contractAccount, amount: initialBalance });
    await contract.deploy();
});
await tx.prove();
await tx.sign([sender.key, contractAccount.key]).send();
console.log('initial state: ' + contract.x.get());
console.log(`initial balance: ${contract.account.balance.get().div(1e9)} MINA`);
let account = Mina.getAccount(contractAccount);
console.log('account state is proved:', account.zkapp?.provedState.toBoolean());
console.log('update');
tx = await Mina.transaction(sender, async () => {
    await contract.update(Field(3));
});
await tx.prove();
await tx.sign([sender.key]).send();
// pay more into the contract -- this doesn't need a proof
console.log('receive');
tx = await Mina.transaction(sender, async () => {
    let payerAccountUpdate = AccountUpdate.createSigned(sender);
    payerAccountUpdate.send({ to: contractAccount, amount: UInt64.from(8e9) });
});
await tx.sign([sender.key]).send();
console.log('payout');
tx = await Mina.transaction(sender, async () => {
    AccountUpdate.fundNewAccount(sender);
    await contract.payout(privileged.key);
});
await tx.prove();
await tx.sign([sender.key]).send();
console.log('final state: ' + contract.x.get());
console.log(`final balance: ${contract.account.balance.get().div(1e9)} MINA`);
//# sourceMappingURL=simple-zkapp.web.js.map