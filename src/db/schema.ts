import { relations, sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import {
  AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// defined in 0001_rls-functions.sql
const authOrganizationMember = (organizationIdColumn: AnyPgColumn) =>
  sql`(is_member_of_organization(${organizationIdColumn}))`;

// defined in 0001_rls-functions.sql
const authTeamMember = (teamIdColumn: AnyPgColumn) =>
  sql`(is_member_of_team(${teamIdColumn}))`;

const id = integer().primaryKey().generatedAlwaysAsIdentity();

const createdAt = timestamp({ withTimezone: true }).notNull().defaultNow();

const updatedAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const organizationRole = pgEnum("organization_role", [
  "member",
  "admin",
]);

export const frequency = pgEnum("schedule_frequency", [
  "yearly",
  "monthly",
  "weekly",
  "daily",
  "hourly",
  "minutely",
  "secondly",
]);

export const teamRole = pgEnum("team_role", ["member", "leader"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const jwks = pgTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const organizations = pgTable(
  "organizations",
  {
    id,
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    createdAt,
    updatedAt,
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authOrganizationMember(table.id),
      modify: false,
    }),
  ]
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id,
    organizationId: integer()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: organizationRole("organization_role").notNull().default("member"),
    createdAt,
    updatedAt,
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: false,
    }),
  ]
);

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
  })
);

export const teams = pgTable(
  "teams",
  {
    id,
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    organizationId: integer()
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    pointsPool: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authTeamMember(table.id),
      modify: false,
    }),
  ]
);

export const teamMembers = pgTable(
  "team_members",
  {
    id,
    teamId: integer()
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: teamRole("team_role").notNull().default("member"),
    points: integer().notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: false,
    }),
  ]
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const schedules = pgTable(
  "schedules",
  {
    id,
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    teamId: integer()
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    frequency: frequency().notNull(),
    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authTeamMember(table.teamId),
      modify: authTeamMember(table.teamId),
    }),
  ]
);
