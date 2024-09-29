import { GitHub } from "arctic";
import { randomUUID } from "crypto";
import { getInjection } from "../../../../di/container.js";
import type { GitHubUser } from "./sign-in.use-case.js";
import env from "../../../../env.js";

const usersRepository = getInjection("IUsersRepository");
const oauthRepository = getInjection("IOAuthRepository");
const authService = getInjection("IAuthenticationService");
const accountsRepository = getInjection("IAccountsRepository");
const transaction = getInjection("ITransaction");

export async function signInCallbackUseCase(input: {
  code: string;
  state: string;
}) {
  const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

  const tokens = await github.validateAuthorizationCode(input.code);
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });

  const githubUser: GitHubUser = await githubUserResponse.json();

  const existingUser = await usersRepository.getUserByOAuthProvider(
    "github",
    githubUser.id,
  );

  // login existing user
  if (existingUser) {
    return await authService.createSession(existingUser);
  }

  // register new user
  const newUser = await transaction.create(async (tx) => {
    const user = await usersRepository.createUser(
      {
        id: authService.generateUserId(),
        email: null,
        emailVerified: false,
        username: githubUser.login,
        hashedPassword: null,
      },
      tx,
    );

    await accountsRepository.createAccount(
      {
        id: randomUUID(),
        userId: user.id,
        status: "OPEN",
        creationDate: new Date(),
      },
      tx,
    );

    await oauthRepository.createAccount(
      {
        providerId: "github",
        providerUserId: githubUser.id,
        userId: user.id,
      },
      tx,
    );

    return user;
  });

  return await authService.createSession(newUser);
}
