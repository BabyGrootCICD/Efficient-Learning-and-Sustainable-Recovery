import type {
  Category,
  DiagnosticResult,
  ImplementationStatus,
  QuizAnswer,
  RadarAxis,
  RadarScore,
} from './types';
import {
  ALL_CATEGORIES,
  LEARNING_CATEGORIES,
  RECOVERY_CATEGORIES,
} from './types';
import { STATUS_THRESHOLDS } from './constants';
import { QUIZ_QUESTIONS } from './quiz-data';

const MAX_SCORE_PER_QUESTION = 4;

export function getStatus(score: number): ImplementationStatus {
  if (score >= STATUS_THRESHOLDS.implemented) return 'implemented';
  if (score >= STATUS_THRESHOLDS.needsImprovement) return 'needs_improvement';
  return 'not_implemented';
}

export function calculateCategoryScore(
  category: Category,
  answers: QuizAnswer[],
): number {
  const questionIds = QUIZ_QUESTIONS.filter((q) => q.category === category).map(
    (q) => q.id,
  );
  if (questionIds.length === 0) return 0;

  const relevant = answers.filter((a) => questionIds.includes(a.questionId));
  const total = relevant.reduce((sum, a) => sum + a.score, 0);
  const maxPossible = questionIds.length * MAX_SCORE_PER_QUESTION;

  return Math.round((total / maxPossible) * 1000) / 10;
}

export function calculateAllCategoryScores(
  answers: QuizAnswer[],
): Record<Category, number> {
  const scores = {} as Record<Category, number>;
  for (const cat of ALL_CATEGORIES) {
    scores[cat] = calculateCategoryScore(cat, answers);
  }
  return scores;
}

export function calculateRadarScores(
  categoryScores: Record<Category, number>,
): RadarScore[] {
  const retrievalInterleaving =
    (categoryScores.retrieval + categoryScores.interleaving) / 2;

  const axes: { axis: RadarAxis; label: string; score: number }[] = [
    { axis: 'priming', label: 'Priming', score: categoryScores.priming },
    { axis: 'learning', label: 'Learning', score: categoryScores.encoding },
    { axis: 'retrieval', label: 'Retrieval', score: categoryScores.retrieval },
    {
      axis: 'retrievalInterleaving',
      label: 'Retrieval & Interleaving',
      score: Math.round(retrievalInterleaving * 10) / 10,
    },
    {
      axis: 'overlearning',
      label: 'Overlearning',
      score: categoryScores.overlearning,
    },
  ];

  return axes;
}

export function calculateOverallScore(
  categoryScores: Record<Category, number>,
): number {
  const learningSum = LEARNING_CATEGORIES.reduce(
    (sum, cat) => sum + categoryScores[cat],
    0,
  );
  const recoverySum = RECOVERY_CATEGORIES.reduce(
    (sum, cat) => sum + categoryScores[cat],
    0,
  );
  const total = learningSum + recoverySum;
  const count = ALL_CATEGORIES.length;

  return Math.round((total / count) * 10) / 10;
}

export function computeDiagnosticResult(answers: QuizAnswer[]): DiagnosticResult {
  const categoryScores = calculateAllCategoryScores(answers);
  const radarScores = calculateRadarScores(categoryScores);
  const overallScore = calculateOverallScore(categoryScores);

  return {
    id: crypto.randomUUID?.() ?? `diag-${Date.now()}`,
    overallScore,
    categoryScores,
    radarScores,
    answers,
    completedAt: new Date().toISOString(),
  };
}

export function getQuestionsByCategory(category: Category) {
  return QUIZ_QUESTIONS.filter((q) => q.category === category);
}

export function validateAnswers(answers: QuizAnswer[]): boolean {
  const answeredIds = new Set(answers.map((a) => a.questionId));
  return QUIZ_QUESTIONS.every((q) => answeredIds.has(q.id));
}
