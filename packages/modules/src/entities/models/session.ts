import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fresh: z.boolean(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;
