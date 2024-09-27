import { z } from "zod";

export const oauthProviderSchema = z.enum(["github"]);

export const oauthAccountSchema = z.object({
  providerId: oauthProviderSchema,
  providerUserId: z.string(),
  userId: z.string(),
});

export type OAuthProvider = z.infer<typeof oauthProviderSchema>;
export type OAuthAccount = z.infer<typeof oauthAccountSchema>;
