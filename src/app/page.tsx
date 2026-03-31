'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, Mail, BrainCircuit, Play, Sparkles } from 'lucide-react';
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
  id: "sample",
  title: "IGCSE Computer Science - Paper 1 (Sample)",
  description: "A sample collection of questions from Paper 1 (Theory) based on actual IGCSE standards.",
  totalMarks: 7,
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
    },
    {
      id: "q2",
      text: "Convert the Denary number 107 into an 8-bit binary number.",
      type: "binary",
      marks: 1,
      correctAnswer: "01101011",
    },
    {
      id: "q3",
      text: "A processor uses a 12-bit register. What is the largest Hexadecimal value that can be stored?",
      type: "hex",
      marks: 1,
      correctAnswer: "FFF",
    },
    {
      id: "q4",
      text: "Complete the truth table for an AND logic gate.",
      type: "logic-gate",
      marks: 4,
      correctAnswer: { "0,0": "0", "0,1": "0", "1,0": "0", "1,1": "1" },
    }
  ] as Question[],
};

export default function Home() {
  const [gameState, setGameState] = useState<'welcome' | 'exam' | 'result'>('welcome');
  const [user, setUser] = useState({ name: '', email: '' });
  const [results, setResults] = useState<any>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const startExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.name && user.email) {
      setGameState('exam');
    }
  };

  const handleComplete = async (answers: any[]) => {
    const totalScore = answers.reduce((acc, curr) => acc + curr.marksAwarded, 0);
    setResults({
      answers,
      score: totalScore,
      total: SAMPLE_EXAM.totalMarks,
    });
    setGameState('result');

    // In a real app, we'd save to Convex here:
    // await saveResult({ userId: 'anon', ...user, examId: SAMPLE_EXAM.id, score: totalScore, ... })
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
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Candidate Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-white/20"
                      value={user.name}
                      onChange={(e) => setUser({...user, name: e.target.value})}
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
                      onChange={(e) => setUser({...user, email: e.target.value})}
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
              <ExamEngine questions={SAMPLE_EXAM.questions} onComplete={handleComplete} />
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
