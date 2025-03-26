import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "@/server/api/trpc";
import { questionBanks, questions, quizQuestions, quizzes } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";

export const questionRouter = createTRPCRouter({
  createQuestionBank: teacherProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description } = input;
      const createdBy = ctx.session.user.id;

      const newBank = await db
        .insert(questionBanks)
        .values({ name, description, createdBy })
        .returning({ id: questionBanks.id }) as { id: number }[];

      const bankId = newBank[0]?.id;
      if (!bankId) {
        throw new Error("Failed to create question bank");
      }

      return { bankId };
    }),

  addQuestionToBank: teacherProcedure
    .input(
      z.object({
        questionBankId: z.number(),
        text: z.string().min(1),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
        correctOption: z.string().length(1),
        points: z.number().default(1),
        difficulty: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        questionBankId,
        text,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        points,
        difficulty,
      } = input;
      const userId = ctx.session.user.id;

      const bank = await db
        .select()
        .from(questionBanks)
        .where(and(eq(questionBanks.id, questionBankId), eq(questionBanks.createdBy, userId)))
        .limit(1);
      if (!bank[0]) {
        throw new Error("Question bank not found or not owned by you");
      }

      const newQuestion = await db
        .insert(questions)
        .values({
          text,
          optionA,
          optionB,
          optionC,
          optionD,
          correctOption,
          points,
          questionBankId,
          difficulty: difficulty ?? "medium",
        })
        .returning({ id: questions.id }) as { id: number }[];

      const questionId = newQuestion[0]?.id;
      if (!questionId) {
        throw new Error("Failed to create question");
      }

      return { questionId, questionBankId };
    }),

  linkQuestionToQuiz: teacherProcedure
    .input(z.object({ quizId: z.number(), questionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { quizId, questionId } = input;
      const userId = ctx.session.user.id;

      const quiz = await db
        .select()
        .from(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.ownerId, userId)))
        .limit(1);
      if (!quiz[0]) {
        throw new Error("Quiz not found or not owned by you");
      }

      await db.insert(quizQuestions).values({ quizId, questionId }).onConflictDoNothing();
      return { quizId, questionId };
    }),

  getQuestionsForQuiz: teacherProcedure
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

      return await db
        .select({
          id: questions.id,
          text: questions.text,
          optionA: questions.optionA,
          optionB: questions.optionB,
          optionC: questions.optionC,
          optionD: questions.optionD,
          correctOption: questions.correctOption,
          points: questions.points,
        })
        .from(questions)
        .innerJoin(quizQuestions, eq(questions.id, quizQuestions.questionId))
        .where(eq(quizQuestions.quizId, quizId));
    }),
});