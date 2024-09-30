import { z } from "zod";

export const OAUTH_PROVIDERS = ["github"] as const;

export const oauthProviderSchema = z.enum(OAUTH_PROVIDERS);

export const oauthAccountSchema = z.object({
  providerId: oauthProviderSchema,
  providerUserId: z.string(),
  userId: z.string(),
});

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type OAuthAccount = z.infer<typeof oauthAccountSchema>;
