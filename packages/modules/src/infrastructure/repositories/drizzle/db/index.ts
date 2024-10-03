import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import env from "../../../../env.js";
import { log } from "../../../../log.js";
import * as schema from "../schema/index.js";

const pool = new Pool({
  connectionString: env.POSTGRES_DATABASE_URL,
  ssl: env.ENV === "production"
});

pool.on("connect", () => {
  log.info("Connected to PostgreSQL database.");
});

const db = drizzle(pool, { schema, logger: false });

const luciaAdapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users
);

export { db, luciaAdapter };
export type DrizzleDatabase = typeof db;
