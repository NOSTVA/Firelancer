import { getInjection } from "../../../di/container.js";
import { type Cookie } from "../../../entities/models/cookie.js";

export async function signOutUseCase(
  sessionId: string,
): Promise<{ blankCookie: Cookie }> {
  const authenticationService = getInjection("IAuthenticationService");

  return await authenticationService.invalidateSession(sessionId);
}
