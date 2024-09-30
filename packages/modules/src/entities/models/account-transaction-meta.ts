import { z } from "zod";

export const accountTransactionMetaSchema = z.object({
  id: z.string().uuid(),
  accountTransactionId: z.string().uuid(),
  metaKey: z.string(),
  metaValue: z.string(),
});

export type AccountTransactionMeta = z.infer<
  typeof accountTransactionMetaSchema
>;
