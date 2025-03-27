import { createTRPCRouter } from "../trpc";
import { teacherProcedure } from "../trpc";
import { z } from "zod";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { quizzes, quizAttempts } from "@/server/db/schema";

export const analyticsRouter = createTRPCRouter({
  getQuizAnalytics: teacherProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      const { quizId } = input;

      // ✅ Fetch the quiz info
      const quiz = await db
        .select({
          id: quizzes.id,
          name: quizzes.name,
          questions: quizzes.questions,
          durationMinutes: quizzes.durationMinutes,
          active: quizzes.active,
        })
        .from(quizzes)
        .where(eq(quizzes.id, quizId))
        .limit(1);

      if (!quiz[0]) {
        throw new Error("Quiz not found");
      }

      // ✅ Fetch all quiz attempts for the specified quiz
      const attempts = await db
        .select({
          nickname: quizAttempts.nickname,
          score: quizAttempts.score,
          startTime: quizAttempts.startTime,
          endTime: quizAttempts.endTime
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.quizId, quizId));

      if (attempts.length === 0) {
        return {
          quiz: quiz[0],
          analytics: {
            avgScore: 0,
            highestScore: 0,
            lowestScore: 0,
            stdDeviation: 0,
            avgTimeTaken: "N/A",
            totalAttempts: 0,
          },
          attempts: [],
        };
      }

      // ✅ Calculate analytics
      const scores = attempts.map((a) => a.score);
      const totalScores = scores.reduce((acc, val) => acc + val, 0);
      const avgScore = scores.length ? totalScores / scores.length : 0;

      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);

      // Standard deviation calculation
      const mean = avgScore;
      const variance =
        scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
      const stdDeviation = Math.sqrt(variance);

      // ✅ Calculate average time taken
      const totalTimeTaken = attempts
        .map((a) =>
          a.endTime && a.startTime
            ? (new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / 1000
            : 0
        )
        .filter((time) => time > 0);

      const avgTimeTakenSec = totalTimeTaken.length
        ? totalTimeTaken.reduce((acc, val) => acc + val, 0) / totalTimeTaken.length
        : 0;

      const avgTimeTaken = avgTimeTakenSec
        ? new Date(avgTimeTakenSec * 1000).toISOString().substr(11, 8)
        : "N/A";

      return {
        quiz: quiz[0],
        analytics: {
          avgScore: avgScore.toFixed(2),
          highestScore,
          lowestScore,
          stdDeviation: stdDeviation.toFixed(2),
          avgTimeTaken,
          totalAttempts: attempts.length,
        },
        attempts,
      };
    }),
});
