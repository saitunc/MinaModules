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

The methods defined are supposed to be async functions. 

ZkProgram brings off-chain computation to be used by anyone. If you want to settle ZkProgram proofs to Mina Network, you can just give the end proof to a method of a Smart Contract and verify it there. So, this is a nice step to talk about Smart Contracts.

**Exercise Time**: Step by step calculation might remind you an elementary algorithm used for clarifying recursion. It is pretty like Fibonacci Sequence, right? Fibonacci Sequence(Algorithm) can be implemented using ZkProgram. Imagine you need 341253th step of Fibonacci sequence, yet your computer does not have enough computing power for that. You want from some other party to compute it, which you need to trust the result in the classical case. However, if you use ZkProgram and recursive Zk algorithms, the person can send you the result along proof and you can ~~trust~~ verify that the resultant number is really the number you asked for.

> Try to implement it with ZkProgram.

### Smart Contracts

This step is very important for understanding the smart contracts in Mina Protocol. Think about smart contracts in Ethereum. You write the contract, deploy it to Ethereum and when interacted, EVM handles the operations. In Mina, it is not the case. First of all, there is no such VM that 'executes' smart contract codes, because smart contracts are compiled to zk Circuits before deployment. When users interact with the smart contract, underlying zk circuit is executed and a proof is generated for state transition. Proof of a correct transition leads to a verification, and network updates to the new state.

This leads users/developers to keep their data private and provide only the necessary data to the smart contract. 

Here is an example Smart contract (also called zkApp when deployed): 

```typescript
import {
  SmartContract,
  Poseidon,
  Field,
  State,
  state,
  PublicKey,
  Mina,
  method,
  UInt32,
  AccountUpdate,
  MerkleTree,
  MerkleWitness,
  Struct,
} from 'o1js';

const doProofs = true;

class MyMerkleWitness extends MerkleWitness(8) {}

class Account extends Struct({
  publicKey: PublicKey,
  points: UInt32,
}) {
  hash(): Field {
    return Poseidon.hash(Account.toFields(this));
  }

  addPoints(points: number) {
    return new Account({
      publicKey: this.publicKey,
      points: this.points.add(points),
    });
  }
}
// we need the initiate tree root in order to tell the contract about our off-chain storage
let initialCommitment: Field = Field(0);
/*
  We want to write a smart contract that serves as a leaderboard,
  but only has the commitment of the off-chain storage stored in an on-chain variable.
  The accounts of all participants will be stored off-chain!
  If a participant can guess the preimage of a hash, they will be granted one point :)
*/

class Leaderboard extends SmartContract {
  // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
  @state(Field) commitment = State<Field>();

  @method async init() {
    super.init();
    this.commitment.set(initialCommitment);
  }

  @method
  async guessPreimage(guess: Field, account: Account, path: MyMerkleWitness) {
    // this is our hash! its the hash of the preimage "22", but keep it a secret!
    let target = Field(
      '17057234437185175411792943285768571642343179330449434169483610110583519635705'
    );
    // if our guess preimage hashes to our target, we won a point!
    Poseidon.hash([guess]).assertEquals(target);

    // we fetch the on-chain commitment
    let commitment = this.commitment.get();
    this.commitment.requireEquals(commitment);

    // we check that the account is within the committed Merkle Tree
    path.calculateRoot(account.hash()).assertEquals(commitment);

    // we update the account and grant one point!
    let newAccount = account.addPoints(1);

    // we calculate the new Merkle Root, based on the account changes
    let newCommitment = path.calculateRoot(newAccount.hash());

    this.commitment.set(newCommitment);
  }
}

type Names = 'Bob' | 'Alice' | 'Charlie' | 'Olivia';

let Local = await Mina.LocalBlockchain({ proofsEnabled: doProofs });
Mina.setActiveInstance(Local);
let initialBalance = 10_000_000_000;

let [feePayer] = Local.testAccounts;

let contractAccount = Mina.TestPublicKey.random();

// this map serves as our off-chain in-memory storage
let Accounts: Map<string, Account> = new Map<Names, Account>(
  ['Bob', 'Alice', 'Charlie', 'Olivia'].map((name: string, index: number) => {
    return [
      name as Names,
      new Account({
        publicKey: Local.testAccounts[index + 1], // `+ 1` is to avoid reusing the account aliased as `feePayer`
        points: UInt32.from(0),
      }),
    ];
  })
);

// we now need "wrap" the Merkle tree around our off-chain storage
// we initialize a new Merkle Tree with height 8
const Tree = new MerkleTree(8);

Tree.setLeaf(0n, Accounts.get('Bob')!.hash());
Tree.setLeaf(1n, Accounts.get('Alice')!.hash());
Tree.setLeaf(2n, Accounts.get('Charlie')!.hash());
Tree.setLeaf(3n, Accounts.get('Olivia')!.hash());

// now that we got our accounts set up, we need the commitment to deploy our contract!
initialCommitment = Tree.getRoot();

let contract = new Leaderboard(contractAccount);
console.log('Deploying leaderboard..');
if (doProofs) {
  await Leaderboard.compile();
}
let tx = await Mina.transaction(feePayer, async () => {
  AccountUpdate.fundNewAccount(feePayer).send({
    to: contractAccount,
    amount: initialBalance,
  });
  await contract.deploy();
});
await tx.prove();
await tx.sign([feePayer.key, contractAccount.key]).send();

console.log('Initial points: ' + Accounts.get('Bob')?.points);

console.log('Making guess..');
await makeGuess('Bob', 0n, 22);

console.log('Final points: ' + Accounts.get('Bob')?.points);

async function makeGuess(name: Names, index: bigint, guess: number) {
  let account = Accounts.get(name)!;
  let w = Tree.getWitness(index);
  let witness = new MyMerkleWitness(w);

  let tx = await Mina.transaction(feePayer, async () => {
    await contract.guessPreimage(Field(guess), account, witness);
  });
  await tx.prove();
  await tx.sign([feePayer.key, contractAccount.key]).send();

  // if the transaction was successful, we can update our off-chain storage as well
  account.points = account.points.add(1);
  Tree.setLeaf(index, account.hash());
  contract.commitment.get().assertEquals(Tree.getRoot());
}

```

