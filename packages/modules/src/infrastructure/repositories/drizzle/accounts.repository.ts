import { injectable } from "inversify";
import { IAccountsRepository } from "../../../application/repositories/accounts.repository.interface.js";
import { Account } from "../../../entities/models/account.js";
import { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";
import { balances, accounts } from "./schema/index.js";
import { DatabaseOperationError } from "../../../errors.js";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { BalanceEntry } from "../../../entities/models/balance.js";

@injectable()
export class AccountsRepository implements IAccountsRepository {
  async createAccount(
    input: Account,
    conn: DrizzleConnection = db,
  ): Promise<Account> {
    try {
      const query = conn.query.accounts.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.userId, input.userId), eq(t.status, "OPEN")),
      });

      const openAccount = await query.execute();

      if (openAccount) {
        throw new Error("An open account already exists for this user.");
      }

      const query2 = conn.insert(accounts).values(input).returning();

      const [created] = await query2.execute();

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
  async getAccountAvailableBalance(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<{ amount: string }> {
    try {
      const query = conn
        .select({
          balance: sql<string>`COALESCE(${balances.balance}, 0)`,
        })
        .from(balances)
        .where(
          and(
            eq(balances.id, accountId),
            isNotNull(balances.balance),
            isNotNull(balances.settledDate),
          ),
        )
        .orderBy(desc(balances.settledDate))
        .limit(1);

      const [result] = await query.execute();

      return { amount: result ? result.balance : "0" };
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountPendingBalance(
    accountId: string,
    conn: DrizzleConnection = db,
  ): Promise<{ amount: string }> {
    try {
      const query = conn
        .select({
          balance: sql<string>`COALESCE(SUM(${balances.credit} - ${balances.debit}), 0)`,
        })
        .from(balances)
        .where(
          and(
            eq(balances.id, accountId),
            isNull(balances.balance),
            isNull(balances.settledDate),
          ),
        );

      const [result] = await query.execute();

      return { amount: result ? result.balance : "0" };
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountBalanceEntries(
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

      const transactions = await query.execute();

      return transactions;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
