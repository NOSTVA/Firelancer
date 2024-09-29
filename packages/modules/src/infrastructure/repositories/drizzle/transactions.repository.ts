import { injectable } from "inversify";
import { ITransactionsRepository } from "../../../application/repositories/transactions.repository.interface.js";
import { Transaction } from "../../../entities/models/transaction.js";
import { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";
import { transactions } from "./schema/index.js";
import { DatabaseOperationError } from "../../../errors.js";
import { eq } from "drizzle-orm";

@injectable()
export class TransactionsRepository implements ITransactionsRepository {
  async createTransaction(
    input: Transaction,
    conn: DrizzleConnection = db,
  ): Promise<Transaction> {
    try {
      const query = conn.insert(transactions).values(input).returning();

      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create transaction.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async updateTransaction(
    transactionId: string,
    input: Partial<Transaction>,
    conn: DrizzleConnection = db,
  ): Promise<Transaction | undefined> {
    try {
      const query = conn
        .update(transactions)
        .set(input)
        .where(eq(transactions.id, transactionId))
        .returning();

      const [updated] = await query.execute();

      return updated;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
