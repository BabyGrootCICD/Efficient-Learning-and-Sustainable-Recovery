export type LearningCategory =
  | 'priming'
  | 'encoding'
  | 'reference'
  | 'retrieval'
  | 'interleaving'
  | 'overlearning';

export type RecoveryCategory =
  | 'relaxation'
  | 'detachment'
  | 'mastery'
  | 'control';

export type Category = LearningCategory | RecoveryCategory;

export type RadarAxis =
  | 'priming'
  | 'learning'
  | 'retrieval'
  | 'retrievalInterleaving'
  | 'overlearning';

export type ImplementationStatus =
  | 'implemented'
  | 'needs_improvement'
  | 'not_implemented';

export interface QuizQuestion {
  id: string;
  category: Category;
  text: string;
  textZh: string;
}

export interface QuizAnswer {
  questionId: string;
  score: number; // 0-4
}

export interface CategoryScore {
  category: Category;
  score: number;
  status: ImplementationStatus;
}

export interface RadarScore {
  axis: RadarAxis;
  label: string;
  score: number;
}

export interface DiagnosticResult {
  id: string;
  overallScore: number;
  categoryScores: Record<Category, number>;
  radarScores: RadarScore[];
  answers: QuizAnswer[];
  completedAt: string;
}

export interface HabitEntry {
  category: Category;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export interface WeeklyChecklistState {
  weekStart: string;
  items: ChecklistItem[];
}

export const LEARNING_CATEGORIES: LearningCategory[] = [
  'priming',
  'encoding',
  'reference',
  'retrieval',
  'interleaving',
  'overlearning',
];

export const RECOVERY_CATEGORIES: RecoveryCategory[] = [
  'relaxation',
  'detachment',
  'mastery',
  'control',
];

export const ALL_CATEGORIES: Category[] = [
  ...LEARNING_CATEGORIES,
  ...RECOVERY_CATEGORIES,
];
