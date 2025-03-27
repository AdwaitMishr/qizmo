import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  text,
  timestamp,
  boolean,
  integer,
  varchar,
  jsonb,
  uniqueIndex,
  index
} from "drizzle-orm/pg-core";

/**
 * Custom table creator without prefix.
 */
export const createTable = pgTableCreator((name) => `${name}`);

// Authentication Tables (Better Auth)
export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  isTeacher: boolean("is_teacher").default(false).notNull(),
});

export const session = createTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id),
});

export const account = createTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

// Quiz Table with JSONB Questions
export const quizzes = createTable(
  "quizzes",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    ownerId: text("owner_id").notNull().references(() => user.id),
    code: varchar("code", { length: 8 }).notNull().unique(), // Unique join code
    active: boolean("active").notNull().default(false),
    questions: jsonb("questions").notNull(), // JSONB array of questions
    durationMinutes: integer("duration_minutes").default(15),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [uniqueIndex("quiz_code_idx").on(t.code)]
);

// Quiz Attempts (Simplified for anonymous players)
export const quizAttempts = createTable(
  "quiz_attempts",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    quizId: integer("quiz_id").notNull().references(() => quizzes.id),
    nickname: varchar("nickname", { length: 50 }).notNull(), // Player's chosen name
    responses: jsonb("responses").notNull(), // JSONB array of { questionIndex, selectedOption }
    score: integer("score").notNull().default(0),
    startTime: timestamp("start_time", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [index("quiz_attempt_idx").on(t.quizId)]
);