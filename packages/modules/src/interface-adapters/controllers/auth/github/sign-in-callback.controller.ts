import { z } from "zod";
import { type Cookie } from "../../../../entities/models/cookie.js";
import { InputParseError } from "../../../../entities/errors/common.js";
import { signInCallbackUseCase } from "../../../../application/use-cases/auth/github/sign-in-callback.use-case.js";

const inputSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export async function signInGithubCallbackController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<{ cookie: Cookie }> {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return await signInCallbackUseCase(data);
}
