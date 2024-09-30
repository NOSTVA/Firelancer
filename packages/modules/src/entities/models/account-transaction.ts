import { z } from "zod";
import { accountTransactionMetaSchema } from "./account-transaction-meta.js";

export const ACCOUNT_TRANSACTION_TYPES = [
  "FIXED-PRICE",
  "BONUS",
  "PAYMENT",
  "WITHDRAWAL",
] as const;

export const accountTransactionSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  type: z.enum(ACCOUNT_TRANSACTION_TYPES),
  balance: z.string().nullable(),
  credit: z.string(),
  debit: z.string(),
  creationDate: z.date(),
  reviewDueDate: z.date().nullable(),
  settledDate: z.date().nullable(),
  prevBalance: z.string().nullable(),
  prevSettledDate: z.date().nullable(),
  relatedTransactionId: z.string().uuid().nullable(),
  meta: z.array(accountTransactionMetaSchema),
});

export type AccountTransactionType = (typeof ACCOUNT_TRANSACTION_TYPES)[number];
export type AccountTransaction = z.infer<typeof accountTransactionSchema>;
