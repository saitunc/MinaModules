import { Field, SmartContract, State, DeployArgs } from 'o1js';
export declare class DummyContract extends SmartContract {
    sum: State<import("o1js/dist/node/lib/provable/field").Field>;
    deploy(args: DeployArgs): Promise<void>;
    /**
     * Method used to add two variables together.
     */
    add(x: Field, y: Field): Promise<void>;
}
