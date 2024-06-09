# Module 2 - Zero-knowledge Proofs With other primitives

Before getting in ZK proofs, lets see some more primitives. Encryption is essential and historically the starting point of cryptography, so lets see what is encryption is about.

## Symmetric vs. Asymmetric Encryption

Encryption is a technique used to encode data, making it readable only to those who possess the correct decryption key. There are two main types of encryption - symmetric and asymmetric, each serving different purposes and with their own strengths and weaknesses.

**Symmetric Encryption** - Also known as single-key encryption, this method involves using the same key for both encryption and decryption. The most widely used symmetric encryption algorithm is Advanced Encryption Standard (AES).

**Asymmetric Encryption** - Also known as public-key encryption, this method uses a pair of keys: one for encryption and another for decryption. The RSA algorithm is one of the best known public-key algorithms.

- [Prime Numbers & RSA Encryption Algorithm - Computerphile](https://www.youtube.com/watch?v=JD72Ry60eP4)

## DLP-based Public-Key Cryptography

1. **Discrete Log Problem (DLP):** This is a cornerstone problem in public-key cryptography and underlies many key exchange and encryption algorithms. Understanding DLP provides a foundation for the remaining topics.
    - [The Discrete Logarithm Problem - Khan Academy](https://youtu.be/SL7J8hPKEWY)
    - [Public key cryptography using discrete logarithms](https://www.di-mgt.com.au/public-key-crypto-discrete-logs-0.html)

2. **Diffie-Hellman Key Exchange:** This is one of the earliest practical implementations of key exchange protocols based on the Discrete Log Problem. It's critical to understand how secure communication can be established over insecure channels.

    This protocol is significant as it enables secure communication over insecure channels by allowing two parties to generate a shared secret key, which can then be used for encryption and decryption of messages
    - [Secret Key Exchange (Diffie-Hellman) - Computerphile ](https://www.youtube.com/watch?v=NmM9HA2MQGI)
    - [Diffie Hellman -the Mathematics bit- Computerphile](https://youtu.be/Yjrfm_oRO0w)
    - [Implementation of Diffie-Hellman Algorithm](https://www.geeksforgeeks.org/implementation-diffie-hellman-algorithm/)


For a deeper mathematical understanding, you can check [Hoffstein's Book Chapters 2, 6-6.5](https://books.google.com.ar/books/about/An_Introduction_to_Mathematical_Cryptogr.html?id=BHuTQgAACAAJ&source=kp_book_description&redir_esc=y)
## Hash Functions

A hash function takes an input and returns a fixed-size string of bytes. **SHA-256** and **Poseidon** are popular cryptographic hash functions in our context, with Poseidon specifically designed for arithmetic-friendly operations, benefiting certain applications in blockchains.

The primary characteristics of a good hash function are [preimage resistance](https://en.wikipedia.org/wiki/Preimage_attack), second preimage resistance, and [collision resistance](https://en.wikipedia.org/wiki/Collision_resistance), ensuring data security and integrity. In blockchain technology, hash functions create an unalterable, unique representation of each block's content, contributing to the immutability and transparency of the system.

Explore these resources to further your understanding:
- [What Is SHA-256 Algorithm & How It Works](https://www.ssldragon.com/blog/sha-256-algorithm/)
- [How is SHA-256 used in blockchain, and why?](https://www.educative.io/answers/how-is-sha-256-used-in-blockchain-and-why)
- [Hash Function by Serious Cryptography Chapter 6](https://theswissbay.ch/pdf/Books/Computer%20science/Cryptography/SeriousCryptography.pdf)


## Merkle Trees

Merkle Trees are very essential on Mina Protocol, most of the people use that beautiful tool for their smart contracts and zkApps. We ask for a little bit more patience about all this theoretical parts - soon you will be using this Merkle Trees too! 

- [How Merkle Trees Enable the Decentralized Web! ](https://www.youtube.com/watch?v=3giNelTfeAk)
- [Merkle Tree by Mina Protocol](https://docs.minaprotocol.com/zkapps/o1js/merkle-tree)


## Digital Signatures

Digital signatures ensure the integrity and authenticity of digital messages or documents. By providing a means to verify the origin and confirm that the content has not been altered, digital signatures play a pivotal role in maintaining trust in digital communications.

In Public Key Cryptography, anyone can encrypt their message with receiver's public key, which can be decrypted by the reciever's priate key only. Besides that, signer can generate a signature for a message using their private key, which can be used to validate that message is from some specific public key (sender, in this case).

In Public Key Cryptography, anyone can encrypt their message with the receiver's public key, and only the receiver can decrypt the message with their private key. In digital signatures, on the other hand, if a signer generates a signature for a message using their private key, anyone can validate it using the signer's public key. Therefore, the message of the signature is made public, which distinguishes it from cryptographic commitments.

- [What are Digital Signatures? - Computerphile](https://www.youtube.com/watch?v=s22eJ1eVLTU)
- [Digital Signature Algorithm (DSA) - Cryptography ](https://www.youtube.com/watch?v=iS1nK4G6EtA)

Besides that, Mina protocol uses Schnorr signatures, which are known for simplicity and efficiency: 
- [Schnorr Digital Signature](https://www.youtube.com/watch?v=r9hJiDrtukI)

