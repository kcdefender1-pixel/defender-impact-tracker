'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { MetricSnapshot } from '@/lib/types';

interface SparklineProps {
  snapshots: MetricSnapshot[];
  color?: string;
  height?: number;
}

export function Sparkline({ snapshots, color = '#E11D48', height = 40 }: SparklineProps) {
  if (snapshots.length < 2) return null;

  const data = snapshots
    .slice()
    .sort((a, b) => new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime())
    .map((s) => ({ v: s.value }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
