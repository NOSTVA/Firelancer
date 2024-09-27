import "reflect-metadata";
import { authenticateUserController } from "./interface-adapters/controllers/auth/authenticate.controller.js";
import { signInController } from "./interface-adapters/controllers/auth/sign-in.controller.js";
import { signOutController } from "./interface-adapters/controllers/auth/sign-out.controller.js";
import { signUpController } from "./interface-adapters/controllers/auth/sign-up.controller.js";
import { sendEmailVerificationCodeController } from "./interface-adapters/controllers/auth/send-email-verification-code.controller.js";
import { verifyEmailVerificationCodeController } from "./interface-adapters/controllers/auth/verify-email-verification-code.controller.js";
import { signInGithubController } from "./interface-adapters/controllers/auth/github/sign-in.controller.js";
import { signInGithubCallbackController } from "./interface-adapters/controllers/auth/github/sign-in-callback.controller.js";

const auth = {
  authenticateUser: authenticateUserController,
  signIn: signInController,
  signOut: signOutController,
  signUp: signUpController,
  sendEmailVerificationCode: sendEmailVerificationCodeController,
  verifyEmailVerificationCode: verifyEmailVerificationCodeController,
  github: {
    signIn: signInGithubController,
    signInCallback: signInGithubCallbackController,
  },
};

export { auth };
