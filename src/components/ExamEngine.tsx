'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Send, ArrowRight, ArrowLeft, Clock, Timer } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'binary' | 'hex' | 'logic-gate' | 'matching';
  marks: number;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
}

interface ExamEngineProps {
  questions: Question[];
  durationMinutes: number;
  onComplete: (answers: any[]) => void;
}

export default function ExamEngine({ questions, durationMinutes, onComplete }: ExamEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  const currentQuestion = questions[currentStep];

  const finalizeExam = useCallback(() => {
    const results = questions.map(q => {
      const userVal = answers[q.id];
      let isCorrect = false;
      if (q.type === 'multiple-choice' || q.type === 'text' || q.type === 'binary' || q.type === 'hex') {
        isCorrect = String(userVal || '').trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      } else if (q.type === 'logic-gate') {
         isCorrect = JSON.stringify(userVal) === JSON.stringify(q.correctAnswer);
      }
      return {
        questionId: q.id,
        userAnswer: userVal,
        isCorrect,
        marksAwarded: isCorrect ? q.marks : 0,
      };
    });
    onComplete(results);
  }, [questions, answers, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finalizeExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finalizeExam]);

  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finalizeExam();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const isLowTime = timeLeft < 300; // less than 5 minutes

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Sticky Header with Timer */}
      <div className="sticky top-4 z-20 flex justify-between items-center p-4 bg-[#1a1a23]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Timer className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Time Remaining</div>
            <div className={`text-xl font-mono font-bold tabular-nums ${isLowTime ? 'text-red-500 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Progress</div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-sm text-white/70 italic">Question {currentStep + 1}/{questions.length}</span>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative">
        <div className="mb-8 flex justify-between items-center text-white/70">
          <span className="font-mono text-sm">Task {currentStep + 1}</span>
          <span className="font-mono text-sm px-3 py-1 bg-white/5 rounded-full border border-white/10">{currentQuestion.marks} Marks Available</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow flex flex-col"
          >
            <h2 className="text-2xl font-semibold mb-8 text-white leading-relaxed">{currentQuestion.text}</h2>

            <div className="flex-grow space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerChange(currentQuestion.id, opt)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group relative ${
                    answers[currentQuestion.id] === opt 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm transition-colors ${
                      answers[currentQuestion.id] === opt ? 'bg-white/20' : 'bg-white/5'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-lg font-medium">{opt}</span>
                  </div>
                </button>
              ))}

              {(currentQuestion.type === 'text' || currentQuestion.type === 'binary' || currentQuestion.type === 'hex') && (
                <div className="space-y-4">
                  <textarea
                    placeholder="Provide your solution here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[160px] resize-none transition-all"
                  />
                  {currentQuestion.type !== 'text' && (
                    <div className="flex gap-2">
                       <span className="text-xs text-white/40 italic font-mono uppercase">Hint: Type in {currentQuestion.type} format</span>
                    </div>
                  )}
                </div>
              )}

              {currentQuestion.type === 'logic-gate' && (
                <div className="p-8 bg-black/20 rounded-2xl border border-white/10">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 font-mono text-white/40 uppercase tracking-widest text-xs border-b border-white/10">Input Group</th>
                        <th className="p-4 font-mono text-white/40 uppercase tracking-widest text-xs border-b border-white/10">Output Logic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(currentQuestion.correctAnswer).map((val) => (
                        <tr key={val} className="group">
                          <td className="p-4 border-b border-white/5">
                            <div className="inline-block p-3 bg-white/5 rounded-xl text-white font-mono min-w-[80px]">{val}</div>
                          </td>
                          <td className="p-4 border-b border-white/5">
                            <input
                              type="text"
                              maxLength={1}
                              value={(answers[currentQuestion.id] || {})[val] || ''}
                              onChange={(e) => {
                                const prev = answers[currentQuestion.id] || {};
                                handleAnswerChange(currentQuestion.id, { ...prev, [val]: e.target.value });
                              }}
                              className="w-20 p-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-xl"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-0 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" /> Previous Task
          </button>
          
          <div className="hidden sm:block text-white/20 font-mono text-xs uppercase tracking-tighter">
            Progress Saved Automatically
          </div>

          <button
            onClick={nextStep}
            className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold transition-all shadow-xl active:scale-95 ${
              currentStep === questions.length - 1 
              ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/20' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {currentStep === questions.length - 1 ? (
              <>Submit Final Paper <Send className="w-5 h-5" /></>
            ) : (
              <>Continue <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

