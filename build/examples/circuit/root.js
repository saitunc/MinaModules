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
import { Field, Circuit, circuitMain, public_, Gadgets } from 'o1js';
/**
 * Public input: a field element x
 *
 * Prove:
 *   I know a value y < 2^64 that is a cube root of x.
 */
class Main extends Circuit {
    static main(x, y) {
        Gadgets.rangeCheck64(y);
        let y3 = y.square().mul(y);
        y3.assertEquals(x);
    }
}
__decorate([
    circuitMain,
    __param(0, public_),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field]),
    __metadata("design:returntype", void 0)
], Main, "main", null);
console.log('generating keypair...');
console.time('generating keypair...');
const kp = await Main.generateKeypair();
console.timeEnd('generating keypair...');
console.log('prove...');
console.time('prove...');
const x = Field(8);
const y = Field(2);
const proof = await Main.prove([y], [x], kp);
console.timeEnd('prove...');
console.log('verify...');
console.time('verify...');
let vk = kp.verificationKey();
let ok = await Main.verify([x], vk, proof);
console.timeEnd('verify...');
console.log('ok?', ok);
//# sourceMappingURL=root.js.map