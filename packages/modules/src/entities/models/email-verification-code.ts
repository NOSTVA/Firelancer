import { z } from "zod";

export const emailVerificationCodeSchema = z.object({
  code: z.string(),
  userId: z.string(),
  email: z.string().email(),
  expiresAt: z.date(),
});

export type EmailVerificationCode = z.infer<typeof emailVerificationCodeSchema>;
