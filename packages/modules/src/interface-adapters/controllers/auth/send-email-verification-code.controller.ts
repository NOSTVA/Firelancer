import { z } from "zod";
import { InputParseError } from "../../../entities/errors/common.js";
import { sendEmailVerificationCodeUseCase } from "../../../application/use-cases/auth/send-email-verification-code.use-case.js";

const inputSchema = z.object({
  userId: z.string(),
  email: z.string(),
});

export async function sendEmailVerificationCodeController(input: {
  userId: string;
  email: string;
}) {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return sendEmailVerificationCodeUseCase({
    email: data.email,
    userId: data.userId,
  });
}
