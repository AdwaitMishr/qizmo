import { z } from "zod";
import { createTRPCRouter, studentProcedure, teacherProcedure } from "@/server/api/trpc";
import { classes, classStudents, quizzes, quizClasses } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";

export const quizRouter = createTRPCRouter({
  getAllQuizzesAssignedToClass: teacherProcedure
    .input(z.object({ classId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { classId } = input;
      const userId = ctx.session.user.id; // Teacher's ID as string

      // Verify the class belongs to the teacher
      const classData = await db
        .select()
        .from(classes)
        .where(and(eq(classes.id, classId), eq(classes.ownerId, userId)));
      if (!classData.length) {
        throw new Error("Class not found or not owned by you");
      }

      const assignedQuizzes = await db
        .select({
          id: quizzes.id,
          name: quizzes.name,
          startTime: quizzes.startTime,
          endTime: quizzes.endTime,
        })
        .from(quizzes)
        .innerJoin(quizClasses, eq(quizzes.id, quizClasses.quizId))
        .where(eq(quizClasses.classId, classId));
      return assignedQuizzes;
    }),

    createClass: teacherProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        studentIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description, studentIds } = input;
      const ownerId = ctx.session.user.id;

      const result = await db.transaction(async (tx) => {
        // Create the class with explicit type
        const newClass = await tx
          .insert(classes)
          .values({
            name,
            description,
            ownerId,
          })
          .returning({ id: classes.id }) as { id: number }[]; // Type assertion

        // Check if newClass has results
        const classId = newClass[0]?.id;
        if (!classId) {
          throw new Error("Failed to create class");
        }

        // Enroll students if provided
        if (studentIds?.length) {
          const enrollments = studentIds.map((studentId) => ({
            classId,
            studentId,
          }));
          await tx.insert(classStudents).values(enrollments);
        }

        return { classId, enrolledStudents: studentIds ?? [] };
      });

      return result;
    }),

  addStudentToClass: studentProcedure
    .input(
      z.object({
        classId: z.number(),
        studentId: z.string(), // Changed to string
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { classId, studentId } = input;
      const userId = ctx.session.user.id; // Teacher's ID as string

      // Validate class exists and is owned by the teacher
      const classData = await db
        .select()
        .from(classes)
        .where(and(eq(classes.id, classId), eq(classes.ownerId, userId)));
      if (!classData.length) {
        throw new Error("Class not found or not owned by you");
      }

      // Enroll the student (unique constraint will prevent duplicates)
      try {
        await db.insert(classStudents).values({ classId, studentId });
      } catch (error) {
          throw new Error("Student is already enrolled in this class");
         // Re-throw other errors
      }

      return { classId, studentId };
    }),

  getAllClassesMadeByTeacher: teacherProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id; // Teacher's ID as string
    const teacherClasses = await db
      .select()
      .from(classes)
      .where(eq(classes.ownerId, userId));
    return teacherClasses;
  }),
});