Lets move along the code. You've learned what is a merkle tree in Module 2. Here, MerkleWitness provides the path for a leaf node (Account hash in our case) to verify that an account with its current state belongs to the tree. As you see, smart contract has one state variable, which is declared by a decorator *@state*. At the moment, smart contracts are able to store 8 state fields. As you see, smart contract is initialized with an initial commitment, which the variable is obtained from the development environment (Remember - the value(s) you set are not sent to chain directly, but used in compilation of the smart contract to a zk circuit.).

In the next step, a method is written for the smart contract. Methods are definde with @method declaration and should be async. guessPreimage method compares the commitment value on the contract with the hased value of your guess. The variable 'target' is here put explicitly since this is an example file, of course. 

Also, don't get confused by line `let commitment= this.commitment.get()` by thinking that this method 'gets' value of the commitment from the onchain. As we stated before, smart contracts gets compiled to zk circuits and data is provided by user/developer. Hence, the class Leaderboard can keep the 'commitment value' from the environment, but it does not get any data from the chain.

Also, in the line `initialCommitment = Tree.getRoot()`, you see initialCommitment is set as initial commitment of the LeaderBoard, which is the root of the Merkle Tree with some of the leaf nodes set with hashed values of accounts of users.

After Leaderboard contract is initialized and deployed, you have a zkApp with an Public key and verification key. This verification key is supposed to be kept private; otherwise some malicious parties can use it and deploy a malicious contract with the same verification key and public key. Of course, as you've seen in the [Permissions](https://docs.minaprotocol.com/zkapps/writing-a-zkapp/feature-overview/permissions#types-of-permissions) part, you can set permissions to impossible() to be sure that verification key will not be changed.

Since every zkApp is some account type, it can hold funds, as done in the `  AccountUpdate.fundNewAccount(feePayer).send({ to: contractAccount, amount: initialBalance, });` part. AccountUpdate class enables you to update the account if you are permitted to do so. 
Of course, changes/updates occurs in states as users interact with the contract. This changes are done via transactions, which are simply generating correct proofs for state transitions on the chain, as stated before.

makeGuess function in the following parts, take the user account, index of the tree where user is wanted to change/interact and witness (which include path for verification) of the user's leaf. If the number guessed is correct, user gets a point and state of its account changes. Since this account state is a leaf of MerkleTree, root of the tree changes.

As you see, for verification, you need pretty less data: if you have the current root state of the tree, you can verify the data you want to. 


**Exercise**: See the escrow file in the examples/zkapp/escrow folder. Try to write a basic mechanism for depositing and withdrawing. Also, you can add some time locks for withdrawing, like not being able to withdraw any tokens before 2030!
Feel free to play with other zkapp files as well. 
