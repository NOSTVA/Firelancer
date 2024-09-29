import { relations } from "drizzle-orm";
import { users } from "../tables/users.js";
import { oauthAccounts } from "../tables/oauthAccounts.js";
import { accounts } from "../tables/accounts.js";
import { balances } from "../tables/balances.js";
import { transactions } from "../tables/transactions.js";

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
  balances: many(balances),
}));

export const _accountBalance = relations(balances, ({ one }) => ({
  account: one(accounts, {
    fields: [balances.accountId],
    references: [accounts.id],
  }),
  relatedBalanceEntry: one(balances, {
    fields: [balances.relatedBalanceEntryId],
    references: [balances.id],
  }),
  relatedTransaction: one(transactions, {
    fields: [balances.relatedTransactionId],
    references: [transactions.id],
  }),
}));

export const _invoices = relations(transactions, ({ one }) => ({
  sender: one(accounts, {
    fields: [transactions.senderAccountId],
    references: [accounts.id],
  }),
  recipient: one(accounts, {
    fields: [transactions.recipientAccountId],
    references: [accounts.id],
  }),
}));
