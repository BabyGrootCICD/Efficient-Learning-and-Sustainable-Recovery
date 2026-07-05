'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import { LIKERT_OPTIONS } from '@/lib/constants';
import { computeDiagnosticResult } from '@/lib/scoring';
import { saveDiagnostic } from '@/lib/storage';
import type { QuizAnswer } from '@/lib/types';

export function QuizFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const question = QUIZ_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  const existing = answers.find((a) => a.questionId === question.id);

  function handleSelect(score: number) {
    const updated = answers.filter((a) => a.questionId !== question.id);
    updated.push({ questionId: question.id, score });
    setAnswers(updated);

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 200);
    } else {
      const result = computeDiagnosticResult(updated);
      saveDiagnostic(result);
      router.push('/results');
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            問題 {currentIndex + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-sl-border rounded-full overflow-hidden">
          <div
            className="h-full bg-sl-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-sl-card border border-sl-border rounded-xl p-8 mb-6">
        <p className="text-xl text-white leading-relaxed mb-2">
          {question.textZh}
        </p>
        <p className="text-sm text-gray-500 italic">{question.text}</p>
      </div>

      <div className="space-y-3">
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
              existing?.score === opt.value
                ? 'border-sl-accent bg-sl-accent/20 text-white'
                : 'border-sl-border bg-sl-card text-gray-300 hover:border-sl-accent/50 hover:bg-sl-card/80'
            }`}
          >
            <span className="font-medium mr-3 text-sl-accent">{opt.value}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← 上一題
        </button>
      )}
    </div>
  );
}
