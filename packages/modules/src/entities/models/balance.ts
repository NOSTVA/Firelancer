import { z } from "zod";

export const balanceEntrySchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  balance: z.string().nullable(),
  credit: z.string(),
  debit: z.string(),
  creationDate: z.date(),
  dueDate: z.date().nullable(),
  settledDate: z.date().nullable(),
  prevBalance: z.string().nullable(),
  prevSettledDate: z.date().nullable(),
  relatedBalanceEntryId: z.string().uuid().nullable(),
  relatedTransactionId: z.string().uuid().nullable(),
});

export type BalanceEntry = z.infer<typeof balanceEntrySchema>;
