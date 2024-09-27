import "reflect-metadata";

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from "../di/container.js";
import { UsersRepository } from "../infrastructure/repositories/drizzle/users.repo.js";
import { AuthenticationService } from "../infrastructure/services/authentication.service.js";
import { afterEach, beforeEach, expect, it } from "vitest";
import { MailerService } from "../infrastructure/services/mailer.service.js";
import { EmailVerificationCodesRepository } from "../infrastructure/repositories/drizzle/email-verification-codes.repo.js";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("Testing DI Modules", async () => {
  const authService = getInjection("IAuthenticationService");
  const mailerService = getInjection("IMailerService");
  const usersRepository = getInjection("IUsersRepository");
  const emailVerificationCodeRepository = getInjection(
    "IEmailVerificationCodesRepository",
  );

  expect(authService).toBeInstanceOf(AuthenticationService);
  expect(mailerService).toBeInstanceOf(MailerService);
  expect(usersRepository).toBeInstanceOf(UsersRepository);
  expect(emailVerificationCodeRepository).toBeInstanceOf(
    EmailVerificationCodesRepository,
  );
});
