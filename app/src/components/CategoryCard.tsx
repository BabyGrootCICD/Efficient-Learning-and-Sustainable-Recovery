import type { Category } from '@/lib/types';
import { getStatus } from '@/lib/scoring';
import {
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_BENEFITS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '@/lib/constants';

interface CategoryCardProps {
  category: Category;
  score: number;
}

export function CategoryCard({ category, score }: CategoryCardProps) {
  const status = getStatus(score);
  const color = STATUS_COLORS[status];

  return (
    <div className="bg-sl-card border border-sl-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {CATEGORY_LABELS[category]}
        </h3>
        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-sl-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-white font-bold text-lg w-16 text-right">
          {score}%
        </span>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">
        {CATEGORY_DESCRIPTIONS[category]}
      </p>

      <div className="border-t border-sl-border pt-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          關鍵效益
        </p>
        <p className="text-sm text-gray-300">{CATEGORY_BENEFITS[category]}</p>
      </div>
    </div>
  );
}
