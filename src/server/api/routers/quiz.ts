import { z } from "zod";
import { createTRPCRouter, publicProcedure, teacherProcedure } from "@/server/api/trpc";
import { quizzes, quizAttempts, user } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { nanoid } from "nanoid"; // For generating unique codes

// Question schema for validation
const questionSchema = z.object({
  text: z.string().min(1),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOption: z.enum(["a", "b", "c", "d"]),
  points: z.number().int().positive().default(1),
});

// Response schema for validation
export const responseSchema = z.object({
  questionIndex: z.number().int().min(0),
  selectedOption: z.enum(["a", "b", "c", "d"]),
});

// Quiz Router (Teacher-facing)
export const quizRouter = createTRPCRouter({
  // Create a new quiz
  createQuiz: teacherProcedure
    .input(
      z.object({
        name: z.string().min(1),
        questions: z.array(questionSchema),
        durationMinutes: z.number().int().positive().default(15),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, questions, durationMinutes } = input;
      const ownerId = ctx.session.user.id;

      const code = nanoid(8); // Generate unique 8-char code

      const newQuiz = await db
        .insert(quizzes)
        .values({
          name,
          ownerId,
          code,
          questions: questions, // JSONB accepts JS object directly in Drizzle
          durationMinutes,
          active: false,
        })
        .returning({ id: quizzes.id, code: quizzes.code }) as { id: number; code: string }[];

      if (!newQuiz[0]) {
        throw new Error("Failed to create quiz");
      }

      return { quizId: newQuiz[0].id, code: newQuiz[0].code };
    }),

  // Get all quizzes created by the teacher
  getTeacherQuizzes: teacherProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await db
      .select({
        id: quizzes.id,
        name: quizzes.name,
        code: quizzes.code,
        active: quizzes.active,
        durationMinutes: quizzes.durationMinutes,
        createdAt: quizzes.createdAt,
      })
      .from(quizzes)
      .where(eq(quizzes.ownerId, userId));
  }),

  // Activate/deactivate a quiz
  toggleQuizActive: teacherProcedure
    .input(z.object({ quizId: z.number(), active: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const { quizId, active } = input;
      const userId = ctx.session.user.id;

      const quiz = await db
        .select()
        .from(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.ownerId, userId)))
        .limit(1);
      if (!quiz[0]) {
        throw new Error("Quiz not found or not owned by you");
      }

      await db
        .update(quizzes)
        .set({ active })
        .where(eq(quizzes.id, quizId));

      return { quizId, active };
    }),

  // Get quiz details (including questions) for the teacher
  getQuizDetails: teacherProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { quizId } = input;
      const userId = ctx.session.user.id;

      const quiz = await db
        .select()
        .from(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.ownerId, userId)))
        .limit(1);

      if (!quiz[0]) {
        throw new Error("Quiz not found or not owned by you");
      }

      return quiz[0];
    }),

  // Get quiz attempts (results) for a quiz
  getQuizResults: teacherProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { quizId } = input;
      const userId = ctx.session.user.id;

      const quiz = await db
        .select()
        .from(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.ownerId, userId)))
        .limit(1);
      if (!quiz[0]) {
        throw new Error("Quiz not found or not owned by you");
      }

      const attempts = await db
        .select({
          id: quizAttempts.id,
          nickname: quizAttempts.nickname,
          score: quizAttempts.score,
          startTime: quizAttempts.startTime,
          endTime: quizAttempts.endTime,
          responses: quizAttempts.responses,
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.quizId, quizId));

      return { quiz: quiz[0], attempts };
    }),
});
