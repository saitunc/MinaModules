var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Circuit, circuitMain, public_, Crypto, createEcdsa, createForeignCurve, Bytes, assert, } from 'o1js';
export { Secp256k1, Ecdsa, Bytes32, Reserves };
class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {
}
class Ecdsa extends createEcdsa(Secp256k1) {
}
class Bytes32 extends Bytes(32) {
}
class Reserves extends Circuit {
    static main(message, signature, publicKey) {
        assert(signature.verify(message, publicKey));
    }
}
__decorate([
    circuitMain,
    __param(0, public_),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Bytes32,
        Ecdsa,
        Secp256k1]),
    __metadata("design:returntype", void 0)
], Reserves, "main", null);
console.time('generateKeypair');
let kp = await Reserves.generateKeypair();
console.timeEnd('generateKeypair');
let message = Bytes32.random();
let privateKey = Secp256k1.Scalar.random();
let publicKey = Secp256k1.generator.scale(privateKey);
let signature = Ecdsa.sign(message.toBytes(), privateKey.toBigInt());
console.time('prove');
let proof = await Reserves.prove([signature, publicKey], [message], kp);
console.timeEnd('prove');
console.time('verify');
let isValid = await Reserves.verify([message], kp.verificationKey(), proof);
assert(isValid, 'verifies');
console.timeEnd('verify');
//# sourceMappingURL=ecdsa.js.map