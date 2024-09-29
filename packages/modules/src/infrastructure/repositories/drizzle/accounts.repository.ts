import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { IAccountsRepository } from "../../../application/repositories/accounts.repository.interface.js";
import { Account } from "../../../entities/models/account.js";
import { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";
import { balances, accounts } from "./schema/index.js";
import { DatabaseOperationError } from "../../../errors.js";
import { BalanceEntry } from "../../../entities/models/balance.js";

@injectable()
export class AccountsRepository implements IAccountsRepository {
  async createAccount(
    input: Account,
    conn: DrizzleConnection = db,
  ): Promise<Account> {
    try {
      const query = conn.insert(accounts).values(input).returning();

      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create account.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountsByUserId(
    userId: string,
    conn: DrizzleConnection = db,
  ): Promise<Account[]> {
    try {
      const query = conn.query.accounts.findMany({
        where: (t, { eq }) => eq(t.userId, userId),
      });

      const userAccounts = await query.execute();

      return userAccounts;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountByUserId(
    userId: string,
    conn: DrizzleConnection = db,
  ): Promise<Account | undefined> {
    try {
      const query = conn.query.accounts.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.userId, userId), eq(t.status, "OPEN")),
      });

      const account = await query.execute();

      return account;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountById(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<Account | undefined> {
    try {
      const query = conn.query.accounts.findFirst({
        where: (t, { eq }) => eq(t.id, accountId),
      });

      const account = await query.execute();

      return account;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async updateAccountById(
    accountId: string,
    input: Partial<Account>,
    conn: DrizzleConnection = db,
  ): Promise<Account | undefined> {
    try {
      const query = conn
        .update(accounts)
        .set(input)
        .where(eq(accounts.id, accountId))
        .returning();

      const [updated] = await query.execute();

      return updated;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async createBalanceEntry(
    input: BalanceEntry,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry> {
    try {
      const query = conn.insert(balances).values(input).returning();

      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create balance entry.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getBalanceEntryById(
    entryId: string,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry | undefined> {
    try {
      const query = conn.query.balances.findFirst({
        where: (t, { eq }) => eq(t.id, entryId),
      });

      const entry = await query.execute();

      return entry;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getLatestSettledBalanceEntry(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry | undefined> {
    try {
      const query = conn.query.balances.findFirst({
        where: (t, { and, eq, isNotNull }) =>
          and(
            eq(t.accountId, accountId),
            isNotNull(t.balance),
            isNotNull(t.settledDate),
          ),
        orderBy: (t, { desc }) => desc(t.settledDate),
      });

      const entry = await query.execute();

      return entry;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getUnsettledBalanceEntries(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry[]> {
    try {
      const query = conn.query.balances.findMany({
        where: (t, { and, eq, isNull }) =>
          and(
            eq(t.accountId, accountId),
            isNull(t.balance),
            isNull(t.settledDate),
          ),
        orderBy: (t, { desc }) => desc(t.creationDate),
      });

      const entries = await query.execute();

      return entries;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getBalanceEntries(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry[]> {
    try {
      const query = conn.query.balances.findMany({
        where: (t, { eq }) => eq(t.accountId, accountId),
        with: {
          relatedTransaction: true,
        },
      });

      const entries = await query.execute();

      return entries;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async updateBalanceEntryById(
    entryId: string,
    input: Partial<BalanceEntry>,
    conn: DrizzleConnection = db,
  ): Promise<BalanceEntry | undefined> {
    try {
      const query = conn
        .update(balances)
        .set(input)
        .where(eq(balances.id, entryId))
        .returning();

      const [updated] = await query.execute();

      return updated;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
