import { z } from "zod";

import { signUpUseCase } from "../../../application/use-cases/auth/sign-up.use-case.js";
import { InputParseError } from "../../../entities/errors/common.js";

const inputSchema = z
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
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function signUpController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<ReturnType<typeof signUpUseCase>> {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return await signUpUseCase(data);
}
