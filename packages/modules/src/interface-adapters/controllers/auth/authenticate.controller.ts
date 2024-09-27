import { z } from "zod";
import type { Session } from "../../../entities/models/session.js";
import type { User } from "../../../entities/models/user.js";
import type { Cookie } from "../../../entities/models/cookie.js";
import { authenticateUserUseCase } from "../../../application/use-cases/auth/authenticate.use-case.js";
import { InputParseError } from "../../../entities/errors/common.js";

const inputSchema = z.object({
  cookie: z.string(),
});

export async function authenticateUserController(input: {
  cookie: string;
}): Promise<{
  cookie: Cookie;
  session: Session | null;
  user: Pick<User, "id" | "username" | "email" | "emailVerified"> | null;
}> {
  const { data, error: inputParseError } = inputSchema.safeParse(input);

  if (inputParseError) {
    throw new InputParseError("Invalid data", { cause: inputParseError });
  }

  return authenticateUserUseCase({ cookie: data.cookie });
}
