import { verify } from "@node-rs/argon2";

import { AuthenticationError } from "../../../entities/errors/auth.js";
import { type Cookie } from "../../../entities/models/cookie.js";
import { type Session } from "../../../entities/models/session.js";
import { getInjection } from "../../../di/container.js";

export async function signInUseCase(input: {
  email: string;
  password: string;
}): Promise<{ session: Session; cookie: Cookie }> {
  const authenticationService = getInjection("IAuthenticationService");
  const usersRepository = getInjection("IUsersRepository");

  const existingUser = await usersRepository.getUserByEmail(input.email);

  if (!existingUser) {
    throw new AuthenticationError("Incorrect email or password");
  }

  const validPassword = await verify(
    existingUser.hashedPassword!,
    input.password,
    {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    },
  );

  if (!validPassword) {
    throw new AuthenticationError("Incorrect email or password");
  }

  return await authenticationService.createSession(existingUser);
}
