import { ContainerModule, type interfaces } from "inversify";
import type { IMailerService } from "../application/services/mailer.service.interface.js";
import { DI_SYMBOLS } from "./types.js";
import { MailerService } from "../infrastructure/services/mailer.service.js";
import type { IAuthenticationService } from "../application/services/authentication.service.interface.js";
import { AuthenticationService } from "../infrastructure/services/authentication.service.js";
import type { IEmailVerificationCodesRepository } from "../application/repositories/email-verification-codes.interface.js";
import type { IOAuthRepository } from "../application/repositories/oauth.repository.interface.js";
import { OAuthRepository } from "../infrastructure/repositories/drizzle/oauth.repo.js";
import type { ITransaction } from "../application/repositories/transaction.interface.js";
import type { IUsersRepository } from "../application/repositories/users.repository.interface.js";
import { UsersRepository } from "../infrastructure/repositories/drizzle/users.repo.js";
import { DrizzleTransaction } from "../infrastructure/repositories/drizzle/transaction.repo.js";
import { EmailVerificationCodesRepository } from "../infrastructure/repositories/drizzle/email-verification-codes.repo.js";

export const MailerServiceModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IMailerService>(DI_SYMBOLS.IMailerService).to(MailerService);
});

export const AuthenticationServiceModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(AuthenticationService);
});

export const EmailVerificationCodesRepositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEmailVerificationCodesRepository>(DI_SYMBOLS.IEmailVerificationCodesRepository).to(
    EmailVerificationCodesRepository
  );
});

export const OAuthRepositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IOAuthRepository>(DI_SYMBOLS.IOAuthRepository).to(OAuthRepository);
});

export const TransactionModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<ITransaction>(DI_SYMBOLS.ITransaction).to(DrizzleTransaction);
});

export const UsersRepositoryModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
});
