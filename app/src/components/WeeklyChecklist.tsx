'use client';

import { useState, useEffect } from 'react';
import { getChecklist, toggleChecklistItem } from '@/lib/storage';
import type { WeeklyChecklistState } from '@/lib/types';

export function WeeklyChecklist() {
  const [checklist, setChecklist] = useState<WeeklyChecklistState | null>(null);

  useEffect(() => {
    setChecklist(getChecklist());
  }, []);

  function handleToggle(itemId: string) {
    const updated = toggleChecklistItem(itemId);
    setChecklist(updated);
  }

  if (!checklist) return null;

  const completedCount = checklist.items.filter((i) => i.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">
          本週起始：{checklist.weekStart}
        </p>
        <p className="text-sl-accent font-medium">
          {completedCount} / {checklist.items.length} 完成
        </p>
      </div>

      <div className="space-y-4">
        {checklist.items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className={`w-full text-left p-5 rounded-xl border transition-all ${
              item.completed
                ? 'border-sl-green/50 bg-sl-green/5'
                : 'border-sl-border bg-sl-card hover:border-sl-accent/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className={`mt-0.5 w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                  item.completed
                    ? 'border-sl-green bg-sl-green text-white'
                    : 'border-gray-500'
                }`}
              >
                {item.completed ? '✓' : ''}
              </span>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    item.completed ? 'text-sl-green line-through' : 'text-white'
                  }`}
                >
                  {item.label}
                </h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
