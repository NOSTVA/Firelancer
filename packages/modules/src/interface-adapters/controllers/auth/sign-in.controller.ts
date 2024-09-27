import { z } from "zod";

import { signInUseCase } from "../../../application/use-cases/auth/sign-in.use-case.js";
import { InputParseError } from "../../../entities/errors/common.js";
import { type Cookie } from "../../../entities/models/cookie.js";

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(31),
});

export async function signInController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<{ cookie: Cookie }> {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return await signInUseCase(data);
}
