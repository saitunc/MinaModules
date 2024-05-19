import { Field, PrivateKey } from 'o1js';
import { VotingAppParams } from './factory.js';
import { Membership_ } from './membership.js';
import { Voting_ } from './voting.js';
/**
 * Function used to deploy a set of contracts for a given set of preconditions
 * @param feePayer the private key used to pay the fees
 * @param contracts A set of contracts to deploy
 * @param params A set of preconditions and parameters
 * @param voterRoot the initial root of the voter store
 * @param candidateRoot the initial root of the voter store
 * @param votesRoot the initial root of the votes store
 */
export declare function deployContracts(contracts: {
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
}, params: VotingAppParams, voterRoot: Field, candidateRoot: Field, votesRoot: Field, proofsEnabled?: boolean): Promise<{
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
    Local: any;
    feePayer: PrivateKey;
}>;
/**
 * Function used to deploy a set of **invalid** membership contracts for a given set of preconditions
 * @param feePayer the private key used to pay the fees
 * @param contracts A set of contracts to deploy
 * @param params A set of preconditions and parameters
 * @param voterRoot the initial root of the voter store
 * @param candidateRoot the initial root of the voter store
 * @param votesRoot the initial root of the votes store
 */
export declare function deployInvalidContracts(contracts: {
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
}, params: VotingAppParams, voterRoot: Field, candidateRoot: Field, votesRoot: Field): Promise<{
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
    Local: any;
    feePayer: PrivateKey;
}>;
