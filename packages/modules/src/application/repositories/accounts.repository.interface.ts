import { Account } from "../../entities/models/account.js";
import { AccountTransaction } from "../../entities/models/account-transaction.js";
import { TransactionScope } from "./transaction.interface.js";

export interface IAccountsRepository {
  createAccount(input: Account, tx?: TransactionScope): Promise<Account>;
  getAccountById(
    accountId: string,
    tx?: TransactionScope
  ): Promise<Account | undefined>;
  getAccountByUserId(
    userId: string,
    tx?: TransactionScope
  ): Promise<Account | undefined>;
  updateAccountById(
    accountId: string,
    input: Partial<Account>,
    tx?: TransactionScope
  ): Promise<Account | undefined>;
  createAccountTransaction(
    input: AccountTransaction,
    tx?: TransactionScope
  ): Promise<AccountTransaction>;
  getAccountTransactionById(
    entryId: string,
    tx?: TransactionScope
  ): Promise<AccountTransaction | undefined>;
  getLatestSettledAccountTransaction(
    accountId: string,
    tx?: TransactionScope
  ): Promise<AccountTransaction | undefined>;
  getUnsettledAccountTransactions(
    accountId: string,
    tx?: TransactionScope
  ): Promise<AccountTransaction[]>;
  getAccountTransactions(
    accountId: string,
    tx?: TransactionScope
  ): Promise<AccountTransaction[]>;
  updateAccountTransactionById(
    transactionId: string,
    input: Partial<AccountTransaction>,
    tx?: TransactionScope
  ): Promise<AccountTransaction | undefined>;
}
