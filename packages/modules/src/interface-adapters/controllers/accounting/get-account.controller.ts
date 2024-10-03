import { z } from "zod";
import { InputParseError } from "../../../errors.js";
import { getAccountUseCase } from "../../../application/use-cases/accounting/get-account.use-case.js";

const inputSchema = z.object({
  userId: z.string()
});

export async function getAccountController(input: { userId: string }) {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return await getAccountUseCase(data);
}
