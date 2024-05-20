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
import { SelfProof, Field, ZkProgram, verify } from 'o1js';

const AddOne = ZkProgram({
  name: "Example-Program",
  publicInput: Field,

  methods: {
    baseCase: {
      privateInputs: [],

      async method(publicInput: Field) {
        publicInput.assertEquals(Field(0));
      },
    },

    step: {
      privateInputs: [SelfProof],

      async method(publicInput: Field, earlierProof: SelfProof<Field, void>) {
        earlierProof.verify();
        earlierProof.publicInput.add(1).assertEquals(publicInput);
      },
    },
  },
});

const { verificationKey } = await AddOne.compile();

console.log('proving base case...');
let proof = await AddOne.baseCase(Field(0));

let ok = await verify(proof,verificationKey);
console.log("Is baseCase proven? : ", ok);

let proof1 = await AddOne.step(Field(1), proof);
let ok2 = await verify(proof1,verificationKey);
console.log("Is step1 proven? : ", ok2);

let proof2 = await AddOne.step(Field(2), proof1);
let ok3 = await verify(proof2,verificationKey);
console.log("Is step2 proven? : ", ok3);
```

SelfProof used here is an extended class of class Proof. It is not much different than Proof class and SelfProof is only to be used inside the ZkProgram. SelfProofs are given as a private input to the ZkProgram, while ZkProgram can also get PublicOutput and PublicInputs. This terms stems from the [Zk Circuits](https://medium.com/web3studio/simple-explanations-of-arithmetic-circuits-and-zero-knowledge-proofs-806e59a79785), which are told in previous Modules. What this Private/Public Input means is that you can hide some private information from anyone, prove each step and send the end proof to another party, where they will be able to verify it anywhere.

ZkProgram brings off-chain computation to be used by anyone. If you want to settle ZkProgram proofs to Mina Network, you can just give the end proof to a method of a Smart Contract and verify it there. So, this is a nice step to talk about Smart Contracts.

**Exercise Time**: Step by step calculation might remind you an elementary algorithm used for clarifying recursion. It is pretty like Fibonacci Sequence, right? Fibonacci Sequence(Algorithm) can be implemented using ZkProgram. Imagine you need 341253th step of Fibonacci sequence, yet your computer does not have enough computing power for that. You want from some other party to compute it, which you need to trust the result in the classical case. However, if you use ZkProgram and recursive Zk algorithms, the person can send you the result along proof and you can ~~trust~~ verify that the resultant number is really the number you asked for.

> Try to implement it with ZkProgram.

### Smart Contracts




