import { hash } from "@node-rs/argon2";
import { randomUUID } from "crypto";
import { getInjection } from "../../../di/container.js";
import { AuthenticationError } from "../../../entities/errors/auth.js";
import { type Cookie } from "../../../entities/models/cookie.js";
import { type Session } from "../../../entities/models/session.js";
import { type User } from "../../../entities/models/user.js";

const usersRepository = getInjection("IUsersRepository");
const authService = getInjection("IAuthenticationService");
const accountsRepository = getInjection("IAccountsRepository");
const transaction = getInjection("ITransaction");

export async function signUpUseCase(input: {
  username: string;
  email: string;
  password: string;
}): Promise<{
  session: Session;
  cookie: Cookie;
  user: Pick<User, "id" | "username" | "email" | "emailVerified">;
}> {
  const user = await usersRepository.getUserByEmail(input.email);
  if (user) {
    throw new AuthenticationError("Email already in use");
  }

  const passwordHash = await hash(input.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const newUser = await transaction.create(async (tx) => {
    const user = await usersRepository.createUser(
      {
        id: authService.generateUserId(),
        email: input.email,
        emailVerified: false,
        username: input.username,
        hashedPassword: passwordHash,
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

    return user;
  });

  const { cookie, session } = await authService.createSession(newUser);

  return {
    cookie,
    session,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
    },
  };
}
