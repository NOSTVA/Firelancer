import z from "zod";
import { log } from "./log.js";

const envSchema = z.object({
  ENV: z.enum(["production", "development"]).default("development"),
  SESSION_COOKIE: z.string(),
  POSTGRES_DATABASE_URL: z.string().trim().min(1),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  MAIL_HOST: z.string(),
  MAIL_USERNAME: z.string(),
  MAIL_PASSWORD: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  log.error(env.error.issues);
  throw new Error("There is an error with the server environment variables");
}

export default env.data;
