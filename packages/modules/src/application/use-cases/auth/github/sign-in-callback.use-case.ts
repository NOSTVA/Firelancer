import { GitHub } from "arctic";
import { getInjection } from "../../../../di/container.js";
import env from "../../../../env.js";
import type { GitHubUser } from "./sign-in.use-case.js";

export async function signInCallbackUseCase(input: {
  code: string;
  state: string;
}) {
  const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);
  const usersRepository = getInjection("IUsersRepository");
  const oauthRepository = getInjection("IOAuthRepository");
  const authenticationService = getInjection("IAuthenticationService");
  const transaction = getInjection("ITransaction");

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
    return await authenticationService.createSession(existingUser);
  }

  // register new user
  const userId = authenticationService.generateUserId();

  const newUser = await transaction.create(async (tx) => {
    const newUser = await usersRepository.createUser(
      {
        id: userId,
        email: null,
        emailVerified: false,
        username: githubUser.login,
        hashedPassword: null,
      },
      tx,
    );

    await oauthRepository.createAccount(
      {
        providerId: "github",
        providerUserId: githubUser.id,
        userId: userId,
      },
      tx,
    );

    return newUser;
  });

  return await authenticationService.createSession(newUser);
}
