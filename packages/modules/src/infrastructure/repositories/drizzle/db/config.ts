import env from "../../../../env.js";

export default {
  dialect: "postgresql",
  schema: "./dist/infrastructure/repositories/drizzle/schema/index.js",
  out: "./migrations",
  dbCredentials: {
    url: env.POSTGRES_DATABASE_URL
  }
};
