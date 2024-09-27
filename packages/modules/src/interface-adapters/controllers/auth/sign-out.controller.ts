import { signOutUseCase } from "../../../application/use-cases/auth/sign-out.use-case.js";
import { InputParseError } from "../../../entities/errors/common.js";
import { type Cookie } from "../../../entities/models/cookie.js";

export async function signOutController(sessionId: string | undefined): Promise<{ blankCookie: Cookie }> {
  if (!sessionId) {
    throw new InputParseError("Must provide a session ID");
  }

  return await signOutUseCase(sessionId);
}
