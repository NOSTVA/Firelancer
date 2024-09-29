import { Account } from "../../entities/models/account.js";
import { BalanceEntry } from "../../entities/models/balance.js";
import { TransactionScope } from "./transaction.interface.js";

export interface IAccountsRepository {
  createAccount(input: Account, tx?: TransactionScope): Promise<Account>;
  getAccountsByUserId(
    userId: string,
    tx?: TransactionScope,
  ): Promise<Account[]>;
  getAccountByUserId(
    userId: string,
    tx?: TransactionScope,
  ): Promise<Account | undefined>;
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
  getBalanceEntryById(
    entryId: string,
    tx?: TransactionScope,
  ): Promise<BalanceEntry | undefined>;
  getLatestSettledBalanceEntry(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<BalanceEntry | undefined>;
  getUnsettledBalanceEntries(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<BalanceEntry[]>;
  getBalanceEntries(
    accountId: string,
    tx?: TransactionScope,
  ): Promise<BalanceEntry[]>;
  updateBalanceEntryById(
    entryId: string,
    input: Partial<BalanceEntry>,
    tx?: TransactionScope,
  ): Promise<BalanceEntry | undefined>;
}
