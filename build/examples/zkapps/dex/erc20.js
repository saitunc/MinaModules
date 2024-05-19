var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Bool, CircuitString, Field, method, AccountUpdate, PublicKey, UInt64, Permissions, Mina, TokenContract, AccountUpdateForest, Struct, } from 'o1js';
export { TrivialCoin };
/**
 * A simple ERC20 token
 *
 * Tokenomics:
 * The supply is constant and the entire supply is initially sent to an account controlled by the zkApp developer
 * After that, tokens can be sent around with authorization from their owner, but new ones can't be minted.
 *
 * Functionality:
 * Just enough to be swapped by the DEX contract, and be secure
 */
class TrivialCoin extends TokenContract {
    constructor() {
        super(...arguments);
        // constant supply
        this.SUPPLY = UInt64.from(10n ** 18n);
        this.events = {
            Transfer: Struct({ from: PublicKey, to: PublicKey, value: UInt64 }),
        };
    }
    async deploy(args) {
        await super.deploy(args);
        this.account.tokenSymbol.set('TRIV');
        // make account non-upgradable forever
        this.account.permissions.set({
            ...Permissions.default(),
            setVerificationKey: Permissions.VerificationKey.impossibleDuringCurrentVersion(),
            setPermissions: Permissions.impossible(),
            access: Permissions.proofOrSignature(),
        });
    }
    async init() {
        super.init();
        // mint the entire supply to the token account with the same address as this contract
        let address = this.self.body.publicKey;
        let receiver = this.internal.mint({ address, amount: this.SUPPLY });
        // assert that the receiving account is new, so this can be only done once
        receiver.account.isNew.requireEquals(Bool(true));
        // pay fees for opened account
        this.balance.subInPlace(Mina.getNetworkConstants().accountCreationFee);
        // since this is the only method of this zkApp that resets the entire state, provedState: true implies
        // that this function was run. Since it can be run only once, this implies it was run exactly once
    }
    // ERC20 API
    async name() {
        return CircuitString.fromString('TrivialCoin');
    }
    async symbol() {
        return CircuitString.fromString('TRIV');
    }
    async decimals() {
        return Field(9);
    }
    async totalSupply() {
        return this.SUPPLY;
    }
    async balanceOf(owner) {
        let update = owner instanceof PublicKey
            ? AccountUpdate.create(owner, this.deriveTokenId())
            : owner;
        await this.approveAccountUpdate(update);
        return update.account.balance.getAndRequireEquals();
    }
    // TODO: doesn't emit a Transfer event yet
    // need to make transfer() a separate method from approveBase, which does the same as
    // `transfer()` on the base contract, but also emits the event
    // implement Approvable API
    async approveBase(forest) {
        this.checkZeroBalanceChange(forest);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrivialCoin.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountUpdateForest]),
    __metadata("design:returntype", Promise)
], TrivialCoin.prototype, "approveBase", null);
//# sourceMappingURL=erc20.js.map