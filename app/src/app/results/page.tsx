'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DoughnutChart } from '@/components/charts/DoughnutChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { CategoryCard } from '@/components/CategoryCard';
import { getLatestDiagnostic } from '@/lib/storage';
import type { DiagnosticResult } from '@/lib/types';
import { LEARNING_CATEGORIES, RECOVERY_CATEGORIES } from '@/lib/types';

export default function ResultsPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResult(getLatestDiagnostic());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!result) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">尚無診斷結果</h1>
        <p className="text-gray-400 mb-8">請先完成學習系統診斷測驗。</p>
        <Link
          href="/diagnostic/"
          className="bg-sl-accent text-white px-6 py-3 rounded-xl font-medium"
        >
          開始診斷
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">你的學習系統診斷</h1>
        <p className="text-gray-400">
          你的學習系統已完成{' '}
          <span className="text-sl-accent font-bold text-xl">
            {Math.round(result.overallScore)}%
          </span>
          ！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <DoughnutChart score={result.overallScore} size={240} />
        </div>
        <div className="bg-sl-card border border-sl-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            學習系統雷達圖
          </h2>
          <RadarChart scores={result.radarScores} />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          PERIO 學習階段 — 深度分析
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNING_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              score={result.categoryScores[cat]}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">
          四維度恢復 — 深度分析
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOVERY_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              score={result.categoryScores[cat]}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Link
          href="/diagnostic/"
          className="border border-sl-border text-gray-300 px-6 py-3 rounded-xl hover:border-sl-accent/50 transition-colors"
        >
          重新診斷
        </Link>
        <Link
          href="/habits/"
          className="bg-sl-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          開始追蹤習慣
        </Link>
        <Link
          href="/checklist/"
          className="border border-sl-accent text-sl-accent px-6 py-3 rounded-xl hover:bg-sl-accent/10 transition-colors"
        >
          查看週清單
        </Link>
      </div>
    </div>
  );
}
