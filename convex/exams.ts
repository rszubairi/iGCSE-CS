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
    // We can have multiple exams or just one robust "Standard Practice Exam"
    const existing = await ctx.db.query("exams").filter(q => q.eq(q.field("title"), "IGCSE Computer Science - Paper 1 (Full)")).first();
    if (existing) return;

    await ctx.db.insert("exams", {
      title: "IGCSE Computer Science - Paper 1 (Full)",
      description: "A comprehensive practice exam covering the full Paper 1 (Theory) syllabus including Data Representation, CPU Architecture, Communication, and Security.",
      totalMarks: 75,
      durationMinutes: 105,
      questions: [
        {
          id: "q1",
          text: "Explain the purpose of the Central Processing Unit (CPU) in a computer system.",
          type: "text",
          marks: 2,
          correctAnswer: "To process data and instructions that make the system operate. It carries out the fetch-decode-execute cycle.",
          explanation: "The CPU is the 'brain' of the computer, performing all data processing.",
        },
        {
          id: "q2",
          text: "Convert the 8-bit binary number 01001011 to denary.",
          type: "binary",
          marks: 1,
          correctAnswer: "75",
          explanation: "64 + 8 + 2 + 1 = 75",
        },
        {
          id: "q3",
          text: "Convert the denary number 38 into an 8-bit binary register.",
          type: "binary",
          marks: 1,
          correctAnswer: "00100110",
          explanation: "32 + 4 + 2 = 38",
        },
        {
          id: "q4",
          text: "Convert the hexadecimal value 3A to denary.",
          type: "hex",
          marks: 1,
          correctAnswer: "58",
          explanation: "3 * 16 + 10 = 58",
        },
        {
          id: "q5",
          text: "Convert the denary number 165 to hexadecimal.",
          type: "hex",
          marks: 1,
          correctAnswer: "A5",
          explanation: "165 / 16 = 10 (A), remainder 5. So A5.",
        },
        {
          id: "q6",
          text: "State the name of the logic gate that outputs 0 ONLY when both inputs are 1.",
          type: "multiple-choice",
          marks: 1,
          options: ["AND", "OR", "NAND", "NOR", "XOR"],
          correctAnswer: "NAND",
          explanation: "A NAND gate is a NOT-AND gate, so it inverts the AND output.",
        },
        {
          id: "q7",
          text: "Complete the truth table for an XOR gate with two inputs (A, B).",
          type: "logic-gate",
          marks: 4,
          correctAnswer: { "0,0": "0", "0,1": "1", "1,0": "1", "1,1": "0" },
          explanation: "XOR outputs 1 only when the inputs are different.",
        },
        {
          id: "q8",
          text: "Identify three internal components of a Central Processing Unit (CPU).",
          type: "text",
          marks: 3,
          correctAnswer: "ALU (Arithmetic Logic Unit), CU (Control Unit), Registers (e.g. PC, MAR, MDR, ACC)",
          explanation: "The Von Neumann architecture defines these core components.",
        },
        {
          id: "q9",
          text: "Explain the role of the Program Counter (PC) in the fetch-execute cycle.",
          type: "text",
          marks: 2,
          correctAnswer: "It stores the memory address of the next instruction to be fetched. It is incremented after each fetch.",
          explanation: "The PC ensures instructions are executed in the correct sequence.",
        },
        {
          id: "q10",
          text: "Identify two input devices and one output device that would be used in an automated home security system.",
          type: "text",
          marks: 3,
          correctAnswer: "Input: PIR sensor, Microphone, Camera. Output: Siren (Speaker), Flashing Lights, Text message notification.",
          explanation: "Sensors are inputs, actuators/notifications are outputs.",
        },
        {
          id: "q11",
          text: "Define Half-duplex data transmission.",
          type: "multiple-choice",
          marks: 1,
          options: [
            "Data travels in one direction only.",
            "Data travels in both directions simultaneously.",
            "Data travels in both directions but not at the same time.",
            "Data is sent using multiple wires at once."
          ],
          correctAnswer: "Data travels in both directions but not at the same time.",
          explanation: "Half-duplex allows two-way communication but one at a time (e.g. walkie-talkie).",
        },
        {
          id: "q12",
          text: "State two advantages of Serial data transmission over Parallel data transmission.",
          type: "text",
          marks: 2,
          correctAnswer: "Less risk of data skewing; Less interference; Cheaper cabling for long distances; More reliable over distance.",
          explanation: "Serial is better for distance, Parallel for short high-speed internal links.",
        },
        {
          id: "q13",
          text: "Explain the difference between RAM and ROM in terms of volatility and purpose.",
          type: "text",
          marks: 4,
          correctAnswer: "RAM is volatile (lost on power off) and used to store currently running programs/data. ROM is non-volatile and used to store boot instructions (BIOS).",
          explanation: "Volatility is the key technical difference.",
        },
        {
          id: "q14",
          text: "Describe how a Firewall helps protect a network.",
          type: "text",
          marks: 3,
          correctAnswer: "It monitors incoming and outgoing traffic and filters it based on a set of security rules. It can block unauthorized access and malicious packets.",
          explanation: "Firewalls act as a barrier between a local network and the internet.",
        },
        {
          id: "q15",
          text: "Distinguish between phishing and pharming.",
          type: "text",
          marks: 4,
          correctAnswer: "Phishing uses fake emails containing links to fraudulent websites. Pharming redirects a user to a fake website by poisoning DNS or installing malware, even if the correct URL is typed.",
          explanation: "Phishing is social engineering via email; Pharming is more technical redirection.",
        },
        {
          id: "q16",
          text: "Explain one benefit of using a Solid State Drive (SSD) instead of a Hard Disk Drive (HDD).",
          type: "text",
          marks: 2,
          correctAnswer: "Faster read/write speeds; No moving parts so more durable; Uses less power; Silent operation.",
          explanation: "SSDs use flash memory which provides significant speed and durability gains.",
        },
        {
          id: "q17",
          text: "Identify symbols for the following logic gates: AND, OR, NOT, XOR. (Note: In this exam, please describe the shape of the AND gate).",
          type: "multiple-choice",
          marks: 1,
          options: ["D-shaped", "Arrow-head shaped", "Triangle with a circle", "Rectangle"],
          correctAnswer: "D-shaped",
        },
        {
          id: "q18",
          text: "Calculate the value of 10 MiB in KiB.",
          type: "text",
          marks: 1,
          correctAnswer: "10240",
          explanation: "1 MiB = 1024 KiB. So 10 * 1024 = 10240 KiB.",
        },
        {
          id: "q19",
          text: "What is the purpose of an IP address?",
          type: "text",
          marks: 2,
          correctAnswer: "To uniquely identify a device on a network so that data can be routed to it correctly.",
          explanation: "IP stands for Internet Protocol.",
        },
        {
          id: "q20",
          text: "Explain the concept of 'Lossy compression' and when it might be used.",
          type: "text",
          marks: 3,
          correctAnswer: "Lossy compression removes some data permanently to reduce file size. It is typically used for images (JPEG), audio (MP3), and video where human perception can't easily notice the missing detail.",
          explanation: "The key is that data is lost forever, but file size is much smaller.",
        }
      ],
    });
  },
});
