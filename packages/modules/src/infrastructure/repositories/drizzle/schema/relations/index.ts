import { relations } from "drizzle-orm";
import { users } from "../tables/users.js";
import { oauthAccounts } from "../tables/oauthAccounts.js";
import { accounts } from "../tables/accounts.js";
import { accountTransactions } from "../tables/account-transactions.js";
import { accountTransactionMeta } from "../tables/account-transaction-meta.js";

export const _user = relations(users, ({ many }) => ({
  oauth_accounts: many(oauthAccounts),
  accounts: many(accounts),
}));

export const _oauthAccount = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}));

export const _account = relations(accounts, ({ many, one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(accountTransactions),
}));

export const _accountTransactions = relations(
  accountTransactions,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [accountTransactions.accountId],
      references: [accounts.id],
    }),
    relatedTransaction: one(accountTransactions, {
      fields: [accountTransactions.relatedTransactionId],
      references: [accountTransactions.id],
    }),
    meta: many(accountTransactionMeta),
  }),
);

export const _accountTransactionMeta = relations(
  accountTransactionMeta,
  ({ one, many }) => ({
    transaction: one(accountTransactions, {
      fields: [accountTransactionMeta.accountTransactionId],
      references: [accountTransactions.id],
    }),
  }),
);
