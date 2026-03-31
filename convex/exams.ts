import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getExams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exams").collect();
  },
});

export const getExamById = query({
  args: { id: v.id("exams") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seedExams = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("exams").collect();
    if (existing.length > 0) return;

    await ctx.db.insert("exams", {
      title: "IGCSE Computer Science - Paper 1 (Sample)",
      description: "A sample collection of questions from Paper 1 (Theory)",
      totalMarks: 75,
      durationMinutes: 105,
      questions: [
        {
          id: "q1",
          text: "Which of the following statements about Assembly Language is correct?",
          type: "multiple-choice",
          marks: 1,
          options: [
            "It is a high-level language that is easy for humans to read.",
            "It is translated into machine code using a compiler.",
            "It is a low-level language that uses mnemonics to represent machine instructions.",
            "It allows for the same code to be run on any type of processor without modification."
          ],
          correctAnswer: "It is a low-level language that uses mnemonics to represent machine instructions.",
          explanation: "Assembly language is a low-level language that uses short mnemonics (like MOV, ADD) which correspond to machine code instructions.",
        },
        {
          id: "q2",
          text: "Convert the Denary number 107 into an 8-bit binary number.",
          type: "binary",
          marks: 1,
          correctAnswer: "01101011",
          explanation: "107 = 64 + 32 + 8 + 2 + 1 = 0*128 + 1*64 + 1*32 + 0*16 + 1*8 + 0*4 + 1*2 + 1*1 = 01101011",
        },
        {
          id: "q3",
          text: "A processor uses a 12-bit register to store values. What is the largest Hexadecimal value that can be stored in this register?",
          type: "hex",
          marks: 1,
          correctAnswer: "FFF",
          explanation: "A 12-bit register can store 3 hexadecimal digits (each hex digit is 4 bits). The largest value for 4 bits is F (15), so for 12 bits, it is FFF.",
        },
        {
          id: "q4",
          text: "Complete the truth table for a NOT logic gate.",
          type: "logic-gate",
          marks: 1,
          correctAnswer: { "0": "1", "1": "0" },
          explanation: "A NOT gate inverts the input: 0 becomes 1, and 1 becomes 0.",
        },
        {
          id: "q5",
          text: "Identify the component of the CPU that is responsible for performing mathematical calculations and logical comparisons.",
          type: "text",
          marks: 1,
          correctAnswer: "ALU",
          explanation: "The Arithmetic Logic Unit (ALU) is responsible for all arithmetic and logic operations in the CPU.",
        }
      ],
    });
  },
});
