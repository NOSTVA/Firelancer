import { numeric, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts.js";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().notNull(),
  senderAccountId: uuid("sender_account_id").references(() => accounts.id),
  recipientAccountId: uuid("recipient_account_id").references(
    () => accounts.id,
  ),
  amount: numeric("amount").notNull(),
  creationDate: timestamp("creation_date").notNull(),
  orderId: uuid("order_id"),
});
