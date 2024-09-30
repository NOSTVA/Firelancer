import { log } from "./log.js";

async function main() {}

main().catch((err) => {
  log.fatal(err);
  process.exit(0);
});
