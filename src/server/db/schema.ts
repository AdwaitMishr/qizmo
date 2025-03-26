import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  text,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Custom table creator without prefix (as per your latest setup).
 */
export const createTable = pgTableCreator((name) => `${name}`);

// Posts Table (optional, likely a leftover example)
export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [index("name_idx").on(t.name)]
);

// Authentication Tables (from Better Auth)
export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  isTeacher: boolean('is_teacher').default(false),
  attendedTests: jsonb('attended_tests'),
  teacherId: text('teacher_id')
});

export const session = createTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
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
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Quiz Platform Tables
export const classes = createTable("classes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: text("owner_id").notNull().references(() => user.id), // Changed to text
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const classStudents = createTable(
  "class_students",
  {
    classId: integer("class_id").notNull().references(() => classes.id),
    studentId: text("student_id").notNull().references(() => user.id), // Changed to text
  },
  (t) => [
    index("class_student_idx").on(t.classId, t.studentId),
    uniqueIndex("unique_class_student").on(t.classId, t.studentId), // Added unique constraint
  ]
);

export const quizzes = createTable("quizzes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  ownerId: text("owner_id").notNull().references(() => user.id), // Changed to text
  active: boolean("active").notNull().default(false),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
  durationMinutes: integer("duration_minutes"), //not pushed yet
});

export const quizClasses = createTable(
  "quiz_classes",
  {
    quizId: integer("quiz_id").notNull().references(() => quizzes.id),
    classId: integer("class_id").notNull().references(() => classes.id),
  },
  (t) => [
    index("quiz_class_idx").on(t.quizId, t.classId),
    uniqueIndex("unique_quiz_class").on(t.quizId, t.classId), // Added unique constraint
  ]
);

export const questionBanks = createTable("question_banks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  createdBy: text("created_by").notNull().references(() => user.id), // Changed to text
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const questions = createTable("questions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  text: varchar("text", { length: 1024 }).notNull(),
  optionA: varchar("option_a", { length: 256 }).notNull(),
  optionB: varchar("option_b", { length: 256 }).notNull(),
  optionC: varchar("option_c", { length: 256 }).notNull(),
  optionD: varchar("option_d", { length: 256 }).notNull(),
  correctOption: varchar("correct_option", { length: 1 }).notNull(),
  points: integer("points").notNull().default(1),
  questionBankId: integer("question_bank_id")
    .notNull()
    .references(() => questionBanks.id),
  difficulty: varchar("difficulty", { length: 10 }).default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  errorMetric: integer("error_metric").default(-1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const quizQuestions = createTable(
  "quiz_questions",
  {
    quizId: integer("quiz_id").notNull().references(() => quizzes.id),
    questionId: integer("question_id").notNull().references(() => questions.id),
  },
  (t) => [
    index("quiz_question_idx").on(t.quizId, t.questionId),
    uniqueIndex("unique_quiz_question").on(t.quizId, t.questionId), // Added unique constraint
  ]
);

export const quizAttempts = createTable(
  "quiz_attempts",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    quizId: integer("quiz_id").notNull().references(() => quizzes.id),
    studentId: text("student_id").notNull().references(() => user.id), // Changed to text
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    questionOrder: varchar("question_order", { length: 1024 }).notNull(),
    score: integer("score").notNull().default(0),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => [
    index("quiz_attempt_idx").on(t.quizId, t.studentId),
    uniqueIndex("unique_quiz_student").on(t.quizId, t.studentId),
  ]
);

export const responses = createTable(
  "responses",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    attemptId: integer("attempt_id").notNull().references(() => quizAttempts.id),
    questionId: integer("question_id").notNull().references(() => questions.id),
    selectedOption: varchar("selected_option", { length: 1 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [index("response_idx").on(t.attemptId, t.questionId)]
);