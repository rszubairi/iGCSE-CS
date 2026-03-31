'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Send, ArrowRight, ArrowLeft } from 'lucide-react';

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
  onComplete: (answers: any[]) => void;
}

export default function ExamEngine({ questions, onComplete }: ExamEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const currentQuestion = questions[currentStep];

  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize
      const results = questions.map(q => {
        const userVal = answers[q.id];
        let isCorrect = false;
        if (q.type === 'multiple-choice' || q.type === 'text' || q.type === 'binary' || q.type === 'hex') {
          isCorrect = String(userVal).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
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
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
      <div className="mb-8 flex justify-between items-center text-white/70">
        <span className="font-mono text-sm">Question {currentStep + 1} of {questions.length}</span>
        <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-500"
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-sm">{currentQuestion.marks} Mark{currentQuestion.marks > 1 ? 's' : ''}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-grow flex flex-col"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">{currentQuestion.text}</h2>

          <div className="flex-grow space-y-4">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswerChange(currentQuestion.id, opt)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  answers[currentQuestion.id] === opt 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono opacity-50">{String.fromCharCode(65 + i)})</span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}

            {(currentQuestion.type === 'text' || currentQuestion.type === 'binary' || currentQuestion.type === 'hex') && (
              <input
                type="text"
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            )}

            {currentQuestion.type === 'logic-gate' && (
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div className="font-mono text-white/50 text-center">Input</div>
                <div className="font-mono text-white/50 text-center">Output</div>
                {Object.keys(currentQuestion.correctAnswer).map((val) => (
                  <div key={val} className="contents">
                    <div className="p-3 bg-white/5 rounded-lg text-white font-mono text-center">{val}</div>
                    <input
                      type="text"
                      maxLength={1}
                      value={(answers[currentQuestion.id] || {})[val] || ''}
                      onChange={(e) => {
                        const prev = answers[currentQuestion.id] || {};
                        handleAnswerChange(currentQuestion.id, { ...prev, [val]: e.target.value });
                      }}
                      className="p-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 disabled:opacity-0 transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          {currentStep === questions.length - 1 ? 'Finish Exam' : 'Next Question'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
