import { SelfProof, Field, ZkProgram, verify, } from 'o1js';
let MyProgram = ZkProgram({
    name: 'example-with-input',
    publicInput: Field,
    methods: {
        baseCase: {
            privateInputs: [],
            async method(input) {
                input.assertEquals(Field(0));
            },
        },
        inductiveCase: {
            privateInputs: [SelfProof],
            async method(input, earlierProof) {
                earlierProof.verify();
                earlierProof.publicInput.add(1).assertEquals(input);
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
let proof = await MyProgram.baseCase(Field(0));
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
proof = await MyProgram.inductiveCase(Field(1), proof);
proof = await testJsonRoundtrip(MyProof, proof);
console.log('verify...');
ok = await verify(proof, verificationKey);
console.log('ok?', ok);
console.log('verify alternative...');
ok = await MyProgram.verify(proof);
console.log('ok (alternative)?', ok);
console.log('proving step 2...');
proof = await MyProgram.inductiveCase(Field(2), proof);
proof = await testJsonRoundtrip(MyProof, proof);
console.log('verify...');
ok = await verify(proof.toJSON(), verificationKey);
console.log('ok?', ok && proof.publicInput.toString() === '2');
function testJsonRoundtrip(MyProof, proof) {
    let jsonProof = proof.toJSON();
    console.log('json proof', JSON.stringify({
        ...jsonProof,
        proof: jsonProof.proof.slice(0, 10) + '..',
    }));
    return MyProof.fromJSON(jsonProof);
}
//# sourceMappingURL=program-with-input.js.map