import { Transaction } from "../../entities/models/transaction.js";
import { TransactionScope } from "./transaction.interface.js";

export interface ITransactionsRepository {
  createTransaction(
    input: Transaction,
    tx?: TransactionScope,
  ): Promise<Transaction>;
  updateTransaction(
    transactionId: string,
    input: Partial<Transaction>,
    tx?: TransactionScope,
  ): Promise<Transaction | undefined>;
}
