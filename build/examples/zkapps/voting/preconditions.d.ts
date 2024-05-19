import { Bool, UInt32, UInt64 } from 'o1js';
export declare class ElectionPreconditions {
    startElection: UInt32;
    endElection: UInt32;
    enforce: Bool;
    static get default(): ElectionPreconditions;
    constructor(startElection: UInt32, endElection: UInt32, enforce: Bool);
}
export declare class ParticipantPreconditions {
    minMina: UInt64;
    maxMina: UInt64;
    static get default(): ParticipantPreconditions;
    constructor(minMina: UInt64, maxMina: UInt64);
}
