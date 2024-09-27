import type { OAuthAccount } from "../../entities/models/oauth.js";
import type { TransactionScope } from "./transaction.interface.js";

export interface IOAuthRepository {
  createAccount(
    input: OAuthAccount,
    tx?: TransactionScope,
  ): Promise<OAuthAccount>;
}
