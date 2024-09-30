import {
  AccountTransaction,
  AccountTransactionType,
} from "../../entities/models/account-transaction.js";
import { TransactionScope } from "../repositories/transaction.interface.js";

export interface IAccountingService {
  initializeAccountTransaction(details: {
    userId: string;
    type: AccountTransactionType;
    credit: string;
    debit: string;
    reviewDueDate?: Date;
    meta?: Record<string, string>;
  }): Promise<AccountTransaction>;
  settleAccountTransaction(
    transactionId: string,
    tx: TransactionScope,
  ): Promise<void>;
}
