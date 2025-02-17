import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./db/schema";

export const createDbClient = (
  databaseUrl: string,
  authToken?: string | undefined
) => {
  const client = neon(databaseUrl, {
    authToken,
  });

  return drizzle(client, {
    schema,
    casing: "snake_case",
  });
};
