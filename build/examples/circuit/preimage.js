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
import { Poseidon, Field, Circuit, circuitMain, public_ } from 'o1js';
/**
 * Public input: a hash value h
 *
 * Prove:
 *   I know a value x such that hash(x) = h
 */
class Main extends Circuit {
    static main(preimage, hash) {
        Poseidon.hash([preimage]).assertEquals(hash);
    }
}
__decorate([
    circuitMain,
    __param(1, public_),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", void 0)
], Main, "main", null);
console.log('generating keypair...');
const kp = await Main.generateKeypair();
const preimage = Field(1);
const hash = Poseidon.hash([preimage]);
console.log('prove...');
const pi = await Main.prove([preimage], [hash], kp);
console.log('verify...');
let ok = await Main.verify([hash], kp.verificationKey(), pi);
console.log('ok?', ok);
if (!ok)
    throw Error('verification failed');
//# sourceMappingURL=preimage.js.map