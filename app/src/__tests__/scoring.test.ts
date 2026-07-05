import { describe, it, expect } from 'vitest';
import {
  calculateCategoryScore,
  calculateOverallScore,
  calculateRadarScores,
  computeDiagnosticResult,
  getStatus,
} from '../lib/scoring';
import type { Category, QuizAnswer } from '../lib/types';
import { QUIZ_QUESTIONS } from '../lib/quiz-data';

function makeAnswers(scores: Record<string, number>): QuizAnswer[] {
  return Object.entries(scores).map(([questionId, score]) => ({
    questionId,
    score,
  }));
}

function allZeroAnswers(): QuizAnswer[] {
  return QUIZ_QUESTIONS.map((q) => ({ questionId: q.id, score: 0 }));
}

function allMaxAnswers(): QuizAnswer[] {
  return QUIZ_QUESTIONS.map((q) => ({ questionId: q.id, score: 4 }));
}

describe('getStatus', () => {
  it('returns not_implemented for scores below 40', () => {
    expect(getStatus(22)).toBe('not_implemented');
    expect(getStatus(39.9)).toBe('not_implemented');
  });

  it('returns needs_improvement for scores 40-69', () => {
    expect(getStatus(40)).toBe('needs_improvement');
    expect(getStatus(69.9)).toBe('needs_improvement');
  });

  it('returns implemented for scores 70+', () => {
    expect(getStatus(70)).toBe('implemented');
    expect(getStatus(100)).toBe('implemented');
  });
});

describe('calculateCategoryScore', () => {
  it('returns 0 when all answers are 0', () => {
    const answers = makeAnswers({ p1: 0, p2: 0, p3: 0 });
    expect(calculateCategoryScore('priming', answers)).toBe(0);
  });

  it('returns 100 when all answers are max', () => {
    const answers = makeAnswers({ p1: 4, p2: 4, p3: 4 });
    expect(calculateCategoryScore('priming', answers)).toBe(100);
  });

  it('returns 25% when each of 3 questions scores 1 (of 4 max)', () => {
    const answers = makeAnswers({ p1: 1, p2: 1, p3: 1 });
    expect(calculateCategoryScore('priming', answers)).toBe(25);
  });
});

describe('calculateRadarScores', () => {
  it('computes retrieval & interleaving as average', () => {
    const categoryScores = {
      priming: 16.7,
      encoding: 16.7,
      reference: 50,
      retrieval: 20,
      interleaving: 42.5,
      overlearning: 16.7,
      relaxation: 50,
      detachment: 50,
      mastery: 50,
      control: 50,
    } as Record<Category, number>;

    const radar = calculateRadarScores(categoryScores);
    const ri = radar.find((r) => r.axis === 'retrievalInterleaving');
    expect(ri?.score).toBe(31.3);
  });
});

describe('calculateOverallScore', () => {
  it('averages all 10 categories', () => {
    const scores = {
      priming: 20,
      encoding: 20,
      reference: 20,
      retrieval: 20,
      interleaving: 20,
      overlearning: 20,
      relaxation: 20,
      detachment: 20,
      mastery: 20,
      control: 20,
    } as Record<Category, number>;
    expect(calculateOverallScore(scores)).toBe(20);
  });
});

describe('computeDiagnosticResult', () => {
  it('produces ~22% overall for all-1 answers pattern', () => {
    const answers = QUIZ_QUESTIONS.map((q) => ({
      questionId: q.id,
      score: 1,
    }));
    const result = computeDiagnosticResult(answers);
    expect(result.overallScore).toBe(25);
    expect(result.radarScores).toHaveLength(5);
    expect(result.categoryScores.priming).toBe(25);
  });

  it('produces 100% overall for max answers', () => {
    const result = computeDiagnosticResult(allMaxAnswers());
    expect(result.overallScore).toBe(100);
  });

  it('produces 0% overall for zero answers', () => {
    const result = computeDiagnosticResult(allZeroAnswers());
    expect(result.overallScore).toBe(0);
  });
});
