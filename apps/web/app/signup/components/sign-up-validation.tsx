import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(3).max(31),
    email: z.string().email(),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm_password"],
      });
    }
  });

export type SignUpData = z.infer<typeof signUpSchema>;
