import { UInt32 } from 'o1js';
declare const ElectionPreconditions_base: (new (value: {
    startElection: UInt32;
    endElection: UInt32;
}) => {
    startElection: UInt32;
    endElection: UInt32;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    startElection: UInt32;
    endElection: UInt32;
}, {
    startElection: bigint;
    endElection: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        startElection: UInt32;
        endElection: UInt32;
    };
} & {
    fromValue: (value: {
        startElection: bigint | UInt32;
        endElection: bigint | UInt32;
    }) => {
        startElection: UInt32;
        endElection: UInt32;
    };
    toInput: (x: {
        startElection: UInt32;
        endElection: UInt32;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        startElection: UInt32;
        endElection: UInt32;
    }) => {
        startElection: string;
        endElection: string;
    };
    fromJSON: (x: {
        startElection: string;
        endElection: string;
    }) => {
        startElection: UInt32;
        endElection: UInt32;
    };
    empty: () => {
        startElection: UInt32;
        endElection: UInt32;
    };
};
export default class ElectionPreconditions extends ElectionPreconditions_base {
}
export {};
