'use client';

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { RadarScore } from '@/lib/types';

interface RadarChartProps {
  scores: RadarScore[];
}

export function RadarChart({ scores }: RadarChartProps) {
  const data = scores.map((s) => ({
    subject: s.label,
    score: s.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#2d3a4f" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#64748b', fontSize: 10 }}
        />
        <Radar
          name="學習系統"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.35}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
