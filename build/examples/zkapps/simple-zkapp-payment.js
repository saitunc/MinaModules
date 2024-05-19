var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { method, Mina, AccountUpdate, SmartContract, UInt64, Permissions, } from 'o1js';
class PaymentContainer extends SmartContract {
    init() {
        super.init();
        this.account.permissions.set({
            ...Permissions.default(),
            send: Permissions.proofOrSignature(),
        });
    }
    async withdraw(amount) {
        // unconstrained because we don't care where the user wants to withdraw to
        let to = this.sender.getUnconstrained();
        this.send({ to, amount });
    }
    async deposit(amount) {
        let sender = this.sender.getUnconstrained(); // unconstrained because we're already requiring a signature in the next line
        let senderUpdate = AccountUpdate.createSigned(sender);
        senderUpdate.send({ to: this, amount });
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UInt64]),
    __metadata("design:returntype", Promise)
], PaymentContainer.prototype, "withdraw", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UInt64]),
    __metadata("design:returntype", Promise)
], PaymentContainer.prototype, "deposit", null);
let proofsEnabled = false;
if (proofsEnabled)
    await PaymentContainer.compile();
let Local = await Mina.LocalBlockchain({ proofsEnabled });
Mina.setActiveInstance(Local);
// a test account that pays all the fees, and puts additional funds into the zkapp
const [feePayer] = Local.testAccounts;
const [contractAccount, account1, account2] = Mina.TestPublicKey.random(3);
function printBalances() {
    console.log(`zkApp balance:    ${Mina.getBalance(contractAccount).div(1e9)} MINA`);
    console.log(`account1 balance: ${Mina.getBalance(account1).div(1e9)} MINA`);
    console.log(`account2 balance: ${Mina.getBalance(account2).div(1e9)} MINA\n`);
}
let zkapp = new PaymentContainer(contractAccount);
let tx;
console.log('deploy and fund user accounts');
tx = await Mina.transaction(feePayer, async () => {
    let feePayerUpdate = AccountUpdate.fundNewAccount(feePayer, 3);
    feePayerUpdate.send({ to: account1, amount: 2e9 });
    feePayerUpdate.send({ to: account2, amount: 0 }); // just touch account #2, so it's created
    await zkapp.deploy();
});
await tx.sign([feePayer.key, contractAccount.key]).send();
printBalances();
console.log('---------- deposit MINA into zkApp (with proof) ----------');
tx = await Mina.transaction(account1, async () => {
    await zkapp.deposit(UInt64.from(1e9));
});
await tx.prove();
await tx.sign([account1.key]).send();
printBalances();
console.log('---------- send MINA from zkApp (with proof) ----------');
tx = await Mina.transaction(account1, async () => {
    await zkapp.withdraw(UInt64.from(1e9));
});
await tx.prove();
await tx.sign([account1.key]).send();
printBalances();
console.log('---------- send MINA between accounts (with signature) ----------');
tx = await Mina.transaction(account1, async () => {
    let account1Update = AccountUpdate.createSigned(account1);
    account1Update.send({ to: account2, amount: 1e9 });
});
await tx.sign([account1.key]).send();
printBalances();
//# sourceMappingURL=simple-zkapp-payment.js.map