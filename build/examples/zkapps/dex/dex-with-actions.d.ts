/**
 * This DEX implementation differs from ./dex.ts in two ways:
 * - More minimal & realistic; stuff designed only for testing protocol features was removed
 * - Uses an async pattern with actions that lets users claim funds later and reduces account updates
 */
import { AccountUpdateForest, Field, Provable, PublicKey, SmartContract, State, TokenContract, UInt64 } from 'o1js';
export { Dex, DexTokenHolder, addresses, getTokenBalances, keys, tokenIds };
declare const RedeemAction_base: (new (value: {
    address: PublicKey;
    dl: UInt64;
}) => {
    address: PublicKey;
    dl: UInt64;
}) & {
    _isStruct: true;
} & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
    address: PublicKey;
    dl: UInt64;
}, {
    address: {
        x: bigint;
        isOdd: boolean;
    };
    dl: bigint;
}>, "fromFields"> & {
    fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
        address: PublicKey;
        dl: UInt64;
    };
} & {
    fromValue: (value: {
        address: PublicKey | {
            x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
            isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
        };
        dl: bigint | UInt64;
    }) => {
        address: PublicKey;
        dl: UInt64;
    };
    toInput: (x: {
        address: PublicKey;
        dl: UInt64;
    }) => {
        fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        address: PublicKey;
        dl: UInt64;
    }) => {
        address: string;
        dl: string;
    };
    fromJSON: (x: {
        address: string;
        dl: string;
    }) => {
        address: PublicKey;
        dl: UInt64;
    };
    empty: () => {
        address: PublicKey;
        dl: UInt64;
    };
};
declare class RedeemAction extends RedeemAction_base {
}
declare class Dex extends TokenContract {
    tokenX: PublicKey;
    tokenY: PublicKey;
    approveBase(forest: AccountUpdateForest): Promise<void>;
    /**
     * state that keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
     *
     * total supply is initially zero; it increases when supplying liquidity and decreases when redeeming it
     */
    totalSupply: State<UInt64>;
    /**
     * redeeming liquidity is a 2-step process leveraging actions, to get past the account update limit
     */
    reducer: {
        dispatch(action: RedeemAction): void;
        reduce<State>(actions: import("o1js").MerkleList<import("o1js").MerkleList<RedeemAction>>, stateType: Provable<State>, reduce: (state: State, action: RedeemAction) => State, initial: State, options?: {
            maxUpdatesWithActions?: number | undefined;
            maxActionsPerUpdate?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): State;
        forEach(actions: import("o1js").MerkleList<import("o1js").MerkleList<RedeemAction>>, reduce: (action: RedeemAction) => void, options?: {
            maxUpdatesWithActions?: number | undefined;
            maxActionsPerUpdate?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): void;
        getActions({ fromActionState, endActionState, }?: {
            fromActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
        } | undefined): import("o1js").MerkleList<import("o1js").MerkleList<RedeemAction>>;
        fetchActions({ fromActionState, endActionState, }?: {
            fromActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/provable/field.js").Field | undefined;
        } | undefined): Promise<RedeemAction[][]>;
    };
    events: {
        'supply-liquidity': (new (value: {
            address: PublicKey;
            dx: UInt64;
            dy: UInt64;
        }) => {
            address: PublicKey;
            dx: UInt64;
            dy: UInt64;
        }) & {
            _isStruct: true;
        } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            address: PublicKey;
            dx: UInt64;
            dy: UInt64;
        }, {
            address: {
                x: bigint;
                isOdd: boolean;
            };
            dx: bigint;
            dy: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            };
        } & {
            fromValue: (value: {
                address: PublicKey | {
                    x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                    isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                };
                dx: bigint | UInt64;
                dy: bigint | UInt64;
            }) => {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            };
            toInput: (x: {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            }) => {
                fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            }) => {
                address: string;
                dx: string;
                dy: string;
            };
            fromJSON: (x: {
                address: string;
                dx: string;
                dy: string;
            }) => {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            };
            empty: () => {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            };
        };
        'redeem-liquidity': (new (value: {
            address: PublicKey;
            dl: UInt64;
        }) => {
            address: PublicKey;
            dl: UInt64;
        }) & {
            _isStruct: true;
        } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            address: PublicKey;
            dl: UInt64;
        }, {
            address: {
                x: bigint;
                isOdd: boolean;
            };
            dl: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                address: PublicKey;
                dl: UInt64;
            };
        } & {
            fromValue: (value: {
                address: PublicKey | {
                    x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                    isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                };
                dl: bigint | UInt64;
            }) => {
                address: PublicKey;
                dl: UInt64;
            };
            toInput: (x: {
                address: PublicKey;
                dl: UInt64;
            }) => {
                fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                address: PublicKey;
                dl: UInt64;
            }) => {
                address: string;
                dl: string;
            };
            fromJSON: (x: {
                address: string;
                dl: string;
            }) => {
                address: PublicKey;
                dl: UInt64;
            };
            empty: () => {
                address: PublicKey;
                dl: UInt64;
            };
        };
    };
    get typedEvents(): {
        emit<Key extends "supply-liquidity" | "redeem-liquidity">(key: Key, event: import("o1js/dist/node/bindings/lib/provable-generic.js").InferProvable<{
            'supply-liquidity': (new (value: {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            }) => {
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            }) & {
                _isStruct: true;
            } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
                address: PublicKey;
                dx: UInt64;
                dy: UInt64;
            }, {
                address: {
                    x: bigint;
                    isOdd: boolean;
                };
                dx: bigint;
                dy: bigint;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                };
            } & {
                fromValue: (value: {
                    address: PublicKey | {
                        x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                        isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                    };
                    dx: bigint | UInt64;
                    dy: bigint | UInt64;
                }) => {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                };
                toInput: (x: {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
                };
                toJSON: (x: {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                }) => {
                    address: string;
                    dx: string;
                    dy: string;
                };
                fromJSON: (x: {
                    address: string;
                    dx: string;
                    dy: string;
                }) => {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                };
                empty: () => {
                    address: PublicKey;
                    dx: UInt64;
                    dy: UInt64;
                };
            };
            'redeem-liquidity': (new (value: {
                address: PublicKey;
                dl: UInt64;
            }) => {
                address: PublicKey;
                dl: UInt64;
            }) & {
                _isStruct: true;
            } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
                address: PublicKey;
                dl: UInt64;
            }, {
                address: {
                    x: bigint;
                    isOdd: boolean;
                };
                dl: bigint;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                    address: PublicKey;
                    dl: UInt64;
                };
            } & {
                fromValue: (value: {
                    address: PublicKey | {
                        x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                        isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                    };
                    dl: bigint | UInt64;
                }) => {
                    address: PublicKey;
                    dl: UInt64;
                };
                toInput: (x: {
                    address: PublicKey;
                    dl: UInt64;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
                };
                toJSON: (x: {
                    address: PublicKey;
                    dl: UInt64;
                }) => {
                    address: string;
                    dl: string;
                };
                fromJSON: (x: {
                    address: string;
                    dl: string;
                }) => {
                    address: PublicKey;
                    dl: UInt64;
                };
                empty: () => {
                    address: PublicKey;
                    dl: UInt64;
                };
            };
        }[Key], import("o1js/dist/node/lib/provable/field.js").Field>): void;
    };
    /**
     * Initialization. _All_ permissions are set to impossible except the explicitly required permissions.
     */
    init(): void;
    createAccount(): Promise<void>;
    /**
     * Mint liquidity tokens in exchange for X and Y tokens
     * @param dx input amount of X tokens
     * @param dy input amount of Y tokens
     * @return output amount of lqXY tokens
     *
     * This function fails if the X and Y token amounts don't match the current X/Y ratio in the pool.
     * This can also be used if the pool is empty. In that case, there is no check on X/Y;
     * instead, the input X and Y amounts determine the initial ratio.
     */
    supplyLiquidityBase(dx: UInt64, dy: UInt64): Promise<UInt64>;
    /**
     * Mint liquidity tokens in exchange for X and Y tokens
     * @param dx input amount of X tokens
     * @return output amount of lqXY tokens
     *
     * This uses supplyLiquidityBase as the circuit, but for convenience,
     * the input amount of Y tokens is calculated automatically from the X tokens.
     * Fails if the liquidity pool is empty, so can't be used for the first deposit.
     */
    supplyLiquidity(dx: UInt64): Promise<UInt64>;
    /**
     * Burn liquidity tokens to get back X and Y tokens
     * @param dl input amount of lqXY token
     *
     * The transaction needs to be signed by the user's private key.
     *
     * NOTE: this does not give back tokens in return for liquidity right away.
     * to get back the tokens, you have to call {@link DexTokenHolder}.redeemFinalize()
     * on both token holder contracts, after `redeemInitialize()` has been accepted into a block.
     *
     * @emits RedeemAction - action on the Dex account that will make the token holder
     * contracts pay you tokens when reducing the action.
     */
    redeemInitialize(dl: UInt64): Promise<void>;
    /**
     * Helper for `DexTokenHolder.redeemFinalize()` which adds preconditions on
     * the current action state and token supply
     */
    assertActionsAndSupply(actionState: Field, totalSupply: UInt64): Promise<void>;
    /**
     * Swap X tokens for Y tokens
     * @param dx input amount of X tokens
     * @return output amount Y tokens
     *
     * The transaction needs to be signed by the user's private key.
     *
     * Note: this is not a `@method`, since it doesn't do anything beyond
     * the called methods which requires proof authorization.
     */
    swapX(dx: UInt64): Promise<UInt64>;
    /**
     * Swap Y tokens for X tokens
     * @param dy input amount of Y tokens
     * @return output amount Y tokens
     *
     * The transaction needs to be signed by the user's private key.
     *
     * Note: this is not a `@method`, since it doesn't do anything beyond
     * the called methods which requires proof authorization.
     */
    swapY(dy: UInt64): Promise<UInt64>;
}
declare class DexTokenHolder extends SmartContract {
    redeemActionState: State<import("o1js/dist/node/lib/provable/field.js").Field>;
    static redeemActionBatchSize: number;
    events: {
        swap: (new (value: {
            address: PublicKey;
            dx: UInt64;
        }) => {
            address: PublicKey;
            dx: UInt64;
        }) & {
            _isStruct: true;
        } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
            address: PublicKey;
            dx: UInt64;
        }, {
            address: {
                x: bigint;
                isOdd: boolean;
            };
            dx: bigint;
        }>, "fromFields"> & {
            fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                address: PublicKey;
                dx: UInt64;
            };
        } & {
            fromValue: (value: {
                address: PublicKey | {
                    x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                    isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                };
                dx: bigint | UInt64;
            }) => {
                address: PublicKey;
                dx: UInt64;
            };
            toInput: (x: {
                address: PublicKey;
                dx: UInt64;
            }) => {
                fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
            };
            toJSON: (x: {
                address: PublicKey;
                dx: UInt64;
            }) => {
                address: string;
                dx: string;
            };
            fromJSON: (x: {
                address: string;
                dx: string;
            }) => {
                address: PublicKey;
                dx: UInt64;
            };
            empty: () => {
                address: PublicKey;
                dx: UInt64;
            };
        };
    };
    get typedEvents(): {
        emit<Key extends "swap">(key: Key, event: import("o1js/dist/node/bindings/lib/provable-generic.js").InferProvable<{
            swap: (new (value: {
                address: PublicKey;
                dx: UInt64;
            }) => {
                address: PublicKey;
                dx: UInt64;
            }) & {
                _isStruct: true;
            } & Omit<import("o1js/dist/node/lib/provable/types/provable-intf.js").Provable<{
                address: PublicKey;
                dx: UInt64;
            }, {
                address: {
                    x: bigint;
                    isOdd: boolean;
                };
                dx: bigint;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field.js").Field[]) => {
                    address: PublicKey;
                    dx: UInt64;
                };
            } & {
                fromValue: (value: {
                    address: PublicKey | {
                        x: bigint | import("o1js/dist/node/lib/provable/field.js").Field;
                        isOdd: boolean | import("o1js/dist/node/lib/provable/bool.js").Bool;
                    };
                    dx: bigint | UInt64;
                }) => {
                    address: PublicKey;
                    dx: UInt64;
                };
                toInput: (x: {
                    address: PublicKey;
                    dx: UInt64;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field.js").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field.js").Field, number][] | undefined;
                };
                toJSON: (x: {
                    address: PublicKey;
                    dx: UInt64;
                }) => {
                    address: string;
                    dx: string;
                };
                fromJSON: (x: {
                    address: string;
                    dx: string;
                }) => {
                    address: PublicKey;
                    dx: UInt64;
                };
                empty: () => {
                    address: PublicKey;
                    dx: UInt64;
                };
            };
        }[Key], import("o1js/dist/node/lib/provable/field.js").Field>): void;
    };
    init(): void;
    redeemLiquidityFinalize(): Promise<void>;
    swap(user: PublicKey, otherTokenAmount: UInt64, otherTokenAddress: PublicKey): Promise<UInt64>;
}
declare let keys: Record<"tokenX" | "tokenY" | "dex" | "user", import("o1js").PrivateKey>, addresses: Record<"tokenX" | "tokenY" | "dex" | "user", PublicKey>;
declare let tokenIds: {
    X: import("o1js/dist/node/lib/provable/field.js").Field;
    Y: import("o1js/dist/node/lib/provable/field.js").Field;
    lqXY: import("o1js/dist/node/lib/provable/field.js").Field;
};
/**
 * Helper to get the various token balances for checks in tests
 */
declare function getTokenBalances(): {
    user: {
        MINA: bigint;
        X: bigint;
        Y: bigint;
        lqXY: bigint;
    };
    dex: {
        X: bigint;
        Y: bigint;
        lqXYSupply: bigint;
    };
};
