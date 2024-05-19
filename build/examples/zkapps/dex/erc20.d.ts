import { ProvablePure, CircuitString, DeployArgs, Field, AccountUpdate, PublicKey, UInt64, TokenContract, AccountUpdateForest } from 'o1js';
export { Erc20Like, TrivialCoin };
/**
 * ERC-20-like token standard.
 * https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
 *
 * Differences to ERC-20:
 * - No approvals / allowance, because zkApps don't need them and they are a security liability.
 * - `transfer()` and `transferFrom()` are collapsed into a single `transfer()` method which takes
 *    both the sender and the receiver as arguments.
 * - `transfer()` and `balanceOf()` can also take an account update as an argument.
 *   This form is needed for zkApp token accounts, where the account update has to come from a method
 *   (in order to get proof authorization), and can't be created by the token contract itself.
 * - `transfer()` doesn't return a boolean, because in the zkApp protocol,
 *   a transaction succeeds or fails in its entirety, and there is no need to handle partial failures.
 * - All method signatures are async to support async circuits / fetching data from the chain.
 */
type Erc20Like = {
    name?: () => Promise<CircuitString>;
    symbol?: () => Promise<CircuitString>;
    decimals?: () => Promise<Field>;
    totalSupply(): Promise<UInt64>;
    balanceOf(owner: PublicKey | AccountUpdate): Promise<UInt64>;
    transfer(from: PublicKey | AccountUpdate, to: PublicKey | AccountUpdate, value: UInt64): Promise<void>;
    events: {
        Transfer: ProvablePure<{
            from: PublicKey;
            to: PublicKey;
            value: UInt64;
        }>;
    };
};
/**
 * A simple ERC20 token
 *
 * Tokenomics:
 * The supply is constant and the entire supply is initially sent to an account controlled by the zkApp developer
 * After that, tokens can be sent around with authorization from their owner, but new ones can't be minted.
 *
 * Functionality:
 * Just enough to be swapped by the DEX contract, and be secure
 */
declare class TrivialCoin extends TokenContract implements Erc20Like {
    SUPPLY: UInt64;
    deploy(args?: DeployArgs): Promise<void>;
    init(): Promise<void>;
    name(): Promise<CircuitString>;
    symbol(): Promise<CircuitString>;
    decimals(): Promise<import("o1js/dist/node/lib/provable/field").Field>;
    totalSupply(): Promise<UInt64>;
    balanceOf(owner: PublicKey | AccountUpdate): Promise<UInt64>;
    events: {
        Transfer: (new (value: {
            from: PublicKey;
            to: PublicKey;
            value: UInt64;
        }) => {
            from: PublicKey;
            to: PublicKey;
            value: UInt64;
        }) & {
            _isStruct: true;
        } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
            from: PublicKey;
            to: PublicKey;
            value: UInt64;
        }, {
            from: {
                x: bigint;
                isOdd: boolean;
            };
            to: {
                x: bigint;
                isOdd: boolean;
            };
            value: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            };
        } & {
            fromValue: (value: {
                from: PublicKey | {
                    x: bigint | import("o1js/dist/node/lib/provable/field").Field;
                    isOdd: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
                };
                to: PublicKey | {
                    x: bigint | import("o1js/dist/node/lib/provable/field").Field;
                    isOdd: boolean | import("o1js/dist/node/lib/provable/bool").Bool;
                };
                value: bigint | UInt64;
            }) => {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            };
            toInput: (x: {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            }) => {
                fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
                packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
            };
            toJSON: (x: {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            }) => {
                from: string;
                to: string;
                value: string;
            };
            fromJSON: (x: {
                from: string;
                to: string;
                value: string;
            }) => {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            };
            empty: () => {
                from: PublicKey;
                to: PublicKey;
                value: UInt64;
            };
        };
    };
    approveBase(forest: AccountUpdateForest): Promise<void>;
}
