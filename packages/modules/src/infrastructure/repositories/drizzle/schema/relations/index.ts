import { relations } from "drizzle-orm";
import { users } from "../tables/users.js";
import { oauthAccounts } from "../tables/oauthAccount.js";

export const _user = relations(users, ({ many }) => ({
  oauth_accounts: many(oauthAccounts),
}));

export const _oauthAccount = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}));
