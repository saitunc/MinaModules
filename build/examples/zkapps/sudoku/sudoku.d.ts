import { SmartContract, State } from 'o1js';
export { Sudoku, SudokuZkApp };
declare const Sudoku_base: (new (value: {
    value: import("o1js/dist/node/lib/provable/field").Field[][];
}) => {
    value: import("o1js/dist/node/lib/provable/field").Field[][];
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
    value: import("o1js/dist/node/lib/provable/field").Field[][];
}, {
    value: bigint[][];
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    };
} & {
    fromValue: (value: {
        value: import("o1js/dist/node/lib/provable/field").Field[][] | bigint[][];
    }) => {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    };
    toInput: (x: {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
    };
    toJSON: (x: {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    }) => {
        value: string[][];
    };
    fromJSON: (x: {
        value: string[][];
    }) => {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    };
    empty: () => {
        value: import("o1js/dist/node/lib/provable/field").Field[][];
    };
};
declare class Sudoku extends Sudoku_base {
    static from(value: number[][]): Sudoku;
    hash(): import("o1js/dist/node/lib/provable/field").Field;
}
declare class SudokuZkApp extends SmartContract {
    sudokuHash: State<import("o1js/dist/node/lib/provable/field").Field>;
    isSolved: State<import("o1js/dist/node/lib/provable/bool").Bool>;
    /**
     * by making this a `@method`, we ensure that a proof is created for the state initialization.
     * alternatively (and, more efficiently), we could have used `super.init()` inside `update()` below,
     * to ensure the entire state is overwritten.
     * however, it's good to have an example which tests the CLI's ability to handle init() decorated with `@method`.
     */
    init(): Promise<void>;
    update(sudokuInstance: Sudoku): Promise<void>;
    submitSolution(sudokuInstance: Sudoku, solutionInstance: Sudoku): Promise<void>;
}
