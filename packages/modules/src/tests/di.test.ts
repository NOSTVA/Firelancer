import "reflect-metadata";

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from "../di/container.js";
import { UsersRepository } from "../infrastructure/repositories/drizzle/users.repository.js";
import { AuthenticationService } from "../infrastructure/services/authentication.service.js";
import { afterEach, beforeEach, expect, it } from "vitest";
import { MailerService } from "../infrastructure/services/mailer.service.js";
import { EmailVerificationCodesRepository } from "../infrastructure/repositories/drizzle/email-verification-codes.repository.js";
import { AccountsRepository } from "../infrastructure/repositories/drizzle/accounts.repository.js";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("Testing DI Modules Injection", async () => {
  const authService = getInjection("IAuthenticationService");
  const mailerService = getInjection("IMailerService");
  const usersRepository = getInjection("IUsersRepository");
  const emailVerificationCodeRepository = getInjection(
    "IEmailVerificationCodesRepository",
  );
  const accountsRepository = getInjection("IAccountsRepository");

  expect(authService).toBeInstanceOf(AuthenticationService);
  expect(mailerService).toBeInstanceOf(MailerService);
  expect(usersRepository).toBeInstanceOf(UsersRepository);
  expect(emailVerificationCodeRepository).toBeInstanceOf(
    EmailVerificationCodesRepository,
  );
  expect(accountsRepository).toBeInstanceOf(AccountsRepository);
});
