var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CircuitString, SmartContract, method, Mina, PrivateKey } from 'o1js';
import * as assert from 'assert/strict';
// circuit which tests a couple of string features
class MyContract extends SmartContract {
    async checkString(s) {
        let sWithExclamation = s.append(CircuitString.fromString('!'));
        sWithExclamation
            .equals(CircuitString.fromString('a string!'))
            .or(sWithExclamation.equals(CircuitString.fromString('some string!')))
            .assertTrue();
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CircuitString]),
    __metadata("design:returntype", Promise)
], MyContract.prototype, "checkString", null);
let address = PrivateKey.random().toPublicKey();
console.log('compile...');
await MyContract.compile();
// should work
console.log('prove...');
let tx = await Mina.transaction(() => new MyContract(address).checkString(CircuitString.fromString('a string')));
await tx.prove();
console.log('test 1 - ok');
// should work
tx = await Mina.transaction(() => new MyContract(address).checkString(CircuitString.fromString('some string')));
await tx.prove();
console.log('test 2 - ok');
// should fail
let fails = await Mina.transaction(() => new MyContract(address).checkString(CircuitString.fromString('different')))
    .then(() => false)
    .catch(() => true);
if (!fails)
    Error('proof was supposed to fail');
console.log('test 3 - ok');
const str = CircuitString.fromString('Your size');
const not_same_str = CircuitString.fromString('size');
assert.equal(str.equals(not_same_str).toBoolean(), false);
const equal1 = CircuitString.fromString('These strings are equivalent');
const equal2 = CircuitString.fromString('These strings are equivalent');
const circuitString = CircuitString.fromString('This string completely encompasses this string');
const substring = CircuitString.fromString('this string');
if (!equal1.equals(equal2).toBoolean())
    throw Error('Strings are not equivalent 1');
console.log('Equivalent: "', equal1.toString(), '", "', equal2.toString(), '"');
if (!circuitString.substring(35, 46).equals(substring).toBoolean())
    throw Error('Strings are not equivalent 2');
console.log('Equivalent: "', circuitString.substring(35, 46).toString(), '", "', substring.toString(), '"');
// if (!circuitString.contains(substring).toBoolean())
//   throw Error('String does not contain substring');
console.log(circuitString.append(substring).toString());
console.log('Everything looks good!');
//# sourceMappingURL=circuit-string.js.map