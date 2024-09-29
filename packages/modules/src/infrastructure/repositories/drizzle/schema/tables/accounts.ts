import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const accountStatus = pgEnum("account_status", ["OPEN", "CLOSED"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  status: accountStatus("status").notNull(),
  creationDate: timestamp("creation_date").notNull(),
});
