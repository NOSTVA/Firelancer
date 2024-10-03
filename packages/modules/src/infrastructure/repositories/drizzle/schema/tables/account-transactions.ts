import {
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts.js";
import { ACCOUNT_TRANSACTION_TYPES } from "../../../../../entities/models/account-transaction.js";

export const accountTransactionTypeEnum = pgEnum(
  "account_transaction_type",
  ACCOUNT_TRANSACTION_TYPES
);

export const accountTransactions = pgTable(
  "account_transactions",
  {
    id: uuid("id").primaryKey().notNull(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    type: accountTransactionTypeEnum("type").notNull(),
    balance: numeric("balance"),
    credit: numeric("credit").notNull(),
    debit: numeric("debit").notNull(),
    creationDate: timestamp("creation_date").notNull(),
    reviewDueDate: timestamp("review_due_date"),
    settledDate: timestamp("settled_date"),
    prevBalance: numeric("prev_balance"),
    prevSettledDate: timestamp("prev_settled_date"),
    relatedTransactionId: uuid("related_transaction_id")
  },
  (t) => ({
    related_transaction_idx: foreignKey({
      columns: [t.relatedTransactionId],
      foreignColumns: [t.id],
      name: "related_transaction_idx"
    })
  })
);
