import { getInjection } from "../../../di/container.js";
import { signOutUseCase } from "../../../application/use-cases/auth/sign-out.use-case.js";
import { UnauthenticatedError } from "../../../entities/errors/auth.js";
import { InputParseError } from "../../../entities/errors/common.js";
import { type Cookie } from "../../../entities/models/cookie.js";

export async function signOutController(
  sessionId: string | undefined,
): Promise<{ blankCookie: Cookie }> {
  if (!sessionId) {
    throw new InputParseError("Must provide a session ID");
  }
  const authenticationService = getInjection("IAuthenticationService");
  const { session } = await authenticationService.validateSession(sessionId);

  if (!session) {
    throw new UnauthenticatedError("Unauthenticated");
  }

  return await signOutUseCase(session.id);
}
