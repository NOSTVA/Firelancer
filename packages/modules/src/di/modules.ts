import { ContainerModule, type interfaces } from "inversify";
import { DI_SYMBOLS } from "./types.js";
import { MailerService } from "../infrastructure/services/mailer.service.js";
import { AuthenticationService } from "../infrastructure/services/authentication.service.js";
import { OAuthRepository } from "../infrastructure/repositories/drizzle/oauth.repository.js";
import { UsersRepository } from "../infrastructure/repositories/drizzle/users.repository.js";
import { DrizzleTransaction } from "../infrastructure/repositories/drizzle/transaction.js";
import { EmailVerificationCodesRepository } from "../infrastructure/repositories/drizzle/email-verification-codes.repository.js";
import { IAccountsRepository } from "../application/repositories/accounts.repository.interface.js";
import { AccountsRepository } from "../infrastructure/repositories/drizzle/accounts.repository.js";
import { IAccountingService } from "../application/services/accounting.service.interface.js";
import { AccountingService } from "../infrastructure/services/accounting.service.js";
import type { IMailerService } from "../application/services/mailer.service.interface.js";
import type { IAuthenticationService } from "../application/services/authentication.service.interface.js";
import type { ITransaction } from "../application/repositories/transaction.interface.js";
import type { IEmailVerificationCodesRepository } from "../application/repositories/email-verification-codes.repository.interface.js";
import type { IOAuthRepository } from "../application/repositories/oauth.repository.interface.js";
import type { IUsersRepository } from "../application/repositories/users.repository.interface.js";

export const MailerServiceModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IMailerService>(DI_SYMBOLS.IMailerService).to(MailerService);
  },
);

export const AuthenticationServiceModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService,
    );
  },
);

export const AccountingServiceModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IAccountingService>(DI_SYMBOLS.IAccountingService).to(
      AccountingService,
    );
  },
);

export const EmailVerificationCodesRepositoryModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IEmailVerificationCodesRepository>(
      DI_SYMBOLS.IEmailVerificationCodesRepository,
    ).to(EmailVerificationCodesRepository);
  },
);

export const OAuthRepositoryModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IOAuthRepository>(DI_SYMBOLS.IOAuthRepository).to(OAuthRepository);
  },
);

export const TransactionModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<ITransaction>(DI_SYMBOLS.ITransaction).to(DrizzleTransaction);
  },
);

export const UsersRepositoryModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
  },
);

export const AccountsRepositoryModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind<IAccountsRepository>(DI_SYMBOLS.IAccountsRepository).to(
      AccountsRepository,
    );
  },
);
