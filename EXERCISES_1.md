# Exercises 1 

This file is covering the exercising materials about modules. For clarification of the exercises, you can go and check materials in Module 4.


**Exercise 1**

As you've seen in [Basic Concepts](https://docs.minaprotocol.com/zkapps/o1js/basic-concepts), Mina has all necessary mathematical tools. For example, If you want to create a Field element,(which has the Modulus and Order same as Mina Protocol), you simply do 
```typescript
let num = Field.from(3145);
console.log(Field.from(3145));
```

Besides this, 



As you saw in elliptic curves, there are some parameters of a curve to start it. General weierstrass form of a curve is y^2 = x^3 + ax + b. For defining a foreign curve in o1js, you can use the following method:

```typescript
import {
  createForeignCurve,
} from 'o1js';


const curveParameters = {
    name: "Exercise Curve",
    modulus: 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffffn, // Use the modulus of the Field class uses in o1js
    order: 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n,
    cofactor: 0x1n,
    generator: {
        x: 0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n,
        y: 0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n,
    },
    a: 0xffffffff00000001000000000000000000000000fffffffffffffffffffffffcn,

    b: 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn,

    //SECP256R1 does not have GLV Endomorphisms, so endoBase and endoScalar properties of curve parameters are omitted.
};

// Lets create the curve with createForeignCurve method.
class Secp256r1 extends createForeignCurve(curveParameters){}

// Scalar field of Secp256r1 is created.
class Scalar extends Secp256r1.Scalar{}
```




```typescript
import {
    Crypto,
    createEcdsa,
    createForeignCurve,
    Bool,
    Bytes,
  } from 'o1js';
  
  export { keccakAndEcdsa, ecdsa, Secp256k1, Ecdsa, Bytes32 };
  
  class Secp256k1 extends createForeignCurve(Crypto.CurveParams.Secp256k1) {}
  class Scalar extends Secp256k1.Scalar {}
  class Ecdsa extends createEcdsa(Secp256k1) {}
  class Bytes32 extends Bytes(32) {}
  
  const keccakAndEcdsa = ZkProgram({
    name: 'ecdsa',
    publicInput: Bytes32.provable,
    publicOutput: Bool,
  
    methods: {
      verifyEcdsa: {
        privateInputs: [Ecdsa.provable, Secp256k1.provable],
        async method(message: Bytes32, signature: Ecdsa, publicKey: Secp256k1) {
          return signature.verify(message, publicKey);
        },
      },
    },
  });
  
  const ecdsa = ZkProgram({
    name: 'ecdsa-only',
    publicInput: Scalar.provable,
    publicOutput: Bool,
  
    methods: {
      verifySignedHash: {
        privateInputs: [Ecdsa.provable, Secp256k1.provable],
        async method(message: Scalar, signature: Ecdsa, publicKey: Secp256k1) {
          return signature.verifySignedHash(message, publicKey);
        },
      },
    },
  });

const testPrivKey = Secp256k1.Scalar.random();
const testPubKey = Secp256k1.generator.scale(testPrivKey);

const testPrivKey2 = Secp256k1.Scalar.random();
const testPubKey2 = Secp256k1.generator.scale(testPrivKey2);


let message = Bytes32.fromString("Mina Brotocol");


let signature1 = Ecdsa.sign(message.toBytes(),testPrivKey.toBigInt());

let verification1 = signature1.verify(message,testPubKey);

let verification2 = signature1.verify(message,testPubKey2);


console.log("With pubkey 1:  ",verification1.toBoolean());
console.log("With pubkey 2:  ",verification2.toBoolean());

```




**Exercise 2**

Smart Contract class can be extended for anyones purposes. If you follow the [getting started](https://docs.minaprotocol.com/zkapps/writing-a-zkapp/introduction-to-zkapps/getting-started-zkapps) page, you will get a simple Add program. As you'll see,  
```typescript
import { Field, SmartContract, state, State, method } from 'o1js';

export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1));
  }

  @method async update() {
    const currentState = this.num.getAndRequireEquals();
    const newState = currentState.add(2);
    this.num.set(newState);
  }
}

```
Let's move step by step: 

- ** @state ** : This decorator is used to create a variable to be included to the on-chain state. For every smart contracs, there can be 8 state variables. In the example above, State<Field> can take Field data up to 254 bits.
- ** @method ** : Defining a method in a class that extends smart contract is done by @method decorator. Defined methods are supposed to be async.
