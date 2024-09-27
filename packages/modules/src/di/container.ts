import { Container } from "inversify";
import {
  AuthenticationServiceModule,
  EmailVerificationCodesRepositoryModule,
  MailerServiceModule,
  OAuthRepositoryModule,
  TransactionModule,
  UsersRepositoryModule,
} from "./modules.js";
import type { DI_RETURN_TYPES } from "./types.js";
import { DI_SYMBOLS } from "./types.js";

let CONTAINER_INIT = false;
const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  if (!CONTAINER_INIT) {
    ApplicationContainer.load(UsersRepositoryModule);
    ApplicationContainer.load(AuthenticationServiceModule);
    ApplicationContainer.load(OAuthRepositoryModule);
    ApplicationContainer.load(TransactionModule);
    ApplicationContainer.load(MailerServiceModule);
    ApplicationContainer.load(EmailVerificationCodesRepositoryModule);
    CONTAINER_INIT = true;
  }
};

export const destroyContainer = () => {
  if (CONTAINER_INIT) {
    ApplicationContainer.load(UsersRepositoryModule);
    ApplicationContainer.load(AuthenticationServiceModule);
    ApplicationContainer.load(OAuthRepositoryModule);
    ApplicationContainer.load(TransactionModule);
    ApplicationContainer.load(MailerServiceModule);
    ApplicationContainer.load(EmailVerificationCodesRepositoryModule);
    CONTAINER_INIT = false;
  }
};

initializeContainer();

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

export { ApplicationContainer };
