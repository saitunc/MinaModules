import { SelfProof, Field, ZkProgram, verify, } from 'o1js';
let MyProgram = ZkProgram({
    name: 'example-with-output',
    publicOutput: Field,
    methods: {
        baseCase: {
            privateInputs: [],
            async method() {
                return Field(0);
            },
        },
        inductiveCase: {
            privateInputs: [SelfProof],
            async method(earlierProof) {
                earlierProof.verify();
                return earlierProof.publicOutput.add(1);
            },
        },
    },
});
// type sanity checks
MyProgram.publicInputType;
MyProgram.publicOutputType;
let MyProof = ZkProgram.Proof(MyProgram);
console.log('program digest', MyProgram.digest());
console.log('compiling MyProgram...');
let { verificationKey } = await MyProgram.compile();
console.log('verification key', verificationKey.data.slice(0, 10) + '..');
console.log('proving base case...');
let proof = await MyProgram.baseCase();
proof = await testJsonRoundtrip(MyProof, proof);
// type sanity check
proof;
console.log('verify...');
let ok = await verify(proof.toJSON(), verificationKey);
console.log('ok?', ok);
console.log('verify alternative...');
ok = await MyProgram.verify(proof);
console.log('ok (alternative)?', ok);
console.log('proving step 1...');
proof = await MyProgram.inductiveCase(proof);
proof = await testJsonRoundtrip(MyProof, proof);
console.log('verify...');
ok = await verify(proof, verificationKey);
console.log('ok?', ok);
console.log('verify alternative...');
ok = await MyProgram.verify(proof);
console.log('ok (alternative)?', ok);
console.log('proving step 2...');
proof = await MyProgram.inductiveCase(proof);
proof = await testJsonRoundtrip(MyProof, proof);
console.log('verify...');
ok = await verify(proof.toJSON(), verificationKey);
console.log('ok?', ok && proof.publicOutput.toString() === '2');
function testJsonRoundtrip(MyProof, proof) {
    let jsonProof = proof.toJSON();
    console.log('json proof', JSON.stringify({
        ...jsonProof,
        proof: jsonProof.proof.slice(0, 10) + '..',
    }));
    return MyProof.fromJSON(jsonProof);
}
//# sourceMappingURL=program.js.map