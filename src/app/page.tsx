'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Mail, BrainCircuit, Play, Sparkles, ExternalLink, Globe, Search, Users, Library } from 'lucide-react';
import ExamEngine from '@/components/ExamEngine';

// Seeded sample for demo if Convex is not ready
interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'binary' | 'hex' | 'logic-gate' | 'matching';
  marks: number;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
}

const SAMPLE_EXAM = {
  id: "igcse_cs_p1_2025",
  title: "IGCSE Computer Science - Paper 1 (Theory)",
  description: "Comprehensive assessment covering Data Representation, CPU Architecture, and Security.",
  totalMarks: 75,
  durationMinutes: 105,
  questions: [
    {
      id: "q1",
      text: "Explain the purpose of the Central Processing Unit (CPU) in a computer system.",
      type: "text",
      marks: 2,
      correctAnswer: "To process data and instructions that make the system operate. It carries out the fetch-decode-execute cycle.",
    },
    {
      id: "q2",
      text: "Convert the 8-bit binary number 01001011 to denary.",
      type: "binary",
      marks: 1,
      correctAnswer: "75",
    },
    {
      id: "q3",
      text: "Convert the denary number 38 into an 8-bit binary register.",
      type: "binary",
      marks: 1,
      correctAnswer: "00100110",
    },
    {
      id: "q4",
      text: "Convert the hexadecimal value 3A to denary.",
      type: "hex",
      marks: 1,
      correctAnswer: "58",
    },
    {
      id: "q5",
      text: "Convert the denary number 165 to hexadecimal.",
      type: "hex",
      marks: 1,
      correctAnswer: "A5",
    },
    {
      id: "q6",
      text: "State the name of the logic gate that outputs 0 ONLY when both inputs are 1.",
      type: "multiple-choice",
      marks: 1,
      options: ["AND", "OR", "NAND", "NOR", "XOR"],
      correctAnswer: "NAND",
    },
    {
      id: "q7",
      text: "Complete the truth table for an XOR gate with two inputs (A, B).",
      type: "logic-gate",
      marks: 4,
      correctAnswer: { "0,0": "0", "0,1": "1", "1,0": "1", "1,1": "0" },
    },
    {
      id: "q8",
      text: "Identify three internal components of a Central Processing Unit (CPU).",
      type: "text",
      marks: 3,
      correctAnswer: "ALU, CU, Registers",
    },
    {
      id: "q9",
      text: "Explain the role of the Program Counter (PC) in the fetch-execute cycle.",
      type: "text",
      marks: 2,
      correctAnswer: "It stores the memory address of the next instruction to be fetched.",
    },
    {
      id: "q10",
      text: "Identify two input devices that would be used in an automated home security system.",
      type: "text",
      marks: 2,
      correctAnswer: "PIR sensor, Camera, Microphone",
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
    },
    {
      id: "q12",
      text: "State two advantages of Serial data transmission over Parallel data transmission.",
      type: "text",
      marks: 2,
      correctAnswer: "Less risk of data skewing; Less interference; Cheaper.",
    },
    {
      id: "q13",
      text: "Explain the difference between RAM and ROM in terms of volatility.",
      type: "text",
      marks: 2,
      correctAnswer: "RAM is volatile (lost on power off) while ROM is non-volatile.",
    },
    {
      id: "q14",
      text: "Describe how a Firewall helps protect a network.",
      type: "text",
      marks: 3,
      correctAnswer: "It monitors and filters incoming/outgoing traffic based on rules.",
    },
    {
      id: "q15",
      text: "Distinguish between phishing and pharming.",
      type: "text",
      marks: 4,
      correctAnswer: "Phishing uses fake emails; Pharming redirects via DNS/malware.",
    },
    {
      id: "q16",
      text: "Explain one benefit of using a Solid State Drive (SSD) instead of a Hard Disk Drive (HDD).",
      type: "text",
      marks: 2,
      correctAnswer: "Faster read/write speeds; More durable; Uses less power.",
    },
    {
      id: "q17",
      text: "Identify the shape of the AND logic gate.",
      type: "multiple-choice",
      marks: 1,
      options: ["D-shaped", "Arrow-head shaped", "Triangle", "Rectangle"],
      correctAnswer: "D-shaped",
    },
    {
      id: "q18",
      text: "Calculate the value of 10 MiB in KiB.",
      type: "text",
      marks: 1,
      correctAnswer: "10240",
    },
    {
      id: "q19",
      text: "What is the primary purpose of an IP address?",
      type: "text",
      marks: 1,
      correctAnswer: "To uniquely identify a device on a network.",
    },
    {
      id: "q20",
      text: "Explain what is meant by 'Lossy compression'.",
      type: "text",
      marks: 2,
      correctAnswer: "Removing data permanently to reduce file size.",
    }
  ] as Question[],
};

