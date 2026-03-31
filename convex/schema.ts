import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  exams: defineTable({
    title: v.string(),
    description: v.string(),
    totalMarks: v.number(),
    durationMinutes: v.number(),
    questions: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        type: v.union(
          v.literal("multiple-choice"),
          v.literal("text"),
          v.literal("binary"),
          v.literal("hex"),
          v.literal("logic-gate"),
          v.literal("matching")
        ),
        marks: v.number(),
        options: v.optional(v.array(v.string())), // for multiple-choice
        correctAnswer: v.any(), // can be string, array of strings, or object for logic gates
        explanation: v.optional(v.string()),
      })
    ),
  }),
  results: defineTable({
    userId: v.string(),
    userName: v.string(),
    userEmail: v.string(),
    examId: v.id("exams"),
    examTitle: v.string(),
    score: v.number(),
    totalMarks: v.number(),
    answers: v.array(
      v.object({
        questionId: v.string(),
        userAnswer: v.any(),
        isCorrect: v.boolean(),
        marksAwarded: v.number(),
        feedback: v.optional(v.string()),
      })
    ),
    completedAt: v.number(),
    emailSent: v.boolean(),
  }).index("by_userId", ["userId"]),
});
