var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartContract, method, UInt64, AccountUpdate, PublicKey } from 'o1js';
export class Escrow extends SmartContract {
    async deposit(user) {
        // add your deposit logic circuit here
        // that will adjust the amount
        const payerUpdate = AccountUpdate.createSigned(user);
        payerUpdate.send({ to: this.address, amount: UInt64.from(1000000) });
    }
    async withdraw(user) {
        // add your withdrawal logic circuit here
        // that will adjust the amount
        this.send({ to: user, amount: UInt64.from(1000000) });
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], Escrow.prototype, "deposit", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicKey]),
    __metadata("design:returntype", Promise)
], Escrow.prototype, "withdraw", null);
//# sourceMappingURL=escrow.js.map