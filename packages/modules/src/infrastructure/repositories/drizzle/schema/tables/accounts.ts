import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { ACCOUNT_STATUS } from "../../../../../entities/models/account.js";

export const accountStatusEnum = pgEnum("account_status", ACCOUNT_STATUS);

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  status: accountStatusEnum("status").notNull(),
  creationDate: timestamp("creation_date").notNull()
});
