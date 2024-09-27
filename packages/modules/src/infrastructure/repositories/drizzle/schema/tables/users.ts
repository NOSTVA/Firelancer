import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull(),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull(),
  hashedPassword: text("hashed_password"),
});
