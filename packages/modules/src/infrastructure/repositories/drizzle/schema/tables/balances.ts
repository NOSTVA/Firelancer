import {
  foreignKey,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts.js";
import { transactions } from "./transactions.js";

export const balances = pgTable(
  "balances",
  {
    id: uuid("id").primaryKey().notNull(),
    accountId: uuid("account_id")
      .references(() => accounts.id)
      .notNull(),
    balance: numeric("balance"),
    credit: numeric("credit").notNull(),
    debit: numeric("debit").notNull(),
    creationDate: timestamp("creation_date").notNull(),
    dueDate: timestamp("due_date"),
    settledDate: timestamp("settled_date"),
    prevBalance: numeric("prev_balance"),
    prevSettledDate: timestamp("prev_settled_date"),
    relatedBalanceEntryId: numeric("related_balance_entry_id"),
    relatedTransactionId: numeric("related_transaction_id").references(
      () => transactions.id,
    ),
  },
  (t) => ({
    related_balance_entry: foreignKey({
      columns: [t.relatedBalanceEntryId],
      foreignColumns: [t.id],
      name: "related_balance_entry",
    }),
  }),
);
