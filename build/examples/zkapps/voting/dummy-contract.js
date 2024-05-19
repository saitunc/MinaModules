var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Permissions, } from 'o1js';
export class DummyContract extends SmartContract {
    constructor() {
        super(...arguments);
        this.sum = State();
    }
    async deploy(args) {
        await super.deploy(args);
        this.account.permissions.set({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
            editActionState: Permissions.proofOrSignature(),
            setPermissions: Permissions.proofOrSignature(),
            incrementNonce: Permissions.proofOrSignature(),
        });
        this.sum.set(Field(0));
    }
    /**
     * Method used to add two variables together.
     */
    async add(x, y) {
        this.sum.set(x.add(y));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], DummyContract.prototype, "sum", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", Promise)
], DummyContract.prototype, "add", null);
//# sourceMappingURL=dummy-contract.js.map