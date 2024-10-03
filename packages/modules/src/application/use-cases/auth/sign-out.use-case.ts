import { getInjection } from "../../../di/container.js";
import { type Cookie } from "../../../entities/models/cookie.js";
import { UnauthenticatedError } from "../../../errors.js";

const authService = getInjection("IAuthenticationService");

export async function signOutUseCase(
  sessionId: string
): Promise<{ blankCookie: Cookie }> {
  const { session } = await authService.validateSession(sessionId);

  if (!session) {
    throw new UnauthenticatedError("Unauthenticated");
  }

  return await authService.invalidateSession(sessionId);
}
