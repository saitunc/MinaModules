import { SmartContract, State, PublicKey, Provable } from 'o1js';
import { Member } from './member.js';
import { ParticipantPreconditions } from './preconditions.js';
type MembershipParams = {
    participantPreconditions: ParticipantPreconditions;
    contractAddress: PublicKey;
    doProofs: boolean;
};
/**
 * Returns a new contract instance that based on a set of preconditions.
 * @param params {@link MembershipParams}
 */
export declare function Membership(params: MembershipParams): Promise<Membership_>;
/**
 * The Membership contract keeps track of a set of members.
 * The contract can either be of type Voter or Candidate.
 */
export declare class Membership_ extends SmartContract {
    /**
     * Root of the merkle tree that stores all committed members.
     */
    committedMembers: State<import("o1js/dist/node/lib/provable/field.js").Field>;
    /**
     * Accumulator of all emitted members.
     */
    accumulatedMembers: State<import("o1js/dist/node/lib/provable/field.js").Field>;
    reducer: {
        dispatch(action: Member): void;
        reduce<State>(actions: import("o1js").MerkleList<import("o1js").MerkleList<Member>>, stateType: Provable<State>, reduce: (state: State, action: Member) => State, initial: State, options?: {
            maxUpdatesWithActions?: number | undefined;
            maxActionsPerUpdate?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): State;
        forEach(actions: import("o1js").MerkleList<import("o1js").MerkleList<Member>>, reduce: (action: Member) => void, options?: {
            maxUpdatesWithActions?: number | undefined;
            maxActionsPerUpdate?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): void;
        getActions({ fromActionState, endActionState, }?: {
            fromActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
        } | undefined): import("o1js").MerkleList<import("o1js").MerkleList<Member>>;
        fetchActions({ fromActionState, endActionState, }?: {
            fromActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
        } | undefined): Promise<Member[][]>;
    };
    events: {
        newMemberState: Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
        }, {
            accumulatedMembersRoot: string;
            committedMembersRoot: string;
        }>, "fromFields"> & {
            fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
                committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            };
        } & {
            toInput: (x: {
                accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
                committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            }) => {
                fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
                committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            }) => any;
            fromJSON: (x: any) => {
                accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
                committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            };
            empty: () => {
                accumulatedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
                committedMembersRoot: import("o1js/dist/node/lib/provable/field.js").Field;
            };
        };
    };
    deploy(): Promise<void>;
    /**
     * Method used to add a new member.
     * Dispatches a new member sequence event.
     * @param member
     */
    addEntry(member: Member): Promise<import("o1js/dist/node/lib/provable/bool.js").Bool>;
    /**
     * Method used to check whether a member exists within the committed storage.
     * @param accountId
     * @returns true if member exists
     */
    isMember(member: Member): Promise<import("o1js/dist/node/lib/provable/bool.js").Bool>;
    /**
     * Method used to commit to the accumulated list of members.
     */
    publish(): Promise<void>;
}
export {};
