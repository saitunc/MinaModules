var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AccountUpdate, Bool, Mina, PrivateKey, Provable, PublicKey, SmartContract, State, Struct, TokenId, UInt32, UInt64, method, state, TokenContract as BaseTokenContract, AccountUpdateForest, } from 'o1js';
export { TokenContract, addresses, createDex, keys, randomAccounts, tokenIds };
class UInt64x2 extends Struct([UInt64, UInt64]) {
}
function createDex({ lockedLiquiditySlots, } = {}) {
    class Dex extends BaseTokenContract {
        constructor() {
            super(...arguments);
            // addresses of token contracts are constants
            this.tokenX = addresses.tokenX;
            this.tokenY = addresses.tokenY;
            /**
             * state which keeps track of total lqXY supply -- this is needed to calculate what to return when redeeming liquidity
             *
             * total supply is zero initially; it increases when supplying liquidity and decreases when redeeming it
             */
            this.totalSupply = State();
        }
        // Approvable API
        async approveBase(forest) {
            this.checkZeroBalanceChange(forest);
        }
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
        async supplyLiquidityBase(dx, dy) {
            let user = this.sender.getUnconstrained(); // unconstrained because transfer() requires the signature anyway
            let tokenX = new TokenContract(this.tokenX);
            let tokenY = new TokenContract(this.tokenY);
            // get balances of X and Y token
            let dexXUpdate = AccountUpdate.create(this.address, tokenX.deriveTokenId());
            let dexXBalance = dexXUpdate.account.balance.getAndRequireEquals();
            let dexYUpdate = AccountUpdate.create(this.address, tokenY.deriveTokenId());
            let dexYBalance = dexYUpdate.account.balance.getAndRequireEquals();
            // assert dy === [dx * y/x], or x === 0
            let isXZero = dexXBalance.equals(UInt64.zero);
            let xSafe = Provable.if(isXZero, UInt64.one, dexXBalance);
            let isDyCorrect = dy.equals(dx.mul(dexYBalance).div(xSafe));
            isDyCorrect.or(isXZero).assertTrue();
            await tokenX.transfer(user, dexXUpdate, dx);
            await tokenY.transfer(user, dexYUpdate, dy);
            // calculate liquidity token output simply as dl = dx + dy
            // => maintains ratio x/l, y/l
            let dl = dy.add(dx);
            let userUpdate = this.internal.mint({ address: user, amount: dl });
            if (lockedLiquiditySlots !== undefined) {
                /**
                 * exercise the "timing" (vesting) feature to lock the received liquidity tokens.
                 *
                 * THIS IS HERE FOR TESTING!
                 *
                 * In reality, the timing feature is a bit awkward to use for time-locking liquidity tokens.
                 * That's because, if there is currently a vesting schedule on an account, we can't modify it.
                 * Thus, a liquidity provider would need to wait for their current tokens to unlock before being able to
                 * supply liquidity again (or, create another account to supply liquidity from).
                 */
                let amountLocked = dl;
                userUpdate.account.timing.set({
                    initialMinimumBalance: amountLocked,
                    cliffAmount: amountLocked,
                    cliffTime: UInt32.from(lockedLiquiditySlots),
                    vestingIncrement: UInt64.zero,
                    vestingPeriod: UInt32.one,
                });
                userUpdate.requireSignature();
            }
            // update l supply
            let l = this.totalSupply.get();
            this.totalSupply.requireEquals(l);
            this.totalSupply.set(l.add(dl));
            return dl;
        }
        /**
         * Mint liquidity tokens in exchange for X and Y tokens
         * @param dx input amount of X tokens
         * @return output amount of lqXY tokens
         *
         * This uses supplyLiquidityBase as the circuit, but for convenience,
         * the input amount of Y tokens is calculated automatically from the X tokens.
         * Fails if the liquidity pool is empty, so can't be used for the first deposit.
         */
        async supplyLiquidity(dx) {
            // calculate dy outside circuit
            let x = Mina.getAccount(this.address, TokenId.derive(this.tokenX)).balance;
            let y = Mina.getAccount(this.address, TokenId.derive(this.tokenY)).balance;
            if (x.value.isConstant() && x.value.equals(0).toBoolean()) {
                throw Error('Cannot call `supplyLiquidity` when reserves are zero. Use `supplyLiquidityBase`.');
            }
            let dy = dx.mul(y).div(x);
            return await this.supplyLiquidityBase(dx, dy);
        }
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
        async redeemLiquidity(dl) {
            // call the token X holder inside a token X-approved callback
            let sender = this.sender.getUnconstrained(); // unconstrained because redeemLiquidity() requires the signature anyway
            let tokenX = new TokenContract(this.tokenX);
            let dexX = new DexTokenHolder(this.address, tokenX.deriveTokenId());
            let dxdy = await dexX.redeemLiquidity(sender, dl, this.tokenY);
            let dx = dxdy[0];
            await tokenX.transfer(dexX.self, sender, dx);
            return dxdy;
        }
        /**
         * Swap X tokens for Y tokens
         * @param dx input amount of X tokens
         * @return output amount Y tokens
         *
         * The transaction needs to be signed by the user's private key.
         */
        async swapX(dx) {
            let sender = this.sender.getUnconstrained(); // unconstrained because swap() requires the signature anyway
            let tokenY = new TokenContract(this.tokenY);
            let dexY = new DexTokenHolder(this.address, tokenY.deriveTokenId());
            let dy = await dexY.swap(sender, dx, this.tokenX);
            await tokenY.transfer(dexY.self, sender, dy);
            return dy;
        }
        /**
         * Swap Y tokens for X tokens
         * @param dy input amount of Y tokens
         * @return output amount Y tokens
         *
         * The transaction needs to be signed by the user's private key.
         */
        async swapY(dy) {
            let sender = this.sender.getUnconstrained(); // unconstrained because swap() requires the signature anyway
            let tokenX = new TokenContract(this.tokenX);
            let dexX = new DexTokenHolder(this.address, tokenX.deriveTokenId());
            let dx = await dexX.swap(sender, dy, this.tokenY);
            await tokenX.transfer(dexX.self, sender, dx);
            return dx;
        }
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
        async burnLiquidity(user, dl) {
            // this makes sure there is enough l to burn (user balance stays >= 0), so l stays >= 0, so l was >0 before
            this.internal.burn({ address: user, amount: dl });
            let l = this.totalSupply.get();
            this.totalSupply.requireEquals(l);
            this.totalSupply.set(l.sub(dl));
            return l;
        }
    }
    __decorate([
        method,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [AccountUpdateForest]),
        __metadata("design:returntype", Promise)
    ], Dex.prototype, "approveBase", null);
    __decorate([
        state(UInt64),
        __metadata("design:type", Object)
    ], Dex.prototype, "totalSupply", void 0);
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UInt64, UInt64]),
        __metadata("design:returntype", Promise)
    ], Dex.prototype, "supplyLiquidityBase", null);
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UInt64]),
        __metadata("design:returntype", Promise)
    ], Dex.prototype, "swapX", null);
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UInt64]),
        __metadata("design:returntype", Promise)
    ], Dex.prototype, "swapY", null);
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PublicKey, UInt64]),
        __metadata("design:returntype", Promise)
    ], Dex.prototype, "burnLiquidity", null);
    class ModifiedDex extends Dex {
        async deploy() {
            await super.deploy();
            // override the isNew requirement for re-deploying
            this.account.isNew.requireNothing();
        }
        async swapX(dx) {
            let sender = this.sender.getUnconstrained(); // unconstrained because swap() requires the signature anyway
            let tokenY = new TokenContract(this.tokenY);
            let dexY = new ModifiedDexTokenHolder(this.address, tokenY.deriveTokenId());
            let dy = await dexY.swap(sender, dx, this.tokenX);
            await tokenY.transfer(dexY.self, sender, dy);
            return dy;
        }
    }
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UInt64]),
        __metadata("design:returntype", Promise)
    ], ModifiedDex.prototype, "swapX", null);
    class DexTokenHolder extends SmartContract {
        // simpler circuit for redeeming liquidity -- direct trade between our token and lq token
        // it's incomplete, as it gives the user only the Y part for an lqXY token; but doesn't matter as there's no incentive to call it directly
        // see the more complicated method `redeemLiquidity` below which gives back both tokens, by calling this method,
        // for the other token, in a callback
        async redeemLiquidityPartial(user, dl) {
            // user burns dl, approved by the Dex main contract
            let dex = new Dex(addresses.dex);
            let l = await dex.burnLiquidity(user, dl);
            // in return, we give dy back
            let y = this.account.balance.get();
            this.account.balance.requireEquals(y);
            // we can safely divide by l here because the Dex contract logic wouldn't allow burnLiquidity if not l>0
            let dy = y.mul(dl).div(l);
            // just subtract the balance, user gets their part one level higher
            this.balance.subInPlace(dy);
            // be approved by the token owner parent
            this.self.body.mayUseToken = AccountUpdate.MayUseToken.ParentsOwnToken;
            // return l, dy so callers don't have to walk their child account updates to get it
            return [l, dy];
        }
        // more complicated circuit, where we trigger the Y(other)-lqXY trade in our child account updates and then add the X(our) part
        async redeemLiquidity(user, dl, otherTokenAddress) {
            // first call the Y token holder, approved by the Y token contract; this makes sure we get dl, the user's lqXY
            let tokenY = new TokenContract(otherTokenAddress);
            let dexY = new DexTokenHolder(this.address, tokenY.deriveTokenId());
            let result = await dexY.redeemLiquidityPartial(user, dl);
            let l = result[0];
            let dy = result[1];
            await tokenY.transfer(dexY.self, user, dy);
            // in return for dl, we give back dx, the X token part
            let x = this.account.balance.get();
            this.account.balance.requireEquals(x);
            let dx = x.mul(dl).div(l);
            // just subtract the balance, user gets their part one level higher
            this.balance.subInPlace(dx);
            return [dx, dy];
        }
        // this works for both directions (in our case where both tokens use the same contract)
        async swap(user, otherTokenAmount, otherTokenAddress) {
            // we're writing this as if our token === y and other token === x
            let dx = otherTokenAmount;
            let tokenX = new TokenContract(otherTokenAddress);
            // get balances
            let dexX = AccountUpdate.create(this.address, tokenX.deriveTokenId());
            let x = dexX.account.balance.getAndRequireEquals();
            let y = this.account.balance.getAndRequireEquals();
            // send x from user to us (i.e., to the same address as this but with the other token)
            await tokenX.transfer(user, dexX, dx);
            // compute and send dy
            let dy = y.mul(dx).div(x.add(dx));
            // just subtract dy balance and let adding balance be handled one level higher
            this.balance.subInPlace(dy);
            return dy;
        }
    }
    __decorate([
        method.returns(UInt64x2),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PublicKey, UInt64]),
        __metadata("design:returntype", Promise)
    ], DexTokenHolder.prototype, "redeemLiquidityPartial", null);
    __decorate([
        method.returns(UInt64x2),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PublicKey,
            UInt64,
            PublicKey]),
        __metadata("design:returntype", Promise)
    ], DexTokenHolder.prototype, "redeemLiquidity", null);
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PublicKey,
            UInt64,
            PublicKey]),
        __metadata("design:returntype", Promise)
    ], DexTokenHolder.prototype, "swap", null);
    class ModifiedDexTokenHolder extends DexTokenHolder {
        /**
         * This swap method has a slightly changed formula
         */
        async swap(user, otherTokenAmount, otherTokenAddress) {
            let dx = otherTokenAmount;
            let tokenX = new TokenContract(otherTokenAddress);
            // get balances
            let dexX = AccountUpdate.create(this.address, tokenX.deriveTokenId());
            let x = dexX.account.balance.getAndRequireEquals();
            let y = this.account.balance.get();
            this.account.balance.requireEquals(y);
            await tokenX.transfer(user, dexX, dx);
            // this formula has been changed - we just give the user an additional 15 token
            let dy = y.mul(dx).div(x.add(dx)).add(15);
            this.balance.subInPlace(dy);
            return dy;
        }
    }
    __decorate([
        method.returns(UInt64),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [PublicKey,
            UInt64,
            PublicKey]),
        __metadata("design:returntype", Promise)
    ], ModifiedDexTokenHolder.prototype, "swap", null);
    /**
     * Helper to get the various token balances for checks in tests
     */
    function getTokenBalances() {
        let balances = {
            user: { MINA: 0n, X: 0n, Y: 0n, lqXY: 0n },
            user2: { MINA: 0n, X: 0n, Y: 0n, lqXY: 0n },
            dex: { X: 0n, Y: 0n },
            tokenContract: { X: 0n, Y: 0n },
            total: { lqXY: 0n },
        };
        for (let user of ['user', 'user2']) {
            try {
                balances[user].MINA =
                    Mina.getBalance(addresses[user]).toBigInt() / 1000000000n;
            }
            catch { }
            for (let token of ['X', 'Y', 'lqXY']) {
                try {
                    balances[user][token] = Mina.getBalance(addresses[user], tokenIds[token]).toBigInt();
                }
                catch { }
            }
        }
        try {
            balances.dex.X = Mina.getBalance(addresses.dex, tokenIds.X).toBigInt();
        }
        catch { }
        try {
            balances.dex.Y = Mina.getBalance(addresses.dex, tokenIds.Y).toBigInt();
        }
        catch { }
        try {
            balances.tokenContract.X = Mina.getBalance(addresses.tokenX, tokenIds.X).toBigInt();
        }
        catch { }
        try {
            balances.tokenContract.Y = Mina.getBalance(addresses.tokenY, tokenIds.Y).toBigInt();
        }
        catch { }
        try {
            let dex = new Dex(addresses.dex);
            balances.total.lqXY = dex.totalSupply.get().toBigInt();
        }
        catch { }
        return balances;
    }
    return {
        Dex,
        DexTokenHolder,
        ModifiedDexTokenHolder,
        ModifiedDex,
        getTokenBalances,
    };
}
/**
 * Simple token with API flexible enough to handle all our use cases
 */
