import { Bool, UInt32, UInt64 } from 'o1js';
export class ElectionPreconditions {
    static get default() {
        return new ElectionPreconditions(UInt32.zero, UInt32.MAXINT(), Bool(false));
    }
    constructor(startElection, endElection, enforce) {
        this.startElection = startElection;
        this.endElection = endElection;
        this.enforce = enforce;
    }
}
export class ParticipantPreconditions {
    static get default() {
        return new ParticipantPreconditions(UInt64.zero, UInt64.MAXINT());
    }
    constructor(minMina, maxMina) {
        this.minMina = minMina;
        this.maxMina = maxMina;
    }
}
//# sourceMappingURL=preconditions.js.map