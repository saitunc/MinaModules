import { Member } from './member.js';
import { OffchainStorage } from './off-chain-storage.js';
import { Voting_ } from './voting.js';
import { PrivateKey } from 'o1js';
/**
 * Updates off-chain storage when registering a member or candidate
 * @param {bigint} i index of memberStore or candidatesStore
 * @param {Member} m member to register
 * @param {OffchainStorage<Member>} store  off-chain store which should be used when registering a new member
 * @param {any} Local  local blockchain instance in use
 */
export declare function registerMember(i: bigint, m: Member, store: OffchainStorage<Member>, Local: any): Member;
/**
 * Updates off-chain storage after voting
 * @param {bigint} i                            index of candidateStore and votesStore
 * @param {OffchainStorage<Member>} votesStore  votes off-chain storage
 * @param {OffchainStorage<Member>} votesStore  candidates off-chain storage
 */
export declare function vote(i: bigint, votesStore: OffchainStorage<Member>, candidateStore: OffchainStorage<Member>): Member;
/**
 * Prints the voting results of an election
 */
export declare function getResults(voting: Voting_, votesStore: OffchainStorage<Member>): Record<string, number>;
/**
 * Checks if a transaction is valid.
 * If it is expected to fail, an expected error message needs to be provided
 * @boolean expectedToBeValid - true if the transaction is expected to pass without error
 */
export declare function assertValidTx(expectToBeValid: boolean, cb: () => Promise<void>, signers: PrivateKey | [PrivateKey, ...PrivateKey[]], msg?: string): Promise<void>;
