import { z } from "zod";

export const ACCOUNT_STATUS = ["OPEN", "CLOSED"] as const;

export const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  status: z.enum(ACCOUNT_STATUS),
  creationDate: z.date(),
});

export type Account = z.infer<typeof accountSchema>;
