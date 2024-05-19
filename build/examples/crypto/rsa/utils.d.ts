export { sha256Bigint, generateRsaParams, rsaSign, randomPrime };
/**
 * Generates an RSA signature for the given message using the private key and modulus.
 * @param message - The message to be signed.
 * @param privateKey - The private exponent used for signing.
 * @param modulus - The modulus used for signing.
 * @returns The RSA signature of the message.
 */
declare function rsaSign(message: bigint, privateKey: bigint, modulus: bigint): bigint;
/**
 * Generates a SHA-256 digest of the input message and returns the hash as a native bigint.
 * @param  message - The input message to be hashed.
 * @returns The SHA-256 hash of the input message as a native bigint.
 */
declare function sha256Bigint(message: string): Promise<bigint>;
/**
 * Generates RSA parameters including prime numbers, public exponent, and private exponent.
 * @param bitSize - The bit size of the prime numbers used for generating the RSA parameters.
 * @returns An object containing the RSA parameters:
 * `n` (modulus), `e` (public exponent), `d` (private exponent).
 */
declare function generateRsaParams(bitSize: number): {
    n: bigint;
    e: bigint;
    d: bigint;
};
/**
 * returns a random prime of a given bit length (which is a multiple of 8)
 */
declare function randomPrime(bitLength: number): bigint;
