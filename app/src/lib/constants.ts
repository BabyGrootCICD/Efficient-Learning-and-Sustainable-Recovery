import type { Category, ImplementationStatus } from './types';

export const STATUS_THRESHOLDS = {
  implemented: 70,
  needsImprovement: 40,
} as const;

export const STATUS_COLORS: Record<ImplementationStatus, string> = {
  implemented: '#22c55e',
  needs_improvement: '#f97316',
  not_implemented: '#ef4444',
};

export const STATUS_LABELS: Record<ImplementationStatus, string> = {
  implemented: '已實踐',
  needs_improvement: '需改進',
  not_implemented: '尚未實踐',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  priming: 'Priming（預備）',
  encoding: 'Encoding（編碼）',
  reference: 'Reference（參考）',
  retrieval: 'Retrieval（提取）',
  interleaving: 'Interleaving（交錯）',
  overlearning: 'Overlearning（過度學習）',
  relaxation: 'Relaxation（放鬆）',
  detachment: 'Detachment（心理脫離）',
  mastery: 'Mastery（精通體驗）',
  control: 'Control（自主控制）',
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  priming: '在學習前預覽材料，建立心理框架，讓大腦準備接收新資訊。',
  encoding: '主動處理資訊、建立連結與心智模型，而非被動抄寫。',
  reference: '將細節卸載至外部資料庫，專注於概念核心。',
  retrieval: '主動從記憶中提取並應用知識，強化神經連結。',
  interleaving: '從多角度測試知識，建立靈活的心智架構。',
  overlearning: '在概念已掌握後，策略性地追求流利回憶（選用）。',
  relaxation: '低認知負荷的真正放鬆，避免數位滑動陷阱。',
  detachment: '完全切斷工作/學習思緒，採用「空杯心態」。',
  mastery: '透過有進步感的嗜好獲得恢復能量。',
  control: '完全自主決定如何度過非工作時間。',
};

export const CATEGORY_BENEFITS: Record<Category, string> = {
  priming: '減少重複學習次數，加速進入深度理解。',
  encoding: '大幅減少遺忘，提升長期記憶效率。',
  reference: '避免認知超載，釋放前額葉處理核心概念。',
  retrieval: '測試即學習，每次提取都加深記憶。',
  interleaving: '應對新穎問題，知識不再狹窄脆弱。',
  overlearning: '競賽級評估時達到瞬間流利回憶。',
  relaxation: '清除前額葉代謝廢物，真正恢復認知能量。',
  detachment: '打破恢復悖論，高負荷時仍能切換休息。',
  mastery: '建立長期恢復資產，自然引發心理脫離。',
  control: '行使個人自主權本身就是恢復體驗。',
};

export const LIKERT_OPTIONS = [
  { value: 0, label: '從不 / 完全沒有' },
  { value: 1, label: '很少' },
  { value: 2, label: '有時' },
  { value: 3, label: '經常' },
  { value: 4, label: '總是 / 已建立系統' },
];

export const STORAGE_KEYS = {
  diagnostic: 'sl_diagnostic',
  habits: 'sl_habits',
  checklist: 'sl_checklist',
} as const;
