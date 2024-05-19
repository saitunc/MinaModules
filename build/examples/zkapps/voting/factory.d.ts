/**
 * Produces a set of three contracts, Voting, Voter Membership and Candidate Membership SCs.
 * Requires a set of preconditions.
 */
import { PrivateKey } from 'o1js';
import { Membership_ } from './membership.js';
import { ElectionPreconditions, ParticipantPreconditions } from './preconditions.js';
import { Voting_ } from './voting.js';
export { VotingAppParams };
type VotingAppParams = {
    candidatePreconditions: ParticipantPreconditions;
    voterPreconditions: ParticipantPreconditions;
    electionPreconditions: ElectionPreconditions;
    voterKey: PrivateKey;
    candidateKey: PrivateKey;
    votingKey: PrivateKey;
    doProofs: boolean;
};
/**
 * ! This is the only workaround that I found works with how our contracts compiled
 * ! Maybe we can figure out a more elegant factory pattern for our integration tests
 * This function takes a set of preconditions and produces a set of contract instances.
 * @param params {@link VotingAppParams}
 * @returns
 */
export declare function VotingApp(params?: VotingAppParams): Promise<{
    voterContract: Membership_;
    candidateContract: Membership_;
    voting: Voting_;
}>;
