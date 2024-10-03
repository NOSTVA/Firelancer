import type { EmailVerificationCode } from "../../entities/models/email-verification-code.js";
import type { TransactionScope } from "./transaction.interface.js";

export interface IEmailVerificationCodesRepository {
  createVerificationCode(
    input: EmailVerificationCode,
    tx?: TransactionScope
  ): Promise<EmailVerificationCode>;
  deleteVerificationCode(
    code: string,
    tx?: TransactionScope
  ): Promise<EmailVerificationCode | undefined>;
  deleteVerificationCodeByUserId(
    userId: string,
    tx?: TransactionScope
  ): Promise<EmailVerificationCode | undefined>;
  getVerificationCodeByUserId(
    userId: string,
    tx?: TransactionScope
  ): Promise<EmailVerificationCode | undefined>;
}
