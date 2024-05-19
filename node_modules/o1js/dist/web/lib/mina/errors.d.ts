import { Types } from '../../bindings/mina-transaction/types.js';
export { invalidTransactionError };
declare function invalidTransactionError(transaction: Types.ZkappCommand, errors: string[][][], additionalContext: {
    accountCreationFee: string | number;
}): string;
