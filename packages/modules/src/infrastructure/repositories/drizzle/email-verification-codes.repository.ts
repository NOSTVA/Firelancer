import { injectable } from "inversify";
import { EmailVerificationCode } from "../../../entities/models/email-verification-code.js";
import { DrizzleConnection } from "./transaction.js";
import { emailVerificationCodes } from "./schema/index.js";
import { DatabaseOperationError } from "../../../entities/errors/common.js";
import { eq } from "drizzle-orm";
import { IEmailVerificationCodesRepository } from "../../../application/repositories/email-verification-codes.repository.interface.js";
import { db } from "./db/index.js";

@injectable()
export class EmailVerificationCodesRepository
  implements IEmailVerificationCodesRepository
{
  async createVerificationCode(
    input: EmailVerificationCode,
    conn: DrizzleConnection = db
  ): Promise<EmailVerificationCode> {
    try {
      const query = conn
        .insert(emailVerificationCodes)
        .values(input)
        .returning();

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
  async deleteVerificationCode(code: string, conn: DrizzleConnection = db) {
    try {
      const query = conn
        .delete(emailVerificationCodes)
        .where(eq(emailVerificationCodes.code, code))
        .returning();

      const [removed] = await query.execute();

      return removed;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async deleteVerificationCodeByUserId(
    userId: string,
    conn: DrizzleConnection = db
  ) {
    try {
      const query = conn
        .delete(emailVerificationCodes)
        .where(eq(emailVerificationCodes.userId, userId))
        .returning();

      const [removed] = await query.execute();

      return removed;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
  async getVerificationCodeByUserId(
    userId: string,
    conn: DrizzleConnection = db
  ) {
    try {
      const query = conn.query.emailVerificationCodes.findFirst({
        where: (t, { eq }) => eq(t.userId, userId)
      });

      const code = await query.execute();

      return code;
    } catch (err) {
      throw err; // TODO: convert to Entities error
    }
  }
}
