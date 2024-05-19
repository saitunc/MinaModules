# Module 4 - Mina Protocol 

 In this module, you will start getting used to o1js and Mina protocol. Now, as you saw in Module 0, size of the blockchains increase in various reasons. This is not the case for Mina Protocol, since it has a constant size of 22 kBs! Lets try to understand why it is in that way.

-  [Mina Protocol explained (A very useful Playlist)](https://www.youtube.com/watch?v=GvwYJDzzI-g&list=PLItixFkgfjYFfKnYicUqYrsSCIU1SgD4L&index=1)
-  [ZkApps - which are simply Zero-knowledge based Dapps](https://docs.minaprotocol.com/zkapps)

  
Now that you have an understanding about Mina, you can start learning o1js materials: 
-  [o1js Introduction](https://docs.minaprotocol.com/zkapps/o1js)
-  [Tutorials for ZkApps](https://docs.minaprotocol.com/zkapps/tutorials)

We highly recommend you to check the codebase and see how the types implemented and try to build somethings. This is the brest way to understand the smart contracts in Mina. For learning the o1js basics in a structured way, you can use [Mina Playground](https://www.minaplayground.com/) tutorials.

There are some backbone classes and functions in o1js that makes it powerful. If you went through o1js materials, you've already seen the classes like MerkleTree, ZkProgram and SmartContract. It wouldn't hurt anyone to go over the important classes again. Through this part, i will try to explain how Mina smart contracts are different from other chains.


### ZkProgram

ZkProgram can be used to create a recursive programs. In this program, you can define methods and execute (infinite!) recursive steps in this program. Infinite, because after every step, program is 'compressed' to a proof. Via your ZkProgram, execution is verified in each step and proof of the execution so far is carried to the next step (in some sense, it is like incrementally verifiable computation).

```typescript
import {
  SelfProof,
  Field,
  ZkProgram,
  verify,
  Proof,
  JsonProof,
  Provable,
  Empty,
} from 'o1js';

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
      async method(earlierProof: SelfProof<Empty, Field>) {
        earlierProof.verify();
        return earlierProof.publicOutput.add(1);
      },
    },
  },
});
// type sanity checks
MyProgram.publicInputType satisfies Provable<Empty>;
MyProgram.publicOutputType satisfies typeof Field;

let MyProof = ZkProgram.Proof(MyProgram);

console.log('program digest', MyProgram.digest());

console.log('compiling MyProgram...');
let { verificationKey } = await MyProgram.compile();
console.log('verification key', verificationKey.data.slice(0, 10) + '..');

console.log('proving base case...');
let proof = await MyProgram.baseCase();
proof = await testJsonRoundtrip(MyProof, proof);

// type sanity check
proof satisfies Proof<undefined, Field>;

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

```
