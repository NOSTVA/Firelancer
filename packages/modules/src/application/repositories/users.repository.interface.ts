import type { OAuthProvider } from "../../entities/models/oauth.js";
import { type User } from "../../entities/models/user.js";
import type { TransactionScope } from "./transaction.interface.js";

export interface IUsersRepository {
  createUser(input: User, tx?: TransactionScope): Promise<User>;
  getUser(id: string, tx?: TransactionScope): Promise<User | undefined>;
  updateUserById(
    userId: string,
    input: Partial<User>,
    tx?: TransactionScope,
  ): Promise<User | undefined>;
  getUserByEmail(
    email: string,
    tx?: TransactionScope,
  ): Promise<User | undefined>;
  getUserByOAuthProvider(
    providerId: OAuthProvider,
    providerUserId: string,
    tx?: TransactionScope,
  ): Promise<User | undefined>;
}
