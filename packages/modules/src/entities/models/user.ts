import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(31),
  email: z.string().email().nullable(),
  emailVerified: z.boolean(),
  hashedPassword: z.string().min(6).max(255).nullable(),
});

export type User = z.infer<typeof userSchema>;
