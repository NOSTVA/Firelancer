import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";
import { oauthAccounts, users } from "./schema/index.js";
import { type User } from "../../../entities/models/user.js";
import { type IUsersRepository } from "../../../application/repositories/users.repository.interface.js";
import { DatabaseOperationError } from "../../../entities/errors/common.js";
import type { OAuthProvider } from "../../../entities/models/oauth.js";
import type { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";

@injectable()
export class UsersRepository implements IUsersRepository {
  async getUser(
    id: string,
    conn: DrizzleConnection = db
  ): Promise<User | undefined> {
    try {
      const query = conn.query.users.findFirst({
        where: eq(users.id, id)
      });

      const user = await query.execute();

      return user;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getUserByEmail(
    email: string,
    conn: DrizzleConnection = db
  ): Promise<User | undefined> {
    try {
      const query = conn.query.users.findFirst({
        where: eq(users.email, email)
      });

      const user = await query.execute();

      return user;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async updateUserById(
    userId: string,
    input: Partial<User>,
    conn: DrizzleConnection = db
  ) {
    try {
      const query = conn
        .update(users)
        .set(input)
        .where(eq(users.id, userId))
        .returning();

      const [updated] = await query.execute();

      if (updated) {
        return updated;
      } else {
        throw new DatabaseOperationError("Cannot update user.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getUserByOAuthProvider(
    providerId: OAuthProvider,
    providerUserId: string,
    conn: DrizzleConnection = db
  ): Promise<User | undefined> {
    try {
      const query = conn.query.oauthAccounts.findFirst({
        where: and(
          eq(oauthAccounts.providerId, providerId),
          eq(oauthAccounts.providerUserId, providerUserId)
        ),
        with: {
          user: true
        }
      });

      const account = await query.execute();

      return account?.user;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async createUser(input: User, conn: DrizzleConnection = db): Promise<User> {
    try {
      const query = conn.insert(users).values(input).returning();

      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create user.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
