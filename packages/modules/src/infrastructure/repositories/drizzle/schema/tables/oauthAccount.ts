import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const oauthProviders = pgEnum("oauth_providers", ["github"]);

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    providerId: oauthProviders("provider_id").notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }),
);