export default function Home() {
  const [gameState, setGameState] = useState<'welcome' | 'exam' | 'result'>('welcome');
  const [user, setUser] = useState({ name: '', email: '' });
  const [results, setResults] = useState<any>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const startExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.name && user.email) {
      // Randomly shuffle questions for "Random Exam Generation" simulation
      const shuffled = [...SAMPLE_EXAM.questions].sort(() => 0.5 - Math.random());
      setActiveQuestions(shuffled);
      setGameState('exam');
    }
  };

  const handleComplete = async (answers: any[]) => {
    const totalScore = answers.reduce((acc, curr) => acc + curr.marksAwarded, 0);
    const maxMarks = activeQuestions.reduce((acc, q) => acc + q.marks, 0);
    setResults({
      answers,
      score: totalScore,
      total: maxMarks,
    });
    setGameState('result');
  };

  const sendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const resp = await fetch('/api/send-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userName: user.name,
          examTitle: SAMPLE_EXAM.title,
          score: results.score,
          totalMarks: results.total,
          feedback: `Great job on the exam! Your score was ${results.score}/${results.total}.`
        }),
      });
      if (resp.ok) alert('Results emailed successfully!');
      else alert('Failed to send email. Ensure RESEND_API_KEY is set in your .env.local');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-500/30 selection:text-blue-200">
      <main className="container mx-auto px-4 py-20 relative">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Pathfindr Advertisement Banner */}
        <motion.a
          href="https://thepathfindr.com/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="block mb-12 relative z-10 group"
        >
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-blue-900/40 to-indigo-900/40 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-500 hover:border-indigo-400/50">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[70px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8">
              {/* Left side - Logo & Branding */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/80 text-white uppercase tracking-wider">
                    Beta
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-0.5">Discover</div>
                  <div className="text-2xl font-bold text-white">Pathfindr</div>
                </div>
              </div>

              {/* Center - SVG Illustration with Globe/Path theme */}
              <div className="flex-1 w-full lg:max-w-xl">
                <svg viewBox="0 0 500 100" className="w-full h-auto">
                  {/* Curved path representing educational journey */}
                  <path d="M 30 70 Q 130 20 250 70 T 470 70" stroke="url(#pathGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 30 70 Q 130 20 250 70 T 470 70" stroke="url(#pathGradient)" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeDasharray="6 10" className="animate-pulse" />

                  {/* Opportunity nodes */}
                  <g className="animate-pulse">
                    <circle cx="30" cy="70" r="8" fill="#6366F1" opacity="0.9" />
                    <circle cx="30" cy="70" r="4" fill="#A5B4FC" />
                  </g>
                  <g className="animate-pulse" style={{ animationDelay: '0.3s' } as any}>
                    <circle cx="150" cy="35" r="6" fill="#3B82F6" opacity="0.8" />
                    <circle cx="150" cy="35" r="3" fill="#93C5FD" />
                  </g>
                  <g className="animate-pulse" style={{ animationDelay: '0.6s' } as any}>
                    <circle cx="250" cy="70" r="7" fill="#8B5CF6" opacity="0.9" />
                    <circle cx="250" cy="70" r="3.5" fill="#C4B5FD" />
                  </g>
                  <g className="animate-pulse" style={{ animationDelay: '0.9s' } as any}>
                    <circle cx="360" cy="40" r="6" fill="#06B6D4" opacity="0.8" />
                    <circle cx="360" cy="40" r="3" fill="#67E8F9" />
                  </g>
                  <g className="animate-pulse" style={{ animationDelay: '1.2s' } as any}>
                    <circle cx="470" cy="70" r="8" fill="#10B981" opacity="0.9" />
                    <circle cx="470" cy="70" r="4" fill="#6EE7B7" />
                  </g>

                  {/* Node labels */}
                  <text x="30" y="92" textAnchor="middle" fill="#818CF8" fontSize="8" fontFamily="monospace">Start</text>
                  <text x="150" y="58" textAnchor="middle" fill="#60A5FA" fontSize="7" fontFamily="monospace">Scholarships</text>
                  <text x="250" y="92" textAnchor="middle" fill="#A78BFA" fontSize="7" fontFamily="monospace">Universities</text>
                  <text x="360" y="63" textAnchor="middle" fill="#2DD4BF" fontSize="7" fontFamily="monospace">Internships</text>
                  <text x="470" y="92" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="monospace">Success</text>

                  {/* Floating opportunity icons */}
                  <g opacity="0.4">
                    <circle cx="100" cy="25" r="3" fill="#818CF8">
                      <animate attributeName="cy" values="25;18;25" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="200" cy="50" r="2" fill="#60A5FA">
                      <animate attributeName="cy" values="50;42;50" dur="3.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="310" cy="30" r="2.5" fill="#A78BFA">
                      <animate attributeName="cy" values="30;22;30" dur="4.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="4.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="420" cy="55" r="2" fill="#2DD4BF">
                      <animate attributeName="cy" values="55;47;55" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="25%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="75%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Right side - CTA & Stats */}
              <div className="flex flex-col items-center lg:items-end gap-3 flex-shrink-0">
                <div className="text-sm text-white/70 text-center lg:text-right max-w-xs">
                  Your path to global educational opportunities
                </div>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl text-white font-semibold text-sm group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
                  <Search className="w-4 h-4" />
                  Find Scholarships
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Bottom stats bar */}
            <div className="relative z-10 px-8 pb-5">
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8 text-xs text-white/40 font-mono">
                <div className="flex items-center gap-1.5">
                  <Library className="w-3 h-3" />
                  <span>10,000+ Scholarships</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  <span>5,000+ Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  <span>50+ Countries</span>
                </div>
              </div>
            </div>
          </div>
        </motion.a>

        <header className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 font-mono text-sm mb-6"
          >
            <BrainCircuit className="w-4 h-4" />
            IGCSE COMPUTER SCIENCE EXAM SYSTEM
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            Master Your Theory.
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 max-w-2xl mx-auto"
          >
            Interactive practice exams based on the latest 2025 assessment standards.
            Real-time scoring, instant feedback, and digital reports.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {gameState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <form onSubmit={startExam} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 text-[10px] text-white/30 font-mono uppercase tracking-widest">
                    <span>Duration: 1h 45m</span>
                    <span>Marks: {SAMPLE_EXAM.totalMarks}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Candidate Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-white/20"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-white/20"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Practice Paper
                </button>
              </form>
            </motion.div>
          )}

          {gameState === 'exam' && (
            <motion.div
              key="exam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ExamEngine
                questions={activeQuestions}
                durationMinutes={SAMPLE_EXAM.durationMinutes}
                onComplete={handleComplete}
              />
            </motion.div>
          )}



          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-2xl mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-12 h-12" />
              </div>

              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/10 rounded-full mb-8">
                <Award className="w-12 h-12 text-blue-500" />
              </div>

              <h2 className="text-4xl font-bold mb-2">Exam Completed!</h2>
              <p className="text-white/40 mb-8 font-mono">ID: 0478_SAMPLE_TEST_2025</p>

              <div className="flex justify-center items-end gap-2 mb-12">
                <span className="text-8xl font-black text-blue-500">{results.score}</span>
                <span className="text-3xl font-medium text-white/30 pb-3">/ {results.total}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12 text-left">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/30 uppercase mb-1">Percentage</div>
                  <div className="text-2xl font-bold">{Math.round((results.score / results.total) * 100)}%</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-xs text-white/30 uppercase mb-1">Grade Estimate</div>
                  <div className="text-2xl font-bold text-green-400">A*</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={sendEmail}
                  disabled={isSendingEmail}
                  className="w-full py-4 bg-white text-black hover:bg-white/90 rounded-xl font-bold transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  <Mail className="w-5 h-5" /> {isSendingEmail ? 'Sending...' : 'Email Results to Me'}
                </button>
                <button
                  onClick={() => setGameState('welcome')}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all text-white/70"
                >
                  Try Another Paper
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="container mx-auto px-4 py-12 border-t border-white/5 text-center text-white/20 text-sm font-mono">
        &copy; 2026 iGCSE CS Exam Hub. All Rights Reserved.
      </footer>
    </div>
  );
}
