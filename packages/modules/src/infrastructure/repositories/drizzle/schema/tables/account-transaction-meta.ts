import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { accountTransactions } from "./account-transactions.js";

export const accountTransactionMeta = pgTable("account_transaction_meta", {
  id: uuid("id").primaryKey().notNull(),
  accountTransactionId: uuid("account_transaction_id")
    .references(() => accountTransactions.id)
    .notNull(),
  metaKey: text("meta_key").notNull(),
  metaValue: text("meta_value").notNull()
});
