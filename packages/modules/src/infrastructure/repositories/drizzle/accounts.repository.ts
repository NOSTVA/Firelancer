import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { IAccountsRepository } from "../../../application/repositories/accounts.repository.interface.js";
import { Account } from "../../../entities/models/account.js";
import { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";
import { accountTransactionMeta, accountTransactions, accounts } from "./schema/index.js";
import { DatabaseOperationError } from "../../../errors.js";
import { AccountTransaction } from "../../../entities/models/account-transaction.js";

@injectable()
export class AccountsRepository implements IAccountsRepository {
  async createAccount(input: Account, conn: DrizzleConnection = db): Promise<Account> {
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
  async getAccountByUserId(userId: string, conn: DrizzleConnection = db): Promise<Account | undefined> {
    try {
      const query = conn.query.accounts.findFirst({
        where: (t, { eq }) => eq(t.userId, userId),
      });

      const account = await query.execute();

      return account;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountById(accountId: string, conn: DrizzleConnection = db): Promise<Account | undefined> {
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
    conn: DrizzleConnection = db
  ): Promise<Account | undefined> {
    try {
      const query = conn.update(accounts).set(input).where(eq(accounts.id, accountId)).returning();

      const [updated] = await query.execute();

      return updated;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async createAccountTransaction(input: AccountTransaction, conn: DrizzleConnection = db): Promise<AccountTransaction> {
    try {
      const { meta, ...transaction } = input;

      return conn.transaction(async (tx) => {
        const [createdTransaction] = await tx.insert(accountTransactions).values(transaction).returning();

        if (meta.length > 0) {
          const createdTransationMeta = await tx.insert(accountTransactionMeta).values(meta).returning();

          if (createdTransaction && createdTransationMeta.length > 0) {
            return {
              ...createdTransaction,
              meta: createdTransationMeta,
            };
          }
        }

        if (createdTransaction) {
          return {
            ...createdTransaction,
            meta: [],
          };
        }

        throw new DatabaseOperationError("Cannot create account transaction.");
      });
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountTransactionById(
    transactionId: string,
    conn: DrizzleConnection = db
  ): Promise<AccountTransaction | undefined> {
    try {
      const transaction = await conn.query.accountTransactions.findFirst({
        where: (t, { eq }) => eq(t.id, transactionId),
        with: {
          meta: true,
        },
      });

      return transaction;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getLatestSettledAccountTransaction(
    accountId: string,
    conn: DrizzleConnection = db
  ): Promise<AccountTransaction | undefined> {
    try {
      const transaction = await conn.query.accountTransactions.findFirst({
        where: (t, { and, eq, isNotNull }) =>
          and(eq(t.accountId, accountId), isNotNull(t.balance), isNotNull(t.settledDate)),
        orderBy: (t, { desc }) => desc(t.settledDate),
        with: {
          meta: true,
        },
      });

      return transaction;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getUnsettledAccountTransactions(
    accountId: string,
    conn: DrizzleConnection = db
  ): Promise<AccountTransaction[]> {
    try {
      const transations = conn.query.accountTransactions.findMany({
        where: (t, { and, eq, isNull }) => and(eq(t.accountId, accountId), isNull(t.balance), isNull(t.settledDate)),
        orderBy: (t, { desc }) => desc(t.creationDate),
        with: {
          meta: true,
        },
      });

      return transations;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getAccountTransactions(accountId: string, conn: DrizzleConnection = db): Promise<AccountTransaction[]> {
    try {
      const transations = await conn.query.accountTransactions.findMany({
        where: (t, { eq }) => eq(t.accountId, accountId),
        orderBy: (t, { desc }) => [desc(t.settledDate), desc(t.reviewDueDate)],
        with: {
          meta: true,
        },
      });

      return transations;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async updateAccountTransactionById(
    transactionId: string,
    input: Partial<AccountTransaction>,
    conn: DrizzleConnection = db
  ): Promise<AccountTransaction | undefined> {
    try {
      const { meta, ...transation } = input;

      return conn.transaction(async (tx) => {
        const [updatedTransaction] = await conn
          .update(accountTransactions)
          .set(transation)
          .where(eq(accountTransactions.id, transactionId))
          .returning();

        const updatePromises = meta?.map(async (entry) => {
          const [updated] = await conn
            .update(accountTransactionMeta)
            .set(entry)
            .where(eq(accountTransactionMeta.id, entry.id))
            .returning();

          return updated;
        });

        const updatedTransactionMeta = await Promise.all(updatePromises || []);

        if (
          !updatedTransaction ||
          !updatedTransactionMeta ||
          updatedTransactionMeta.some((entry) => entry === undefined)
        ) {
          return undefined;
        }

        return {
          ...updatedTransaction,
          meta: updatedTransactionMeta.filter((entry) => entry !== undefined),
        };
      });
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
