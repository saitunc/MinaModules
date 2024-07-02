# Module 3 - zkSNARKs

## Update 
This module is optional, you should skip to the Module 4 and if you wish to understand the zkSNARKS and develop low level infrastructure tools/apps or want to do some improvements to the mina and o1js itself, then you can study this part.


## Zero-Knowledge and SNARKS
Of course you might say that you are not into such deep levels of the ZK. We accept that those are so mathematical, such that o1js handles with all of them. If you are not familiar with ZK, studying these concepts just for understanding the underlying Zero-Knowledge concept (especially ZK Circuit) will be enough. (meaning that, you are not supposed to build your own zk Framework, just understand why and how o1js uses zk.)

This module is where zero-knowledge proofs and Snarks are going to be explained. You are not supposed to know Zk proofs deeply, but understanding some key terms like *witness* *Public Input* and *Private Input* is essential while you develop zkApps. First, see what [ZK proofs](https://www.youtube.com/watch?v=uchjTIlPzFo&list=PLS01nW3Rtgor_yJmQsGBZAg5XM4TSGpPs) are in a mathematical sense, since it is essential for your further development understanding the underlying mathematics

For a simple understanding of what Zero-Knowledge proofs are, please see these resourceS:
- [An Introduction to Mathematical Cryptography, Chapter 8.3](https://books.google.com.ar/books/about/An_Introduction_to_Mathematical_Cryptogr.html?id=BHuTQgAACAAJ&source=kp_book_description&redir_esc=y)
- [Introduction to ZK Proofs](https://www.youtube.com/watch?v=uchjTIlPzFo&list=PLS01nW3Rtgor_yJmQsGBZAg5XM4TSGpPs)

## SNARKs

First, start by what is a circuit? By circuits, we mean **Arithmetic Circuits**:
- [Electric Coin article](https://electriccoin.co/blog/snark-explain5/)
- [What is a SNARK by Dan Boneh](https://www.youtube.com/watch?v=h-94UhJLeck)
- [What is a zkSNARK by Dan Boneh](https://www.youtube.com/watch?v=gcKCW7CNu_M)
- [A Gentle Introduction to Snarks](https://www.di.ens.fr/~nitulesc/files/Survey-SNARKs.pdf) This one is a little mathematical, but checking the SNARK parts might give you a hint about it.


## Additional Study

In the above, we have drawn very heavily from blog posts written by Vitalik Buterin, Electric Coin, and Maurizio Binello. However, these are only some of the many pathways towards understanding zkSNARK construction.

Since it is always helpful to take a look at the same problem from different angles, we recommend you visit the following resources:

- [**Why and How zk-SNARK Works**](https://medium.com/@imolfar/why-and-how-zk-snark-works-1-introduction-the-medium-of-a-proof-d946e931160) (highly recommended) - Originally [**a paper**](https://arxiv.org/abs/1906.07221) by Maksym Petkus, it dives into the specifics of how a zkSNARK is constructed, it has been converted to a series of blog posts for easy consumption.
- [**ZK Whiteboard Sessions**](https://zkhack.dev/whiteboard/) - ZkHack explains various topics in a nice and clear way. Use those resources in case you want to learn deeper.
- [MoonMath Manual Chapter 8](https://leastauthority.com/community-matters/moonmath-manual/) 




