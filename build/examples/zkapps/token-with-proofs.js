var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { method, Mina, AccountUpdate, SmartContract, PublicKey, TokenId, TokenContract, AccountUpdateForest, } from 'o1js';
class Token extends TokenContract {
    async approveBase(forest) {
        this.checkZeroBalanceChange(forest);
    }
    async mint(receiverAddress) {
        let amount = 1000000;
        this.internal.mint({ address: receiverAddress, amount });
    }
    async burn(receiverAddress) {
        let amount = 1000;
        this.internal.burn({ address: receiverAddress, amount });
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountUpdateForest]),
    __metadata("design:returntype", Promise)
], Token.prototype, "approveBase", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], Token.prototype, "mint", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], Token.prototype, "burn", null);
class B extends SmartContract {
    async approveSend() {
        this.balance.subInPlace(1000);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], B.prototype, "approveSend", null);
class C extends SmartContract {
    async approveSend() {
        this.balance.subInPlace(1000);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], C.prototype, "approveSend", null);
let Local = await Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
let [sender, tokenAccount1] = Local.testAccounts;
let initialBalance = 10000000;
const [tokenAccount, cAccount, bAccount] = Mina.TestPublicKey.random(3);
let token = new Token(tokenAccount);
let tokenId = token.deriveTokenId();
let b = new B(bAccount, tokenId);
let c = new C(cAccount, tokenId);
let tx;
console.log('tokenContractAccount', tokenAccount.toBase58());
console.log('accountC', bAccount.toBase58());
console.log('addressC', cAccount.toBase58());
console.log('receiverAddress', tokenAccount1.toBase58());
console.log('feePayer', sender.toBase58());
console.log('-------------------------------------------');
await Token.compile();
await B.compile();
await C.compile();
console.log('deploy tokenZkApp');
tx = await Mina.transaction(sender, async () => {
    await token.deploy();
    AccountUpdate.fundNewAccount(sender).send({
        to: token.self,
        amount: initialBalance,
    });
});
await tx.sign([sender.key, tokenAccount.key]).send();
console.log('deploy zkAppB and zkAppC');
tx = await Mina.transaction(sender, async () => {
    AccountUpdate.fundNewAccount(sender, 2);
    await c.deploy();
    await b.deploy();
    await token.approveAccountUpdates([c.self, b.self]);
});
console.log('deploy zkAppB and zkAppC (proof)');
await tx.prove();
await tx.sign([sender.key, bAccount.key, cAccount.key]).send();
console.log('mint token to zkAppB');
tx = await Mina.transaction(sender, async () => {
    await token.mint(bAccount);
});
await tx.prove();
await tx.sign([sender.key]).send();
console.log('approve send from zkAppB');
tx = await Mina.transaction(sender, async () => {
    await b.approveSend();
    // we call the token contract with the self update
    await token.transfer(b.self, cAccount, 1000);
});
console.log('approve send (proof)');
await tx.prove();
await tx.sign([sender.key]).send();
console.log(`contractC's balance for tokenId: ${TokenId.toBase58(tokenId)}`, Mina.getBalance(cAccount, tokenId).value.toBigInt());
console.log('approve send from zkAppC');
tx = await Mina.transaction(sender, async () => {
    // Pay for tokenAccount1's account creation
    AccountUpdate.fundNewAccount(sender);
    await c.approveSend();
    // we call the token contract with the tree
    await token.transfer(c.self, tokenAccount1, 1000);
});
console.log('approve send (proof)');
await tx.prove();
await tx.sign([sender.key]).send();
console.log(`tokenAccount1's balance for tokenId: ${TokenId.toBase58(tokenId)}`, Mina.getBalance(tokenAccount1, tokenId).value.toBigInt());
//# sourceMappingURL=token-with-proofs.js.map