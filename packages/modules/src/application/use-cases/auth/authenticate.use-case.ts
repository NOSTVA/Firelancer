import { getInjection } from "../../../di/container.js";
import type { Session } from "../../../entities/models/session.js";
import type { User } from "../../../entities/models/user.js";
import type { Cookie } from "../../../entities/models/cookie.js";

const autheService = getInjection("IAuthenticationService");

export async function authenticateUserUseCase(input: {
  cookie: string;
}): Promise<{
  cookie: Cookie;
  session: Session | null;
  user: Pick<User, "id" | "username" | "email" | "emailVerified"> | null;
}> {
  const sessionId = autheService.readSessionCookie(input.cookie) || "";
  const { session, user } = await autheService.validateSession(sessionId);

  let cookie = autheService.createBlankSessionCookie();

  if (session && session.fresh) {
    cookie = autheService.createSessionCookie(session.id);
  }

  return {
    cookie,
    session,
    user: user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      : null,
  };
}
