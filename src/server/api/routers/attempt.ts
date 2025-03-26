import { z } from "zod";
import { createTRPCRouter, studentProcedure } from "@/server/api/trpc";
import { quizAttempts, responses, quizzes, quizClasses, classStudents } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";

export const attemptRouter = createTRPCRouter({
  startQuizAttempt: studentProcedure
    .input(z.object({ quizId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { quizId } = input;
      const studentId = ctx.session.user.id;

      const quizAccess = await db
        .select()
        .from(quizzes)
        .innerJoin(quizClasses, eq(quizzes.id, quizClasses.quizId))
        .innerJoin(classStudents, eq(quizClasses.classId, classStudents.classId))
        .where(and(eq(quizzes.id, quizId), eq(classStudents.studentId, studentId)))
        .limit(1);
      if (!quizAccess[0]) {
        throw new Error("Quiz not found or not accessible to you");
      }

      const now = new Date();
      const questionOrder = "1,2,3"; // Placeholder: implement actual randomization logic
      const newAttempt = await db
        .insert(quizAttempts)
        .values({
          quizId,
          studentId,
          startTime: now,
          endTime: new Date(now.getTime() + 3600000), // 1 hour default
          status: "in_progress",
          questionOrder,
          score: 0,
        })
        .returning({ id: quizAttempts.id }) as { id: number }[];

      const attemptId = newAttempt[0]?.id;
      if (!attemptId) {
        throw new Error("Failed to start quiz attempt");
      }

      return { attemptId };
    }),

  submitResponse: studentProcedure
    .input(
      z.object({
        attemptId: z.number(),
        questionId: z.number(),
        selectedOption: z.string().length(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { attemptId, questionId, selectedOption } = input;
      const studentId = ctx.session.user.id;

      const attempt = await db
        .select()
        .from(quizAttempts)
        .where(and(eq(quizAttempts.id, attemptId), eq(quizAttempts.studentId, studentId)))
        .limit(1);
      if (!attempt[0] || attempt[0].status !== "in_progress") {
        throw new Error("Invalid or completed attempt");
      }

      await db.insert(responses).values({
        attemptId,
        questionId,
        selectedOption,
      });

      return { attemptId, questionId };
    }),

//   finishAttempt: studentProcedure
//     .input(z.object({ attemptId: z.number() }))
//     .mutation(async ({ input, ctx }) => {
//       const { attemptId } = input;
//       const studentId = ctx.session.user.id;

//       const attempt = await db
//         .select()
//         .from(quizAttempts)
//         .where(and(eq(quizAttempts.id, attemptId), eq(quizAttempts.studentId, studentId)))
//         .limit(1);
//       if (!attempt[0] || attempt[0].status !== "in_progress") {
//         throw new Error("Invalid or already completed attempt");
//       }

//       // Calculate score (simplified example)
//       const responsesData = await db
//         .select()
//         .from(responses)
//         .where(eq(responses.attemptId, attemptId));
//       let score = 0;
//       // Add scoring logic here based on correct answers

//       await db
//         .update(quizAttempts)
//         .set({ status: "completed", score, endTime: new Date() })
//         .where(eq(quizAttempts.id, attemptId));

//       return { attemptId, score };
//     }),

  getAttemptHistory: studentProcedure.query(async ({ ctx }) => {
    const studentId = ctx.session.user.id;
    return await db
      .select({
        id: quizAttempts.id,
        quizId: quizAttempts.quizId,
        startTime: quizAttempts.startTime,
        endTime: quizAttempts.endTime,
        score: quizAttempts.score,
        status: quizAttempts.status,
      })
      .from(quizAttempts)
      .where(eq(quizAttempts.studentId, studentId));
  }),
});