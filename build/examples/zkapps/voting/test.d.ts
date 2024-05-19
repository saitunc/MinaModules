import { VotingAppParams } from './factory.js';
import { Member } from './member.js';
import { Membership_ } from './membership.js';
import { OffchainStorage } from './off-chain-storage.js';
import { Voting_ } from './voting.js';
type Votes = OffchainStorage<Member>;
type Candidates = OffchainStorage<Member>;
type Voters = OffchainStorage<Member>;
/**
 * Function used to test a set of contracts and precondition
 * @param contracts A set of contracts
 * @param params A set of preconditions and parameters
 * @param storage A set of off-chain storage
 */
export declare function testSet(contracts: {
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
}, params: VotingAppParams, storage: {
    votesStore: Votes;
    candidatesStore: Candidates;
    votersStore: Voters;
}): Promise<void>;
export {};
