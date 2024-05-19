var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, state, State, method, SmartContract, Mina, AccountUpdate, SelfProof, verify, } from 'o1js';
class TrivialZkapp extends SmartContract {
    async proveSomething(hasToBe1) {
        hasToBe1.assertEquals(1);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], TrivialZkapp.prototype, "proveSomething", null);
class TrivialProof extends TrivialZkapp.Proof() {
}
class NotSoSimpleZkapp extends SmartContract {
    constructor() {
        super(...arguments);
        this.x = State();
    }
    async initialize(proof) {
        proof.verify();
        this.x.set(Field(1));
    }
    async update(y, oldProof, trivialProof) {
        oldProof.verify();
        trivialProof.verify();
        let x = this.x.get();
        this.x.requireEquals(x);
        this.x.set(x.add(y));
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], NotSoSimpleZkapp.prototype, "x", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TrivialProof]),
    __metadata("design:returntype", Promise)
], NotSoSimpleZkapp.prototype, "initialize", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field,
        SelfProof,
        TrivialProof]),
    __metadata("design:returntype", Promise)
], NotSoSimpleZkapp.prototype, "update", null);
let Local = await Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
let [feePayer] = Local.testAccounts;
const [trivialContractAccount, notSoSimpleContractAccount] = Mina.TestPublicKey.random(2);
// compile and prove trivial zkapp
console.log('compile (trivial zkapp)');
let { verificationKey: trivialVerificationKey } = await TrivialZkapp.compile();
// TODO: should we have a simpler API for zkapp proving without
// submitting transactions? or is this an irrelevant use case?
// would also improve the return type -- `Proof` instead of `(Proof | undefined)[]`
console.log('prove (trivial zkapp)');
let [trivialProof] = await Mina.transaction(feePayer, async () => {
    await new TrivialZkapp(notSoSimpleContractAccount).proveSomething(Field(1));
})
    .prove()
    .proofs();
trivialProof = await testJsonRoundtripAndVerify(TrivialProof, trivialProof, trivialVerificationKey);
console.log('compile');
let { verificationKey } = await NotSoSimpleZkapp.compile();
let zkapp = new NotSoSimpleZkapp(trivialContractAccount);
console.log('deploy');
await Mina.transaction(feePayer, async () => {
    AccountUpdate.fundNewAccount(feePayer);
    await zkapp.deploy();
})
    .prove()
    .sign([feePayer.key, trivialContractAccount.key])
    .send();
console.log('initialize');
let tx = await Mina.transaction(feePayer, async () => {
    await zkapp.initialize(trivialProof);
})
    .prove()
    .sign([feePayer.key]);
let [proof] = tx.proofs;
await tx.send();
proof = await testJsonRoundtripAndVerify(NotSoSimpleZkapp.Proof(), proof, verificationKey);
console.log('initial state: ' + zkapp.x.get());
console.log('update');
tx = await Mina.transaction(feePayer, async () => {
    await zkapp.update(Field(3), proof, trivialProof);
})
    .prove()
    .sign([feePayer.key]);
[proof] = tx.proofs;
await tx.send();
proof = await testJsonRoundtripAndVerify(NotSoSimpleZkapp.Proof(), proof, verificationKey);
console.log('state 2: ' + zkapp.x.get());
console.log('update');
tx = await Mina.transaction(feePayer, async () => {
    await zkapp.update(Field(3), proof, trivialProof);
})
    .prove()
    .sign([feePayer.key]);
[proof] = tx.proofs;
await tx.send();
proof = await testJsonRoundtripAndVerify(NotSoSimpleZkapp.Proof(), proof, verificationKey);
console.log('final state: ' + zkapp.x.get());
async function testJsonRoundtripAndVerify(Proof, proof, verificationKey) {
    let jsonProof = proof.toJSON();
    console.log('json proof:', JSON.stringify({ ...jsonProof, proof: jsonProof.proof.slice(0, 10) + '..' }));
    let ok = await verify(jsonProof, verificationKey.data);
    if (!ok)
        throw Error('proof cannot be verified');
    return Proof.fromJSON(jsonProof);
}
//# sourceMappingURL=simple-zkapp-with-proof.js.map