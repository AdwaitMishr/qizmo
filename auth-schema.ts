import { pgTable, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
// Remove the references to each other in the initial definition
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    // New attributes
    attendedTests: jsonb('attended_tests'),
    isTeacher: boolean('is_teacher').default(false),
    teacherId: text('teacher_id')
});

export const teacher = pgTable("teacher", {
    id: text("id").primaryKey(),
    userId: text('user_id').notNull(),
    department: text('department'),
    specialization: text('specialization'),
    createdClasses: jsonb('created_classes'),
    createdQuizzes: jsonb('created_quizzes'),
    quizzesConducted: jsonb('quizzes_conducted'),
    assignedCourses: jsonb('assigned_courses'),
    bio: text('bio'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

// After initial definitions, add foreign key constraints
export const userRelations = relations(user, ({ one }) => ({
    teacher: one(teacher, {
        fields: [user.teacherId],
        references: [teacher.id]
    })
}));

export const teacherRelations = relations(teacher, ({ one }) => ({
    user: one(user, {
        fields: [teacher.userId],
        references: [user.id]
    })
}));

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull()
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});