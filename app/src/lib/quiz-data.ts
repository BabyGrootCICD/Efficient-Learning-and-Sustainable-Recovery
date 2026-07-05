import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Priming
  {
    id: 'p1',
    category: 'priming',
    text: 'Before lectures or study sessions, I preview headings and key diagrams (5-10 min).',
    textZh: '在講座或學習前，我會預覽標題與關鍵圖表（5–10 分鐘）。',
  },
  {
    id: 'p2',
    category: 'priming',
    text: 'I build a mental frame by asking what big picture questions the topic will answer.',
    textZh: '我會思考這個主題要回答什麼大問題，建立心理框架。',
  },
  {
    id: 'p3',
    category: 'priming',
    text: 'I connect new topics to what I already know before deep study.',
    textZh: '深度學習前，我會將新主題與既有知識連結。',
  },
  // Encoding
  {
    id: 'e1',
    category: 'encoding',
    text: 'I group related concepts and create visual models instead of copying definitions.',
    textZh: '我會分組相關概念並建立視覺模型，而非抄寫定義。',
  },
  {
    id: 'e2',
    category: 'encoding',
    text: 'I explain concepts in my own words and use analogies.',
    textZh: '我用自己的話解釋概念並使用類比。',
  },
  {
    id: 'e3',
    category: 'encoding',
    text: 'My studying feels mentally effortful — I embrace the friction of active thinking.',
    textZh: '我的學習需要主動思考的努力，我接受這種認知摩擦。',
  },
  // Reference
  {
    id: 'r1',
    category: 'reference',
    text: 'I offload fine details to an external database (notes, flashcards, Obsidian).',
    textZh: '我將細節卸載至外部資料庫（筆記、閃卡、Obsidian 等）。',
  },
  {
    id: 'r2',
    category: 'reference',
    text: 'I focus 90% of effort on conceptual core, not arbitrary facts.',
    textZh: '我將 90% 精力放在概念核心，而非瑣碎事實。',
  },
  {
    id: 'r3',
    category: 'reference',
    text: 'I use a "parking lot" for hyper-specific details during study.',
    textZh: '學習時我使用「停車場」記錄超具體細節。',
  },
  // Retrieval
  {
    id: 'rt1',
    category: 'retrieval',
    text: 'I test myself immediately after each study block.',
    textZh: '每個學習區塊結束後，我立即自我測驗。',
  },
  {
    id: 'rt2',
    category: 'retrieval',
    text: 'I practice applying knowledge to solve problems, not just recall definitions.',
    textZh: '我練習應用知識解題，而非只背定義。',
  },
  {
    id: 'rt3',
    category: 'retrieval',
    text: 'I explain concepts to others or write summaries from memory.',
    textZh: '我會向他人解釋概念或從記憶中寫摘要。',
  },
  // Interleaving
  {
    id: 'i1',
    category: 'interleaving',
    text: 'I mix different topics or question types in a single study session.',
    textZh: '我在單次學習中混合不同主題或題型。',
  },
  {
    id: 'i2',
    category: 'interleaving',
    text: 'I ask questions from varied perspectives (e.g., how X interacts with Y).',
    textZh: '我從不同角度提問（例如 X 如何與 Y 互動）。',
  },
  {
    id: 'i3',
    category: 'interleaving',
    text: 'I avoid studying one concept in massive isolated blocks.',
    textZh: '我避免在巨大孤立區塊中只學一個概念。',
  },
  // Overlearning
  {
    id: 'o1',
    category: 'overlearning',
    text: 'I only drill repetition after encoding and retrieval are solid.',
    textZh: '只有在編碼與提取穩固後，我才進行重複練習。',
  },
  {
    id: 'o2',
    category: 'overlearning',
    text: 'I treat overlearning as optional, reserved for high-stakes assessments.',
    textZh: '我將過度學習視為選用，僅用於高風險評估。',
  },
  {
    id: 'o3',
    category: 'overlearning',
    text: 'I never jump straight to flashcard drilling without building conceptual models.',
    textZh: '我從不跳過概念模型，直接開始閃卡死記。',
  },
  // Recovery: Relaxation
  {
    id: 'rx1',
    category: 'relaxation',
    text: 'I put my phone away during rest to avoid digital micro-decision fatigue.',
    textZh: '休息時我會收起手機，避免數位微決策疲勞。',
  },
  {
    id: 'rx2',
    category: 'relaxation',
    text: 'My rest activities match my exhausted system (low cognitive after mental work).',
    textZh: '我的休息活動符合疲勞的系統（腦力工作後低認知負荷）。',
  },
  // Recovery: Detachment
  {
    id: 'dt1',
    category: 'detachment',
    text: 'I have a firm shutdown time and do not check work/study after it.',
    textZh: '我有固定的關機時間，之後不再查看工作/學習。',
  },
  {
    id: 'dt2',
    category: 'detachment',
    text: 'I adopt an "empty cup" mindset — I cannot pour from an empty cup.',
    textZh: '我採用「空杯心態」——空杯無法再倒出水。',
  },
  // Recovery: Mastery
  {
    id: 'ms1',
    category: 'mastery',
    text: 'I spend time on a progressive hobby (music, gym, puzzles, art).',
    textZh: '我投入有進步感的嗜好（音樂、健身、解謎、繪畫等）。',
  },
  {
    id: 'ms2',
    category: 'mastery',
    text: 'Even 5-10 minutes of hobby practice gives me a sense of progress.',
    textZh: '即使 5–10 分鐘的嗜好練習也能給我進步感。',
  },
  // Recovery: Control
  {
    id: 'ct1',
    category: 'control',
    text: 'I carve out 10-30 minutes daily where I have 100% control over my time.',
    textZh: '我每天留出 10–30 分鐘完全自主的時間。',
  },
  {
    id: 'ct2',
    category: 'control',
    text: 'I follow my instincts during free time without external obligations.',
    textZh: '自由時間我跟隨直覺，不受外部義務束縛。',
  },
];
