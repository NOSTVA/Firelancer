import { signInUseCase } from "../../../../application/use-cases/auth/github/sign-in.use-case.js";

export async function signInGithubController(): Promise<{ url: string }> {
  const { url } = await signInUseCase();
  return { url: url.toString() };
}
