import type { PgTransaction } from "drizzle-orm/pg-core";
import type {
  ITransaction,
  TransactionScope,
} from "../../../application/repositories/transaction.interface.js";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index.js";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { injectable } from "inversify";
import { db, DrizzleDatabase } from "./db/index.js";

export type DrizzleTransactionScope = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export type DrizzleConnection = DrizzleDatabase | DrizzleTransactionScope;

@injectable()
export class DrizzleTransaction implements ITransaction {
  async create<T>(
    transaction: (tx: TransactionScope) => Promise<T>,
  ): Promise<T> {
    return await db.transaction(transaction);
  }
}
