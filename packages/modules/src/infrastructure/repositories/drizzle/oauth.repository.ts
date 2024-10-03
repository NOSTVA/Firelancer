import { injectable } from "inversify";
import type { IOAuthRepository } from "../../../application/repositories/oauth.repository.interface.js";
import type { OAuthAccount } from "../../../entities/models/oauth.js";
import { oauthAccounts } from "./schema/index.js";
import { DatabaseOperationError } from "../../../entities/errors/common.js";
import type { DrizzleConnection } from "./transaction.js";
import { db } from "./db/index.js";

@injectable()
export class OAuthRepository implements IOAuthRepository {
  async createAccount(
    input: OAuthAccount,
    conn: DrizzleConnection = db
  ): Promise<OAuthAccount> {
    try {
      const query = conn.insert(oauthAccounts).values(input).returning();
      const [created] = await query.execute();

      if (created) {
        return created;
      } else {
        throw new DatabaseOperationError("Cannot create oauth account.");
      }
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
