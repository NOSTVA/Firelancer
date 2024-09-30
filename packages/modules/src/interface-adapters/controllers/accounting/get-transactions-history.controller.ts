import { z } from "zod";
import { InputParseError } from "../../../errors.js";
import { getTransactionHistoryUseCase } from "../../../application/use-cases/accounting/get-transactions-history.use-case.js";

const inputSchema = z.object({
  userId: z.string(),
});

export async function getTransactionHistoryController(input: {
  userId: string;
}) {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return await getTransactionHistoryUseCase(data);
}
