import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const emailVerificationCodes = pgTable("email_verification_codes", {
  code: text("code").primaryKey().notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
