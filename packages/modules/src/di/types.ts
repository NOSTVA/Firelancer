import type { IEmailVerificationCodesRepository } from "../application/repositories/email-verification-codes.interface.js";
import type { IOAuthRepository } from "../application/repositories/oauth.repository.interface.js";
import type { ITransaction } from "../application/repositories/transaction.interface.js";
import type { IUsersRepository } from "../application/repositories/users.repository.interface.js";
import type { IAuthenticationService } from "../application/services/authentication.service.interface.js";
import type { IMailerService } from "../application/services/mailer.service.interface.js";

export const DI_SYMBOLS = {
  ITransaction: Symbol.for("ITransaction"),
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),
  IMailerService: Symbol.for("IMailerService"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
  IOAuthRepository: Symbol.for("IOAuthRepository"),
  IEmailVerificationCodesRepository: Symbol.for(
    "IEmailVerificationCodesRepository",
  ),
};

export interface DI_RETURN_TYPES {
  ITransaction: ITransaction;
  // Services
  IAuthenticationService: IAuthenticationService;
  IMailerService: IMailerService;

  // Repositories
  IUsersRepository: IUsersRepository;
  IOAuthRepository: IOAuthRepository;
  IEmailVerificationCodesRepository: IEmailVerificationCodesRepository;
}
