import { SmartContract, PublicKey } from 'o1js';
export declare class Escrow extends SmartContract {
    deposit(user: PublicKey): Promise<void>;
    withdraw(user: PublicKey): Promise<void>;
}
