'use client';

import { useState, useEffect } from 'react';
import {
  LEARNING_CATEGORIES,
  RECOVERY_CATEGORIES,
  type Category,
} from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import {
  toggleHabit,
  isHabitCompleted,
  getToday,
} from '@/lib/storage';

export function HabitGrid() {
  const [date, setDate] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setDate(getToday());
  }, []);

  function handleToggle(category: Category) {
    if (!date) return;
    toggleHabit(category, date);
    setTick((t) => t + 1);
  }

  if (!date) return null;

  return (
    <div className="space-y-8">
      <div>
        <label className="text-sm text-gray-400 block mb-2">日期</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-sl-card border border-sl-border rounded-lg px-4 py-2 text-white"
        />
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          PERIO 學習階段
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LEARNING_CATEGORIES.map((cat) => (
            <HabitButton
              key={`${cat}-${tick}`}
              category={cat}
              label={CATEGORY_LABELS[cat]}
              completed={isHabitCompleted(cat, date)}
              onToggle={() => handleToggle(cat)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          四維度恢復
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RECOVERY_CATEGORIES.map((cat) => (
            <HabitButton
              key={`${cat}-${tick}`}
              category={cat}
              label={CATEGORY_LABELS[cat]}
              completed={isHabitCompleted(cat, date)}
              onToggle={() => handleToggle(cat)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function HabitButton({
  label,
  completed,
  onToggle,
}: {
  category: Category;
  label: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
        completed
          ? 'border-sl-green bg-sl-green/10 text-sl-green'
          : 'border-sl-border bg-sl-card text-gray-300 hover:border-sl-accent/50'
      }`}
    >
      <span
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center text-sm ${
          completed ? 'border-sl-green bg-sl-green text-white' : 'border-gray-500'
        }`}
      >
        {completed ? '✓' : ''}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
