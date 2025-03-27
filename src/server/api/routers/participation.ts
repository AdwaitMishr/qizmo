import { z } from "zod";

import { createTRPCRouter, publicProcedure, studentProcedure, teacherProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { quizzes } from "@/server/db/schema";
import { responseSchema } from "@/server/api/routers/quiz";
import { quizAttempts } from "@/server/db/schema";


export const participationRouter = createTRPCRouter({
  getQuizByCode: studentProcedure
    .input(z.object({ code: z.string().length(8) }))
    .query(async ({ input }) => {
      const { code } = input;

      const quiz = await db
        .select({
          id: quizzes.id,
          name: quizzes.name,
          questions: quizzes.questions,
          durationMinutes: quizzes.durationMinutes,
          active: quizzes.active,
        })
        .from(quizzes)
        .where(eq(quizzes.code, code))
        .limit(1);

      if (!quiz[0]) {
        throw new Error("Quiz not found");
      }
      if (!quiz[0].active) {
        throw new Error("Quiz is not active");
      }

      return quiz[0];
    }),
    submitQuizAttempt: studentProcedure
    .input(
      z.object({
        quizId: z.number(),
        nickname: z.string().min(1).max(50),
        responses: z.array(responseSchema),
      })
    )
    .mutation(async ({ input }) => {
      const { quizId, nickname, responses } = input;

      // Verify quiz exists and is active
      const quiz = await db
        .select({ questions: quizzes.questions })
        .from(quizzes)
        .where(and(eq(quizzes.id, quizId), eq(quizzes.active, true)))
        .limit(1);
      if (!quiz[0]) {
        throw new Error("Quiz not found or not active");
      }

      // Calculate score
      const quizQuestions = quiz[0].questions as Array<{
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        points: number;
      }>;
      let score = 0;
      responses.forEach((response) => {
        const question = quizQuestions[response.questionIndex];
        if (question && response.selectedOption === question.correctOption) {
          score += question.points;
        }
      });

      const newAttempt = await db
        .insert(quizAttempts)
        .values({
          quizId,
          nickname,
          responses, // JSONB accepts JS object
          score,
          endTime: new Date(), // Set end time on submission
        })
        .returning({ id: quizAttempts.id, score: quizAttempts.score }) as {
          id: number;
          score: number;
        }[];

      if (!newAttempt[0]) {
        throw new Error("Failed to submit quiz attempt");
      }

      return { attemptId: newAttempt[0].id, score: newAttempt[0].score };
    }),
    getParticipants: teacherProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      const { quizId } = input;

      const quiz = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .limit(1);
      if (!quiz[0]) {
        throw new Error("Quiz not found");
      }

      return await db
        .select({
          nickname: quizAttempts.nickname,
          score: quizAttempts.score,
          startTime: quizAttempts.startTime,
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.quizId, quizId));
    }),

    

});






// participationRouter = createTRPCRouter({
//     // Join a quiz by code
//     getQuizByCode: publicProcedure
//       .input(z.object({ code: z.string().length(8) }))
//       .query(async ({ input }) => {
//         const { code } = input;
  
//         const quiz = await db
//           .select({
//             id: quizzes.id,
//             name: quizzes.name,
//             questions: quizzes.questions,
//             durationMinutes: quizzes.durationMinutes,
//             active: quizzes.active,
//           })
//           .from(quizzes)
//           .where(eq(quizzes.code, code))
//           .limit(1);
  
//         if (!quiz[0]) {
//           throw new Error("Quiz not found");
//         }
//         if (!quiz[0].active) {
//           throw new Error("Quiz is not active");
//         }
  
//         return quiz[0];
//       }),
  
//     // Submit a quiz attempt
//     submitQuizAttempt: publicProcedure
//       .input(
//         z.object({
//           quizId: z.number(),
//           nickname: z.string().min(1).max(50),
//           responses: z.array(responseSchema),
//         })
//       )
//       .mutation(async ({ input }) => {
//         const { quizId, nickname, responses } = input;
  
//         // Verify quiz exists and is active
//         const quiz = await db
//           .select({ questions: quizzes.questions })
//           .from(quizzes)
//           .where(and(eq(quizzes.id, quizId), eq(quizzes.active, true)))
//           .limit(1);
//         if (!quiz[0]) {
//           throw new Error("Quiz not found or not active");
//         }
  
//         // Calculate score
//         const quizQuestions = quiz[0].questions as Array<{
//           text: string;
//           optionA: string;
//           optionB: string;
//           optionC: string;
//           optionD: string;
//           correctOption: string;
//           points: number;
//         }>;
//         let score = 0;
//         responses.forEach((response) => {
//           const question = quizQuestions[response.questionIndex];
//           if (question && response.selectedOption === question.correctOption) {
//             score += question.points;
//           }
//         });
  
//         const newAttempt = await db
//           .insert(quizAttempts)
//           .values({
//             quizId,
//             nickname,
//             responses, // JSONB accepts JS object
//             score,
//             endTime: new Date(), // Set end time on submission
//           })
//           .returning({ id: quizAttempts.id, score: quizAttempts.score }) as {
//             id: number;
//             score: number;
//           }[];
  
//         if (!newAttempt[0]) {
//           throw new Error("Failed to submit quiz attempt");
//         }
  
//         return { attemptId: newAttempt[0].id, score: newAttempt[0].score };
//       }),
  
//     // Get current participants (for real-time updates, optional)
//     getParticipants: publicProcedure
//       .input(z.object({ quizId: z.number() }))
//       .query(async ({ input }) => {
//         const { quizId } = input;
  
//         const quiz = await db
//           .select()
//           .from(quizzes)
//           .where(eq(quizzes.id, quizId))
//           .limit(1);
//         if (!quiz[0]) {
//           throw new Error("Quiz not found");
//         }
  
//         return await db
//           .select({
//             nickname: quizAttempts.nickname,
//             score: quizAttempts.score,
//             startTime: quizAttempts.startTime,
//           })
//           .from(quizAttempts)
//           .where(eq(quizAttempts.quizId, quizId));
//       }),
//   });
  