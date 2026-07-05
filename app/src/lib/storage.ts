import type {
  DiagnosticResult,
  HabitEntry,
  WeeklyChecklistState,
} from './types';
import { STORAGE_KEYS } from './constants';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function saveDiagnostic(result: DiagnosticResult): void {
  if (!isBrowser()) return;
  const history = getDiagnosticHistory();
  history.unshift(result);
  localStorage.setItem(STORAGE_KEYS.diagnostic, JSON.stringify(history.slice(0, 10)));
}

export function getDiagnosticHistory(): DiagnosticResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.diagnostic);
    return raw ? (JSON.parse(raw) as DiagnosticResult[]) : [];
  } catch {
    return [];
  }
}

export function getLatestDiagnostic(): DiagnosticResult | null {
  const history = getDiagnosticHistory();
  return history[0] ?? null;
}

export function getHabits(): HabitEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.habits);
    return raw ? (JSON.parse(raw) as HabitEntry[]) : [];
  } catch {
    return [];
  }
}

export function toggleHabit(
  category: HabitEntry['category'],
  date: string,
): HabitEntry[] {
  if (!isBrowser()) return [];
  const habits = getHabits();
  const idx = habits.findIndex(
    (h) => h.category === category && h.date === date,
  );

  if (idx >= 0) {
    habits[idx] = { ...habits[idx], completed: !habits[idx].completed };
  } else {
    habits.push({ category, date, completed: true });
  }

  localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
  return habits;
}

export function getHabitsForDate(date: string): HabitEntry[] {
  return getHabits().filter((h) => h.date === date);
}

export function isHabitCompleted(
  category: HabitEntry['category'],
  date: string,
): boolean {
  return getHabits().some(
    (h) => h.category === category && h.date === date && h.completed,
  );
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export function getDefaultChecklist(weekStart: string): WeeklyChecklistState {
  return {
    weekStart,
    items: [
      {
        id: 'diagnostic',
        label: '完成學習系統診斷',
        description: '量化目前學習習慣，找出 PERIO 系統的能量洩漏點。',
        completed: false,
      },
      {
        id: 'relaxation_list',
        label: '建立放鬆靈感清單',
        description: '寫下 5–10 個一直想嘗試的嗜好或活動。',
        completed: false,
      },
      {
        id: 'anchors',
        label: '設定兩個每週錨點',
        description: '在日曆中預留兩個不可取消的 1 小時運動或精通嗜好時段。',
        completed: false,
      },
      {
        id: 'friction',
        label: '降低休息摩擦力',
        description: '提前準備環境（畫具就緒、健身包打包好），零規劃即可開始恢復。',
        completed: false,
      },
      {
        id: 'nature',
        label: '安排 30 分鐘自然休憩',
        description: '週末早晨或傍晚，到綠地靜坐 30 分鐘，享受軟性著迷恢復。',
        completed: false,
      },
    ],
  };
}

export function getChecklist(): WeeklyChecklistState {
  if (!isBrowser()) return getDefaultChecklist(getWeekStart());
  const weekStart = getWeekStart();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.checklist);
    if (!raw) return getDefaultChecklist(weekStart);
    const saved = JSON.parse(raw) as WeeklyChecklistState;
    if (saved.weekStart !== weekStart) return getDefaultChecklist(weekStart);
    return saved;
  } catch {
    return getDefaultChecklist(weekStart);
  }
}

export function toggleChecklistItem(itemId: string): WeeklyChecklistState {
  const checklist = getChecklist();
  const updated = {
    ...checklist,
    items: checklist.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    ),
  };
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(updated));
  }
  return updated;
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}
