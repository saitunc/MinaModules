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
 * This example deploys a zkApp and then updates its verification key via proof, self-replacing the zkApp
 */
import { SmartContract, VerificationKey, method, Permissions, Mina, AccountUpdate, Provable, } from 'o1js';
class SelfUpdater extends SmartContract {
    init() {
        super.init();
        this.account.permissions.set({
            ...Permissions.default(),
            setVerificationKey: Permissions.VerificationKey.proofDuringCurrentVersion(),
        });
    }
    async replaceVerificationKey(verificationKey) {
        this.account.verificationKey.set(verificationKey);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerificationKey]),
    __metadata("design:returntype", Promise)
], SelfUpdater.prototype, "replaceVerificationKey", null);
class Bar extends SmartContract {
    async call() {
        Provable.log('Bar');
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Bar.prototype, "call", null);
// setup
const Local = await Mina.LocalBlockchain({ proofsEnabled: true });
Mina.setActiveInstance(Local);
const contractAccount = Mina.TestPublicKey.random();
const contract = new SelfUpdater(contractAccount);
const [deployer] = Local.testAccounts;
// deploy first verification key
await SelfUpdater.compile();
const tx = await Mina.transaction(deployer, async () => {
    AccountUpdate.fundNewAccount(deployer);
    await contract.deploy();
});
await tx.prove();
await tx.sign([deployer.key, contractAccount.key]).send();
const fooVerificationKey = Mina.getAccount(contractAccount).zkapp?.verificationKey;
Provable.log('original verification key', fooVerificationKey);
// update verification key
const { verificationKey: barVerificationKey } = await Bar.compile();
const tx2 = await Mina.transaction(deployer, async () => {
    await contract.replaceVerificationKey(barVerificationKey);
});
await tx2.prove();
await tx2.sign([deployer.key]).send();
const updatedVerificationKey = Mina.getAccount(contractAccount).zkapp?.verificationKey;
// should be different from Foo
Provable.log('updated verification key', updatedVerificationKey);
//# sourceMappingURL=zkapp-self-update.js.map