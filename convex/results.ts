import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveResult = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("results", {
      ...args,
      emailSent: false,
    });
  },
});

export const getResultById = query({
  args: { id: v.id("results") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserResults = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("results")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const updateEmailStatus = mutation({
  args: { resultId: v.id("results") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resultId, { emailSent: true });
  },
});
