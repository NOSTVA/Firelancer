import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  senderAccountId: z.string().uuid().nullable(),
  recipientAccountId: z.string().uuid().nullable(),
  amount: z.string(),
  creationDate: z.date(),
  orderId: z.string().uuid().nullable(),
});

export type Transaction = z.infer<typeof transactionSchema>;
