# Template for Mina education modules

> Feel free to add/edit resources
Also, it is obvious that some o1js materials is needed. From the beginnings to the advanced structures (Fields to ZkPrograms etc.) should be covered and added.


### Todo of Modules

- [X] Module 0: Blockchain basics
  - [X] What is Blockchain, Smart Contracts
  - [X] Technical explanation of Blockchain with Bitcoin example
- [X] Module 1: Mathematics for cryptography
  - [X] Finite Fields and other heavenly tool
  - [X] Elliptic Curves and their applications
- [X] Module 2: Other Primitives for non- Web3/ZK people 
  - [X] Asymmetric/Symmetric/DLP based cryptography
  - [X] Hashing / Merkle Tree
  - [X] Digital Signatures
- [X] Module 3: Introduction to Zk Snarks
  - [X] What are zkSNARKs
- [X] Module 4: What is Mina and O1js Basics
  - [X] What is / not Mina Blockchain is.
  - [X] Advanced/Low-level o1js api 
  - [ ] Exercises  


If you want to see example codes, you can check examples folder of o1js repo. Also, you can clone this repository and play with the example codes in the examples folder. They are taken from the o1js repo and will be kept updated. Besides that, there will be more increasing number of exercises/examples in this repo. After cloning the repo, do the following:

```bash
npm install
```

You can compile typescript codes in examples via: 
```bash
npx tsc
```
Compiled Javascript codes are in build folder. To execute files:

```bash
node build/examples/file_you_want.js

```
