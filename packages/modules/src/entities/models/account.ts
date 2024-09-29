import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  status: z.enum(["OPEN", "CLOSED"]),

  // permissions
  // canWithdraw: z.boolean(),
  // canDeposit: z.boolean(),
  // canTransfer: z.boolean(),

  creationDate: z.date(),
});

export type Account = z.infer<typeof accountSchema>;
