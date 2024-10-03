import type { Cookie } from "../../entities/models/cookie.js";
import type { Session } from "../../entities/models/session.js";
import type { User } from "../../entities/models/user.js";

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session["id"]
  ): Promise<{ user: User | null; session: Session | null }>;
  readSessionCookie(cookie: string): string | null;
  createSessionCookie(sessionId: Session["id"]): Cookie;
  createBlankSessionCookie(): Cookie;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie }>;
}
