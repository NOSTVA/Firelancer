import { Account } from "../../entities/models/account.js";
import { BalanceEntry } from "../../entities/models/balance.js";
import { TransactionScope } from "./transaction.interface.js";

export interface IAccountsRepository {
  createAccount(input: Account, tx?: TransactionScope): Promise<Account>;
  getAccountsByUserId(
    userId: string,
    tx?: TransactionScope,
  ): Promise<Account[]>;
  getAccountById(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<Account | undefined>;
  updateAccountById(
    accountId: string,
    input: Partial<Account>,
    tx?: TransactionScope,
  ): Promise<Account | undefined>;
  createBalanceEntry(
    input: BalanceEntry,
    tx?: TransactionScope,
  ): Promise<BalanceEntry>;
  getAccountAvailableBalance(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<{ amount: string }>;
  getAccountPendingBalance(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<{ amount: string }>;
  getAccountBalanceEntries(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<BalanceEntry[]>;
}
