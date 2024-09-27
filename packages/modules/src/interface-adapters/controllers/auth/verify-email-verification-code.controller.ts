import { z } from "zod";
import { verifyEmailVerificationCodeUseCase } from "../../../application/use-cases/auth/verify-email-verification-code.use-case.js";
import { InputParseError } from "../../../entities/errors/common.js";

const inputSchema = z.object({
  userId: z.string(),
  email: z.string(),
  code: z.string(),
});

export async function verifyEmailVerificationCodeController(input: {
  userId: string;
  email: string;
}) {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return verifyEmailVerificationCodeUseCase({
    userId: data.userId,
    email: data.email,
    code: data.code,
  });
}
