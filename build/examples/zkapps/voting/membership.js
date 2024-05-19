var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, Permissions, Bool, PublicKey, Reducer, provablePure, AccountUpdate, Provable, } from 'o1js';
import { Member } from './member.js';
import { ParticipantPreconditions } from './preconditions.js';
let participantPreconditions = ParticipantPreconditions.default;
Provable;
/**
 * Returns a new contract instance that based on a set of preconditions.
 * @param params {@link MembershipParams}
 */
export async function Membership(params) {
    participantPreconditions = params.participantPreconditions;
    let contract = new Membership_(params.contractAddress);
    params.doProofs = true;
    if (params.doProofs) {
        await Membership_.compile();
    }
    return contract;
}
/**
 * The Membership contract keeps track of a set of members.
 * The contract can either be of type Voter or Candidate.
 */
export class Membership_ extends SmartContract {
    constructor() {
        super(...arguments);
        /**
         * Root of the merkle tree that stores all committed members.
         */
        this.committedMembers = State();
        /**
         * Accumulator of all emitted members.
         */
        this.accumulatedMembers = State();
        this.reducer = Reducer({ actionType: Member });
        this.events = {
            newMemberState: provablePure({
                accumulatedMembersRoot: Field,
                committedMembersRoot: Field,
            }),
        };
    }
    async deploy() {
        await super.deploy();
        this.account.permissions.set({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
            editActionState: Permissions.proofOrSignature(),
            setPermissions: Permissions.proofOrSignature(),
            setVerificationKey: Permissions.VerificationKey.proofOrSignature(),
            incrementNonce: Permissions.proofOrSignature(),
        });
    }
    /**
     * Method used to add a new member.
     * Dispatches a new member sequence event.
     * @param member
     */
    async addEntry(member) {
        // Emit event that indicates adding this item
        // Preconditions: Restrict who can vote or who can be a candidate
        // since we need to keep this contract "generic", we always assert within a range
        // even tho voters cant have a maximum balance, only candidates
        // but for a voter we simply use UInt64.MAXINT() as the maximum
        let accountUpdate = AccountUpdate.create(member.publicKey);
        accountUpdate.account.balance.requireEquals(accountUpdate.account.balance.get());
        let balance = accountUpdate.account.balance.get();
        balance.assertGreaterThanOrEqual(participantPreconditions.minMina, 'Balance not high enough!');
        balance.assertLessThanOrEqual(participantPreconditions.maxMina, 'Balance too high!');
        let accumulatedMembers = this.accumulatedMembers.get();
        this.accumulatedMembers.requireEquals(accumulatedMembers);
        // checking if the member already exists within the accumulator
        let exists = this.reducer.reduce(this.reducer.getActions({
            fromActionState: accumulatedMembers,
        }), Bool, (state, action) => {
            return Provable.equal(Member, action, member).or(state);
        }, 
        // initial state
        Bool(false));
        /*
        we cant really branch the control flow - we will always have to emit an event no matter what,
        so we emit an empty event if the member already exists
        it the member doesn't exist, emit the "real" member
        */
        let toEmit = Provable.if(exists, Member.empty(), member);
        this.reducer.dispatch(toEmit);
        return exists;
    }
    /**
     * Method used to check whether a member exists within the committed storage.
     * @param accountId
     * @returns true if member exists
     */
    async isMember(member) {
        // Verify membership (voter or candidate) with the accountId via merkle tree committed to by the sequence events and returns a boolean
        // Preconditions: Item exists in committed storage
        let committedMembers = this.committedMembers.get();
        this.committedMembers.requireEquals(committedMembers);
        return member.witness
            .calculateRoot(member.getHash())
            .equals(committedMembers);
    }
    /**
     * Method used to commit to the accumulated list of members.
     */
    async publish() {
        // Commit to the items accumulated so far. This is a periodic update
        let accumulatedMembers = this.accumulatedMembers.get();
        this.accumulatedMembers.requireEquals(accumulatedMembers);
        let committedMembers = this.committedMembers.get();
        this.committedMembers.requireEquals(committedMembers);
        let pendingActions = this.reducer.getActions({
            fromActionState: accumulatedMembers,
        });
        let newCommittedMembers = this.reducer.reduce(pendingActions, Field, (state, action) => {
            // because we inserted empty members, we need to check if a member is empty or "real"
            let isRealMember = Provable.if(action.publicKey.equals(PublicKey.empty()), Bool(false), Bool(true));
            // if the member is real and not empty, we calculate and return the new merkle root
            // otherwise, we simply return the unmodified state - this is our way of branching
            return Provable.if(isRealMember, action.witness.calculateRoot(action.getHash()), state);
        }, 
        // initial state
        committedMembers, { maxUpdatesWithActions: 2 });
        let newAccumulatedMembers = pendingActions.hash;
        this.committedMembers.set(newCommittedMembers);
        this.accumulatedMembers.set(newAccumulatedMembers);
        this.emitEvent('newMemberState', {
            committedMembersRoot: newCommittedMembers,
            accumulatedMembersRoot: newAccumulatedMembers,
        });
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Membership_.prototype, "committedMembers", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Membership_.prototype, "accumulatedMembers", void 0);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Member]),
    __metadata("design:returntype", Promise)
], Membership_.prototype, "addEntry", null);
__decorate([
    method.returns(Bool),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Member]),
    __metadata("design:returntype", Promise)
], Membership_.prototype, "isMember", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Membership_.prototype, "publish", null);
//# sourceMappingURL=membership.js.map