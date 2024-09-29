import { Transaction } from "../../entities/models/transaction.js";
import { TransactionScope } from "../repositories/transaction.interface.js";

export interface IAccountingService {
  initializeTransaction(details: {
    sender?: {
      accountId: string;
    };
    recipient?: {
      accountId: string;
    };
    amount: string;
    dueDate?: Date;
    orderId?: string;
  }): Promise<Transaction>;
  settleAccountBalance(
    balanceEntryId: string,
    tx?: TransactionScope,
  ): Promise<void>;
}
