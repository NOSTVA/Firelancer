import { GitHub, generateState } from "arctic";
import env from "../../../../env.js";

export interface GitHubUser {
  id: string;
  login: string;
}

export async function signInUseCase(): Promise<{ url: URL; state: string }> {
  const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  return { url, state };
}
