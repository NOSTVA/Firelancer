import { inject, injectable } from "inversify";
import { generateIdFromEntropySize, Lucia, TimeSpan } from "lucia";

import { DI_SYMBOLS } from "../../di/types.js";
import { type IUsersRepository } from "../../application/repositories/users.repository.interface.js";
import { type IAuthenticationService } from "../../application/services/authentication.service.interface.js";
import { type Cookie } from "../../entities/models/cookie.js";
import { type Session, sessionSchema } from "../../entities/models/session.js";
import { type User } from "../../entities/models/user.js";
import env from "../../env.js";
import { luciaAdapter } from "../repositories/drizzle/db/index.js";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private _lucia: Lucia;

  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private _usersRepository: IUsersRepository
  ) {
    this._lucia = new Lucia(luciaAdapter, {
      sessionExpiresIn: new TimeSpan(2, "w"),
      sessionCookie: {
        name: env.SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: env.ENV === "production"
        }
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
          email: attributes.email,
          emailVerified: attributes.emailVerified
        };
      }
    });
  }
  async validateSession(
    sessionId: string
  ): Promise<{ user: User | null; session: Session | null }> {
    const { user, session } = await this._lucia.validateSession(sessionId);

    if (user && session) {
      const existingUser = await this._usersRepository.getUser(user.id);
      return { user: existingUser ?? null, session };
    }

    return { user: null, session: null };
  }
  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    const luciaSession = await this._lucia.createSession(user.id, {});

    const session = sessionSchema.parse(luciaSession);
    const cookie = this._lucia.createSessionCookie(session.id);

    return { session, cookie };
  }
  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this._lucia.invalidateSession(sessionId);

    const blankCookie = this._lucia.createBlankSessionCookie();

    return { blankCookie };
  }
  generateUserId(): string {
    return generateIdFromEntropySize(10);
  }
  readSessionCookie(cookie: string): string | null {
    return this._lucia.readSessionCookie(cookie);
  }
  createSessionCookie(sessionId: Session["id"]): Cookie {
    return this._lucia.createSessionCookie(sessionId);
  }
  createBlankSessionCookie(): Cookie {
    return this._lucia.createBlankSessionCookie();
  }
}

interface DatabaseUserAttributes {
  username: string;
  email: string;
  emailVerified: boolean;
}

declare module "lucia" {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