class TokenContract extends BaseTokenContract {
    async init() {
        super.init();
        // mint the entire supply to the token account with the same address as this contract
        /**
         * DUMB STUFF FOR TESTING (change in real app)
         *
         * we mint the max uint64 of tokens here, so that we can overflow it in tests if we just mint a bit more
         */
        let receiver = this.internal.mint({
            address: this.address,
            amount: UInt64.MAXINT(),
        });
        // assert that the receiving account is new, so this can be only done once
        receiver.account.isNew.requireEquals(Bool(true));
        // pay fees for opened account
        this.balance.subInPlace(Mina.getNetworkConstants().accountCreationFee);
    }
    /**
     * DUMB STUFF FOR TESTING (delete in real app)
     *
     * mint additional tokens to some user, so we can overflow token balances
     */
    async init2() {
        let receiver = this.internal.mint({
            address: addresses.user,
            amount: UInt64.from(10n ** 6n),
        });
        // assert that the receiving account is new, so this can be only done once
        receiver.account.isNew.requireEquals(Bool(true));
        // pay fees for opened account
        this.balance.subInPlace(Mina.getNetworkConstants().accountCreationFee);
    }
    async approveBase(forest) {
        this.checkZeroBalanceChange(forest);
    }
}
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenContract.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TokenContract.prototype, "init2", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccountUpdateForest]),
    __metadata("design:returntype", Promise)
], TokenContract.prototype, "approveBase", null);
const savedKeys = [
    'EKFcUu4FLygkyZR8Ch4F8hxuJps97GCfiMRSWXDP55sgvjcmNGHc',
    'EKENfq7tEdTf5dnNxUgVo9dUnAqrEaB9syTgFyuRWinR5gPuZtbG',
    'EKEPVj2PDzQUrMwL2yeUikoQYXvh4qrkSxsDa7gegVcDvNjAteS5',
    'EKDm7SHWHEP5xiSbu52M1Z4rTFZ5Wx7YMzeaC27BQdPvvGvF42VH',
    'EKEuJJmmHNVHD1W2qmwExDyGbkSoKdKmKNPZn8QbqybVfd2Sd4hs',
    'EKEyPVU37EGw8CdGtUYnfDcBT2Eu7B6rSdy64R68UHYbrYbVJett',
];
let { keys, addresses } = randomAccounts(process.env.USE_CUSTOM_LOCAL_NETWORK === 'true', 'tokenX', 'tokenY', 'dex', 'user', 'user2', 'user3');
let tokenIds = {
    X: TokenId.derive(addresses.tokenX),
    Y: TokenId.derive(addresses.tokenY),
    lqXY: TokenId.derive(addresses.dex),
};
/**
 * Predefined accounts keys, labeled by the input strings. Useful for testing/debugging with consistent keys.
 */
function randomAccounts(createNewAccounts, ...names) {
    let base58Keys = createNewAccounts
        ? Array(6)
            .fill('')
            .map(() => PrivateKey.random().toBase58())
        : savedKeys;
    let keys = Object.fromEntries(names.map((name, idx) => [name, PrivateKey.fromBase58(base58Keys[idx])]));
    let addresses = Object.fromEntries(names.map((name) => [name, keys[name].toPublicKey()]));
    return { keys, addresses };
}
//# sourceMappingURL=dex.js.map