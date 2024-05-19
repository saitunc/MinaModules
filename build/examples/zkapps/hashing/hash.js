var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Hash, Field, SmartContract, state, State, method, Permissions, Bytes, } from 'o1js';
let initialCommitment = Field(0);
class Bytes32 extends Bytes(32) {
}
export class HashStorage extends SmartContract {
    constructor() {
        super(...arguments);
        this.commitment = State();
    }
    init() {
        super.init();
        this.account.permissions.set({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
        this.commitment.set(initialCommitment);
    }
    async SHA256(xs) {
        const shaHash = Hash.SHA3_256.hash(xs);
        const commitment = Hash.hash(shaHash.toFields());
        this.commitment.set(commitment);
    }
    async SHA384(xs) {
        const shaHash = Hash.SHA3_384.hash(xs);
        const commitment = Hash.hash(shaHash.toFields());
        this.commitment.set(commitment);
    }
    async SHA512(xs) {
        const shaHash = Hash.SHA3_512.hash(xs);
        const commitment = Hash.hash(shaHash.toFields());
        this.commitment.set(commitment);
    }
    async Keccak256(xs) {
        const shaHash = Hash.Keccak256.hash(xs);
        const commitment = Hash.hash(shaHash.toFields());
        this.commitment.set(commitment);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], HashStorage.prototype, "commitment", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bytes32]),
    __metadata("design:returntype", Promise)
], HashStorage.prototype, "SHA256", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bytes32]),
    __metadata("design:returntype", Promise)
], HashStorage.prototype, "SHA384", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bytes32]),
    __metadata("design:returntype", Promise)
], HashStorage.prototype, "SHA512", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bytes32]),
    __metadata("design:returntype", Promise)
], HashStorage.prototype, "Keccak256", null);
//# sourceMappingURL=hash.js.map