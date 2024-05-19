import { AccountUpdate, PrivateKey, PublicKey, SmartContract, State, UInt32, UInt64, TokenContract as BaseTokenContract, AccountUpdateForest } from 'o1js';
export { TokenContract, addresses, createDex, keys, randomAccounts, tokenIds };
declare function createDex({ lockedLiquiditySlots, }?: {
    lockedLiquiditySlots?: number;
}): {
    Dex: {
        new (address: PublicKey, tokenId?: import("o1js/dist/node/lib/provable/field").Field | undefined): {
            tokenX: PublicKey;
            tokenY: PublicKey;
            approveBase(forest: AccountUpdateForest): Promise<void>;
            /**
             * state which keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
             *
             * total supply is zero initially; it increases when supplying liquidity and decreases when redeeming it
             */
            totalSupply: State<UInt64>;
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
             * @return output amount of X and Y tokens, as a tuple [outputX, outputY]
             *
             * The transaction needs to be signed by the user's private key.
             *
             * Note: this is not a `@method` because there's nothing to prove which isn't already proven
             * by the called methods
             */
            redeemLiquidity(dl: UInt64): Promise<UInt64[]>;
            /**
             * Swap X tokens for Y tokens
             * @param dx input amount of X tokens
             * @return output amount Y tokens
             *
             * The transaction needs to be signed by the user's private key.
             */
            swapX(dx: UInt64): Promise<UInt64>;
            /**
             * Swap Y tokens for X tokens
             * @param dy input amount of Y tokens
             * @return output amount Y tokens
             *
             * The transaction needs to be signed by the user's private key.
             */
            swapY(dy: UInt64): Promise<UInt64>;
            /**
             * helper method to approve burning of user's liquidity.
             * this just burns user tokens, so there is no incentive to call this directly.
             * instead, the dex token holders call this and in turn pay back tokens.
             *
             * @param user caller address
             * @param dl input amount of lq tokens
             * @returns total supply of lq tokens _before_ burning dl, so that caller can calculate how much dx / dx to returns
             *
             * The transaction needs to be signed by the user's private key.
             */
            burnLiquidity(user: PublicKey, dl: UInt64): Promise<UInt64>;
            deploy(args?: import("o1js").DeployArgs): Promise<void>;
            deriveTokenId(): import("o1js/dist/node/lib/provable/field").Field;
            readonly internal: {
                mint({ address, amount, }: {
                    address: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
                burn({ address, amount, }: {
                    address: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
                send({ from, to, amount, }: {
                    from: PublicKey | SmartContract | AccountUpdate;
                    to: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
            };
            forEachUpdate(updates: AccountUpdateForest, callback: (update: AccountUpdate, usesToken: import("o1js/dist/node/lib/provable/bool").Bool) => void): void;
            checkZeroBalanceChange(updates: AccountUpdateForest): void;
            approveAccountUpdate(accountUpdate: AccountUpdate | import("o1js").AccountUpdateTree): Promise<void>;
            approveAccountUpdates(accountUpdates: (AccountUpdate | import("o1js").AccountUpdateTree)[]): Promise<void>;
            transfer(from: PublicKey | AccountUpdate, to: PublicKey | AccountUpdate, amount: number | bigint | UInt64): Promise<void>;
            "__#3@#private": any;
            address: PublicKey;
            tokenId: import("o1js/dist/node/lib/provable/field").Field;
            init(): void;
            requireSignature(): void;
            skipAuthorization(): void;
            readonly self: AccountUpdate;
            newSelf(methodName?: string | undefined): AccountUpdate;
            sender: {
                self: SmartContract;
                getUnconstrained(): PublicKey;
                getAndRequireSignature(): PublicKey;
            };
            readonly account: import("o1js/dist/node/lib/mina/precondition").Account;
            readonly network: import("o1js/dist/node/lib/mina/precondition").Network;
            readonly currentSlot: import("o1js/dist/node/lib/mina/precondition").CurrentSlot;
            approve(update: AccountUpdate | AccountUpdateForest | import("o1js").AccountUpdateTree): void;
            send(args: {
                to: PublicKey | SmartContract | AccountUpdate;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            readonly balance: {
                addInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
                subInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
            };
            events: {
                [key: string]: import("o1js").FlexibleProvablePure<any>;
            };
            emitEvent<K extends string | number>(type: K, event: any): void;
            fetchEvents(start?: UInt32 | undefined, end?: UInt32 | undefined): Promise<{
                type: string;
                event: {
                    data: import("o1js").ProvablePure<any>;
                    transactionInfo: {
                        transactionHash: string;
                        transactionStatus: string;
                        transactionMemo: string;
                    };
                };
                blockHeight: UInt32;
                blockHash: string;
                parentBlockHash: string;
                globalSlot: UInt32;
                chainStatus: string;
            }[]>;
        };
        _methods?: import("o1js/dist/node/lib/proof-system/zkprogram").MethodInterface[] | undefined;
        _methodMetadata?: Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }> | undefined;
        _provers?: import("o1js/dist/node/snarky").Pickles.Prover[] | undefined;
        _maxProofsVerified?: 0 | 2 | 1 | undefined;
        _verificationKey?: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | undefined;
        Proof(): {
            new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
                proof: unknown;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                maxProofsVerified: 0 | 2 | 1;
            }): {
                verify(): void;
                verifyIf(condition: import("o1js/dist/node/lib/provable/bool").Bool): void;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                proof: unknown;
                maxProofsVerified: 0 | 2 | 1;
                shouldVerify: import("o1js/dist/node/lib/provable/bool").Bool;
                toJSON(): import("o1js").JsonProof;
            };
            publicInputType: Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
                accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                calls: import("o1js/dist/node/lib/provable/field").Field;
            }, {
                accountUpdate: string;
                calls: string;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            } & {
                toInput: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
                };
                toJSON: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => any;
                fromJSON: (x: any) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
                empty: () => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            };
            publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<undefined, undefined, null>;
            tag: () => typeof SmartContract;
            fromJSON<S extends (new (...args: any) => import("o1js").Proof<unknown, unknown>) & {
                prototype: import("o1js").Proof<any, any>;
                fromJSON: typeof import("o1js").Proof.fromJSON;
                dummy: typeof import("o1js").Proof.dummy;
                publicInputType: import("o1js").FlexibleProvablePure<any>;
                publicOutputType: import("o1js").FlexibleProvablePure<any>;
                tag: () => {
                    name: string;
                };
            } & {
                prototype: import("o1js").Proof<unknown, unknown>;
            }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/provable/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/provable/field").Field>>>;
            dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<import("o1js").Proof<Input, OutPut>>;
        };
        compile({ cache, forceRecompile, }?: {
            cache?: import("o1js").Cache | undefined;
            forceRecompile?: boolean | undefined;
        } | undefined): Promise<{
            verificationKey: {
                data: string;
                hash: import("o1js/dist/node/lib/provable/field").Field;
            };
            provers: import("o1js/dist/node/snarky").Pickles.Prover[];
            verify: (statement: import("o1js/dist/node/snarky").Pickles.Statement<import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst>, proof: unknown) => Promise<boolean>;
        }>;
        digest(): Promise<string>;
        runOutsideCircuit(run: () => void): void;
        analyzeMethods({ printSummary }?: {
            printSummary?: boolean | undefined;
        } | undefined): Promise<Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }>>;
    };
    DexTokenHolder: {
        new (address: PublicKey, tokenId?: import("o1js/dist/node/lib/provable/field").Field | undefined): {
            redeemLiquidityPartial(user: PublicKey, dl: UInt64): Promise<UInt64[]>;
            redeemLiquidity(user: PublicKey, dl: UInt64, otherTokenAddress: PublicKey): Promise<UInt64[]>;
            swap(user: PublicKey, otherTokenAmount: UInt64, otherTokenAddress: PublicKey): Promise<UInt64>;
            "__#3@#private": any;
            address: PublicKey;
            tokenId: import("o1js/dist/node/lib/provable/field").Field;
            deploy({ verificationKey, }?: {
                verificationKey?: {
                    data: string;
                    hash: string | import("o1js/dist/node/lib/provable/field").Field;
                } | undefined;
            } | undefined): Promise<void>;
            init(): void;
            requireSignature(): void;
            skipAuthorization(): void;
            readonly self: AccountUpdate;
            newSelf(methodName?: string | undefined): AccountUpdate;
            sender: {
                self: SmartContract;
                getUnconstrained(): PublicKey;
                getAndRequireSignature(): PublicKey;
            };
            readonly account: import("o1js/dist/node/lib/mina/precondition").Account;
            readonly network: import("o1js/dist/node/lib/mina/precondition").Network;
            readonly currentSlot: import("o1js/dist/node/lib/mina/precondition").CurrentSlot;
            approve(update: AccountUpdate | AccountUpdateForest | import("o1js").AccountUpdateTree): void;
            send(args: {
                to: PublicKey | SmartContract | AccountUpdate;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            readonly balance: {
                addInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
                subInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
            };
            events: {
                [key: string]: import("o1js").FlexibleProvablePure<any>;
            };
            emitEvent<K_1 extends string | number>(type: K_1, event: any): void;
            fetchEvents(start?: UInt32 | undefined, end?: UInt32 | undefined): Promise<{
                type: string;
                event: {
                    data: import("o1js").ProvablePure<any>;
                    transactionInfo: {
                        transactionHash: string;
                        transactionStatus: string;
                        transactionMemo: string;
                    };
                };
                blockHeight: UInt32;
                blockHash: string;
                parentBlockHash: string;
                globalSlot: UInt32;
                chainStatus: string;
            }[]>;
        };
        _methods?: import("o1js/dist/node/lib/proof-system/zkprogram").MethodInterface[] | undefined;
        _methodMetadata?: Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }> | undefined;
        _provers?: import("o1js/dist/node/snarky").Pickles.Prover[] | undefined;
        _maxProofsVerified?: 0 | 2 | 1 | undefined;
        _verificationKey?: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | undefined;
        Proof(): {
            new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
                proof: unknown;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                maxProofsVerified: 0 | 2 | 1;
            }): {
                verify(): void;
                verifyIf(condition: import("o1js/dist/node/lib/provable/bool").Bool): void;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                proof: unknown;
                maxProofsVerified: 0 | 2 | 1;
                shouldVerify: import("o1js/dist/node/lib/provable/bool").Bool;
                toJSON(): import("o1js").JsonProof;
            };
            publicInputType: Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
                accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                calls: import("o1js/dist/node/lib/provable/field").Field;
            }, {
                accountUpdate: string;
                calls: string;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            } & {
                toInput: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
                };
                toJSON: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => any;
                fromJSON: (x: any) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
                empty: () => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            };
            publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<undefined, undefined, null>;
            tag: () => typeof SmartContract;
            fromJSON<S extends (new (...args: any) => import("o1js").Proof<unknown, unknown>) & {
                prototype: import("o1js").Proof<any, any>;
                fromJSON: typeof import("o1js").Proof.fromJSON;
                dummy: typeof import("o1js").Proof.dummy;
                publicInputType: import("o1js").FlexibleProvablePure<any>;
                publicOutputType: import("o1js").FlexibleProvablePure<any>;
                tag: () => {
                    name: string;
                };
            } & {
                prototype: import("o1js").Proof<unknown, unknown>;
            }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/provable/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/provable/field").Field>>>;
            dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<import("o1js").Proof<Input, OutPut>>;
        };
        compile({ cache, forceRecompile, }?: {
            cache?: import("o1js").Cache | undefined;
            forceRecompile?: boolean | undefined;
        } | undefined): Promise<{
            verificationKey: {
                data: string;
                hash: import("o1js/dist/node/lib/provable/field").Field;
            };
            provers: import("o1js/dist/node/snarky").Pickles.Prover[];
            verify: (statement: import("o1js/dist/node/snarky").Pickles.Statement<import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst>, proof: unknown) => Promise<boolean>;
        }>;
        digest(): Promise<string>;
        runOutsideCircuit(run: () => void): void;
        analyzeMethods({ printSummary }?: {
            printSummary?: boolean | undefined;
        } | undefined): Promise<Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }>>;
    };
    ModifiedDexTokenHolder: {
        new (address: PublicKey, tokenId?: import("o1js/dist/node/lib/provable/field").Field | undefined): {
            /**
             * This swap method has a slightly changed formula
             */
            swap(user: PublicKey, otherTokenAmount: UInt64, otherTokenAddress: PublicKey): Promise<UInt64>;
            redeemLiquidityPartial(user: PublicKey, dl: UInt64): Promise<UInt64[]>;
            redeemLiquidity(user: PublicKey, dl: UInt64, otherTokenAddress: PublicKey): Promise<UInt64[]>;
            "__#3@#private": any;
            address: PublicKey;
            tokenId: import("o1js/dist/node/lib/provable/field").Field;
            deploy({ verificationKey, }?: {
                verificationKey?: {
                    data: string;
                    hash: string | import("o1js/dist/node/lib/provable/field").Field;
                } | undefined;
            } | undefined): Promise<void>;
            init(): void;
            requireSignature(): void;
            skipAuthorization(): void;
            readonly self: AccountUpdate;
            newSelf(methodName?: string | undefined): AccountUpdate;
            sender: {
                self: SmartContract;
                getUnconstrained(): PublicKey;
                getAndRequireSignature(): PublicKey;
            };
            readonly account: import("o1js/dist/node/lib/mina/precondition").Account;
            readonly network: import("o1js/dist/node/lib/mina/precondition").Network;
            readonly currentSlot: import("o1js/dist/node/lib/mina/precondition").CurrentSlot;
            approve(update: AccountUpdate | AccountUpdateForest | import("o1js").AccountUpdateTree): void;
            send(args: {
                to: PublicKey | SmartContract | AccountUpdate;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            readonly balance: {
                addInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
                subInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
            };
            events: {
                [key: string]: import("o1js").FlexibleProvablePure<any>;
            };
            emitEvent<K_2 extends string | number>(type: K_2, event: any): void;
            fetchEvents(start?: UInt32 | undefined, end?: UInt32 | undefined): Promise<{
                type: string;
                event: {
                    data: import("o1js").ProvablePure<any>;
                    transactionInfo: {
                        transactionHash: string;
                        transactionStatus: string;
                        transactionMemo: string;
                    };
                };
                blockHeight: UInt32;
                blockHash: string;
                parentBlockHash: string;
                globalSlot: UInt32;
                chainStatus: string;
            }[]>;
        };
        _methods?: import("o1js/dist/node/lib/proof-system/zkprogram").MethodInterface[] | undefined;
        _methodMetadata?: Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }> | undefined;
        _provers?: import("o1js/dist/node/snarky").Pickles.Prover[] | undefined;
        _maxProofsVerified?: 0 | 2 | 1 | undefined;
        _verificationKey?: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | undefined;
        Proof(): {
            new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
                proof: unknown;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                maxProofsVerified: 0 | 2 | 1;
            }): {
                verify(): void;
                verifyIf(condition: import("o1js/dist/node/lib/provable/bool").Bool): void;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                proof: unknown;
                maxProofsVerified: 0 | 2 | 1;
                shouldVerify: import("o1js/dist/node/lib/provable/bool").Bool;
                toJSON(): import("o1js").JsonProof;
            };
            publicInputType: Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
                accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                calls: import("o1js/dist/node/lib/provable/field").Field;
            }, {
                accountUpdate: string;
                calls: string;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            } & {
                toInput: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
                };
                toJSON: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => any;
                fromJSON: (x: any) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
                empty: () => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            };
            publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<undefined, undefined, null>;
            tag: () => typeof SmartContract;
            fromJSON<S extends (new (...args: any) => import("o1js").Proof<unknown, unknown>) & {
                prototype: import("o1js").Proof<any, any>;
                fromJSON: typeof import("o1js").Proof.fromJSON;
                dummy: typeof import("o1js").Proof.dummy;
                publicInputType: import("o1js").FlexibleProvablePure<any>;
                publicOutputType: import("o1js").FlexibleProvablePure<any>;
                tag: () => {
                    name: string;
                };
            } & {
                prototype: import("o1js").Proof<unknown, unknown>;
            }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/provable/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/provable/field").Field>>>;
            dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<import("o1js").Proof<Input, OutPut>>;
        };
        compile({ cache, forceRecompile, }?: {
            cache?: import("o1js").Cache | undefined;
            forceRecompile?: boolean | undefined;
        } | undefined): Promise<{
            verificationKey: {
                data: string;
                hash: import("o1js/dist/node/lib/provable/field").Field;
            };
            provers: import("o1js/dist/node/snarky").Pickles.Prover[];
            verify: (statement: import("o1js/dist/node/snarky").Pickles.Statement<import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst>, proof: unknown) => Promise<boolean>;
        }>;
        digest(): Promise<string>;
        runOutsideCircuit(run: () => void): void;
        analyzeMethods({ printSummary }?: {
            printSummary?: boolean | undefined;
        } | undefined): Promise<Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }>>;
    };
    ModifiedDex: {
        new (address: PublicKey, tokenId?: import("o1js/dist/node/lib/provable/field").Field | undefined): {
            deploy(): Promise<void>;
            swapX(dx: UInt64): Promise<UInt64>;
            tokenX: PublicKey;
            tokenY: PublicKey;
            approveBase(forest: AccountUpdateForest): Promise<void>;
            /**
             * state which keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
             *
             * total supply is zero initially; it increases when supplying liquidity and decreases when redeeming it
             */
            totalSupply: State<UInt64>;
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
             * @return output amount of X and Y tokens, as a tuple [outputX, outputY]
             *
             * The transaction needs to be signed by the user's private key.
             *
             * Note: this is not a `@method` because there's nothing to prove which isn't already proven
             * by the called methods
             */
            redeemLiquidity(dl: UInt64): Promise<UInt64[]>;
            /**
             * Swap Y tokens for X tokens
             * @param dy input amount of Y tokens
             * @return output amount Y tokens
             *
             * The transaction needs to be signed by the user's private key.
             */
            swapY(dy: UInt64): Promise<UInt64>;
            /**
             * helper method to approve burning of user's liquidity.
             * this just burns user tokens, so there is no incentive to call this directly.
             * instead, the dex token holders call this and in turn pay back tokens.
             *
             * @param user caller address
             * @param dl input amount of lq tokens
             * @returns total supply of lq tokens _before_ burning dl, so that caller can calculate how much dx / dx to returns
             *
             * The transaction needs to be signed by the user's private key.
             */
            burnLiquidity(user: PublicKey, dl: UInt64): Promise<UInt64>;
            deriveTokenId(): import("o1js/dist/node/lib/provable/field").Field;
            readonly internal: {
                mint({ address, amount, }: {
                    address: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
                burn({ address, amount, }: {
                    address: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
                send({ from, to, amount, }: {
                    from: PublicKey | SmartContract | AccountUpdate;
                    to: PublicKey | SmartContract | AccountUpdate;
                    amount: number | bigint | UInt64;
                }): AccountUpdate;
            };
            forEachUpdate(updates: AccountUpdateForest, callback: (update: AccountUpdate, usesToken: import("o1js/dist/node/lib/provable/bool").Bool) => void): void;
            checkZeroBalanceChange(updates: AccountUpdateForest): void;
            approveAccountUpdate(accountUpdate: AccountUpdate | import("o1js").AccountUpdateTree): Promise<void>;
            approveAccountUpdates(accountUpdates: (AccountUpdate | import("o1js").AccountUpdateTree)[]): Promise<void>;
            transfer(from: PublicKey | AccountUpdate, to: PublicKey | AccountUpdate, amount: number | bigint | UInt64): Promise<void>;
            "__#3@#private": any;
            address: PublicKey;
            tokenId: import("o1js/dist/node/lib/provable/field").Field;
            init(): void;
            requireSignature(): void;
            skipAuthorization(): void;
            readonly self: AccountUpdate;
            newSelf(methodName?: string | undefined): AccountUpdate;
            sender: {
                self: SmartContract;
                getUnconstrained(): PublicKey;
                getAndRequireSignature(): PublicKey;
            };
            readonly account: import("o1js/dist/node/lib/mina/precondition").Account;
            readonly network: import("o1js/dist/node/lib/mina/precondition").Network;
            readonly currentSlot: import("o1js/dist/node/lib/mina/precondition").CurrentSlot;
            approve(update: AccountUpdate | AccountUpdateForest | import("o1js").AccountUpdateTree): void;
            send(args: {
                to: PublicKey | SmartContract | AccountUpdate;
                amount: number | bigint | UInt64;
            }): AccountUpdate;
            readonly balance: {
                addInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
                subInPlace(x: string | number | bigint | import("o1js").Int64 | UInt32 | UInt64): void;
            };
            events: {
                [key: string]: import("o1js").FlexibleProvablePure<any>;
            };
            emitEvent<K_3 extends string | number>(type: K_3, event: any): void;
            fetchEvents(start?: UInt32 | undefined, end?: UInt32 | undefined): Promise<{
                type: string;
                event: {
                    data: import("o1js").ProvablePure<any>;
                    transactionInfo: {
                        transactionHash: string;
                        transactionStatus: string;
                        transactionMemo: string;
                    };
                };
                blockHeight: UInt32;
                blockHash: string;
                parentBlockHash: string;
                globalSlot: UInt32;
                chainStatus: string;
            }[]>;
        };
        _methods?: import("o1js/dist/node/lib/proof-system/zkprogram").MethodInterface[] | undefined;
        _methodMetadata?: Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }> | undefined;
        _provers?: import("o1js/dist/node/snarky").Pickles.Prover[] | undefined;
        _maxProofsVerified?: 0 | 2 | 1 | undefined;
        _verificationKey?: {
            data: string;
            hash: import("o1js/dist/node/lib/provable/field").Field;
        } | undefined;
        Proof(): {
            new ({ proof, publicInput, publicOutput, maxProofsVerified, }: {
                proof: unknown;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                maxProofsVerified: 0 | 2 | 1;
            }): {
                verify(): void;
                verifyIf(condition: import("o1js/dist/node/lib/provable/bool").Bool): void;
                publicInput: import("o1js").ZkappPublicInput;
                publicOutput: undefined;
                proof: unknown;
                maxProofsVerified: 0 | 2 | 1;
                shouldVerify: import("o1js/dist/node/lib/provable/bool").Bool;
                toJSON(): import("o1js").JsonProof;
            };
            publicInputType: Omit<import("o1js/dist/node/lib/provable/types/provable-intf").Provable<{
                accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                calls: import("o1js/dist/node/lib/provable/field").Field;
            }, {
                accountUpdate: string;
                calls: string;
            }>, "fromFields"> & {
                fromFields: (fields: import("o1js/dist/node/lib/provable/field").Field[]) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            } & {
                toInput: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => {
                    fields?: import("o1js/dist/node/lib/provable/field").Field[] | undefined;
                    packed?: [import("o1js/dist/node/lib/provable/field").Field, number][] | undefined;
                };
                toJSON: (x: {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                }) => any;
                fromJSON: (x: any) => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
                empty: () => {
                    accountUpdate: import("o1js/dist/node/lib/provable/field").Field;
                    calls: import("o1js/dist/node/lib/provable/field").Field;
                };
            };
            publicOutputType: import("o1js/dist/node/lib/provable/types/struct").ProvablePureExtended<undefined, undefined, null>;
            tag: () => typeof SmartContract;
            fromJSON<S extends (new (...args: any) => import("o1js").Proof<unknown, unknown>) & {
                prototype: import("o1js").Proof<any, any>;
                fromJSON: typeof import("o1js").Proof.fromJSON;
                dummy: typeof import("o1js").Proof.dummy;
                publicInputType: import("o1js").FlexibleProvablePure<any>;
                publicOutputType: import("o1js").FlexibleProvablePure<any>;
                tag: () => {
                    name: string;
                };
            } & {
                prototype: import("o1js").Proof<unknown, unknown>;
            }>(this: S, { maxProofsVerified, proof: proofString, publicInput: publicInputJson, publicOutput: publicOutputJson, }: import("o1js").JsonProof): Promise<import("o1js").Proof<import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicInputType"], import("o1js/dist/node/lib/provable/field").Field>, import("o1js/dist/node/bindings/lib/provable-generic").InferProvable<S["publicOutputType"], import("o1js/dist/node/lib/provable/field").Field>>>;
            dummy<Input, OutPut>(publicInput: Input, publicOutput: OutPut, maxProofsVerified: 0 | 2 | 1, domainLog2?: number | undefined): Promise<import("o1js").Proof<Input, OutPut>>;
        };
        compile({ cache, forceRecompile, }?: {
            cache?: import("o1js").Cache | undefined;
            forceRecompile?: boolean | undefined;
        } | undefined): Promise<{
            verificationKey: {
                data: string;
                hash: import("o1js/dist/node/lib/provable/field").Field;
            };
            provers: import("o1js/dist/node/snarky").Pickles.Prover[];
            verify: (statement: import("o1js/dist/node/snarky").Pickles.Statement<import("o1js/dist/node/lib/provable/core/fieldvar").FieldConst>, proof: unknown) => Promise<boolean>;
        }>;
        digest(): Promise<string>;
        runOutsideCircuit(run: () => void): void;
        analyzeMethods({ printSummary }?: {
            printSummary?: boolean | undefined;
        } | undefined): Promise<Record<string, {
            actions: number;
            rows: number;
            digest: string;
            gates: import("o1js/dist/node/snarky").Gate[];
        }>>;
    };
    getTokenBalances: () => {
        user: {
            MINA: bigint;
            X: bigint;
            Y: bigint;
            lqXY: bigint;
        };
        user2: {
            MINA: bigint;
            X: bigint;
            Y: bigint;
            lqXY: bigint;
        };
        dex: {
            X: bigint;
            Y: bigint;
        };
        tokenContract: {
            X: bigint;
            Y: bigint;
        };
        total: {
            lqXY: bigint;
        };
    };
};
/**
 * Simple token with API flexible enough to handle all our use cases
 */
declare class TokenContract extends BaseTokenContract {
    init(): Promise<void>;
    /**
     * DUMB STUFF FOR TESTING (delete in real app)
     *
     * mint additional tokens to some user, so we can overflow token balances
     */
    init2(): Promise<void>;
    approveBase(forest: AccountUpdateForest): Promise<void>;
}
declare let keys: Record<"tokenX" | "tokenY" | "dex" | "user" | "user2" | "user3", PrivateKey>, addresses: Record<"tokenX" | "tokenY" | "dex" | "user" | "user2" | "user3", PublicKey>;
declare let tokenIds: {
    X: import("o1js/dist/node/lib/provable/field").Field;
    Y: import("o1js/dist/node/lib/provable/field").Field;
    lqXY: import("o1js/dist/node/lib/provable/field").Field;
};
/**
 * Predefined accounts keys, labeled by the input strings. Useful for testing/debugging with consistent keys.
 */
declare function randomAccounts<K extends string>(createNewAccounts: boolean, ...names: [K, ...K[]]): {
    keys: Record<K, PrivateKey>;
    addresses: Record<K, PublicKey>;
};
