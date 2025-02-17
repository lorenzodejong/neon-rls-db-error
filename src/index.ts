import { Hono } from "hono";
import { createDbClient } from "./db-client";
import { and, eq } from "drizzle-orm";

import * as schema from "./db/schema";

export type Env = {
  Bindings: {
    DATABASE_URL: string;
    AUTHENTICATED_DATABASE_URL: string;
    JWT_TOKEN: string;
  };
};

const app = new Hono<Env>();

// doesn't really matter what user id we use here
const EXAMPLE_USER_ID = "1";

app.get("/", async (c) => {
  const db = createDbClient(c.env.AUTHENTICATED_DATABASE_URL, c.env.JWT_TOKEN);

  const [schedules, organizations] = await Promise.all([
    db.select().from(schema.schedules),
    db
      .select({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
        createdAt: schema.organizations.createdAt,
        role: schema.organizationMembers.role,
      })
      .from(schema.organizations)
      .innerJoin(
        schema.organizationMembers,
        and(
          eq(
            schema.organizationMembers.organizationId,
            schema.organizations.id
          ),
          eq(schema.organizationMembers.userId, EXAMPLE_USER_ID)
        )
      )
      .orderBy(schema.organizations.createdAt),
  ]);

  return c.json({
    data: {
      schedules,
      organizations,
    },
  });
});

export default app;
