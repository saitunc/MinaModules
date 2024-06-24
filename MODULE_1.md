# Module 1 - Intro to Math of ZK

Welcome to module 1. If you haven't checked module 0 and not you're familiar to blockchain, we suggest you to take a look at module 0. If you already know what a blockchain is, you are ready to dive in to mathematical foundations of blockchain. 

This module aims to make you familiar with the mathematics used in zero-knowledge proofs - actually, in cryptography and blockchain in general.


Let’s get started!

## Mathematics of Cryptography

Before diving to o1js and Mina protocol, it is necessary to see the underlying mathematical foundations of blockchains and Zero-Knowledge Proofs. Here are some resources that you can learn those by. Videos are shot by LambdaClass, which we suggest you to check the playlist if you are interested. Also, their [blog](https://blog.lambdaclass.com/), which includes Zk, snarks and others can be enlightening: 

- [Finite Fields](https://www.youtube.com/watch?v=MAhmV_omOwA&list=PLFX2cij7c2PynTNWDBzmzaD6ij170ILbQ&index=9)
- [Cyclic Subgroup](https://www.youtube.com/watch?v=UIhhs38IAGM&list=PLFX2cij7c2PynTNWDBzmzaD6ij170ILbQ&index=4) - OPTIONAL -
- [An introduction to Mathematical Cryptography Chapter 1](https://books.google.com.ar/books/about/An_Introduction_to_Mathematical_Cryptogr.html?id=BHuTQgAACAAJ&source=kp_book_description&redir_esc=y)
- [Mina Book Chapters 1-6 ](https://o1-labs.github.io/proof-systems/introduction.html)
    * [Fast Fourier Transform explained visually](https://www.youtube.com/watch?v=h7apO7q16V0) - OPTIONAL -
- [Moonmath Manual for ZK Chapters 4, Finite Fields  ](https://github.com/LeastAuthority/moonmath-manual/releases/latest/download/main-moonmath.pdf) - supplementary -

## Exercises
[Introduction](https://www.minaplayground.com/tutorial/01-introduction/01-o1js) part may be useful for you to see how is field elements are defined and used in o1js. 

Moreover, you can take a look at [o1js](https://github.com/o1-labs/o1js) repository on github to see how primitives are defined. Since it is written in typescript & javascript, it is easy to read and test the code.


// Open for comments: i don't see necessity for elliptic curve part for anyone that is not going to develop on core level.
// Besides that, i am not sure about adding exercises for types like Circuit or adding Foreign Field, even though they are nice to haves. Maybe, they can be added to advanced exercises, hence people who are willing to write infra level applications like verifier/provers.
## Elliptic Curves

First part is over huh? Now it is time to see some more underlying mathematical concepts: Elliptic Curves. Cryptography of blockchains heavily based on Elliptic Curve Cryptography:

- [Elliptic Curves](https://www.youtube.com/watch?v=F3zzNa42-tQ)
- [Programming Bitcoin Chapters 2-3 ](https://digilib.stekom.ac.id/assets/dokumen/ebook/feb_d82be9cf1cb52e2b294a82275318a5c8235444eb_1654093256.pdf)
- [Serious Cryptography Chapter 11-12](https://theswisessbay.ch/pdf/Books/Computer%20science/Cryptography/SeriousCryptography.pdf)

