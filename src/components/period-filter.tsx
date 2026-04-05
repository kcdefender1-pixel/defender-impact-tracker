'use client';

import { useRouter } from 'next/navigation';

const PERIODS = [
  { value: 'this_month', label: 'This Month' },
  { value: '30d', label: 'Last 30 days' },
  { value: '60d', label: 'Last 60 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'all', label: 'All Time' },
];

interface PeriodFilterProps {
  current?: string;
}

export function PeriodFilter({ current = '30d' }: PeriodFilterProps) {
  const router = useRouter();

  const handlePeriodChange = (period: string) => {
    router.push(`/?period=${period}`);
  };

  return (
    <div className="flex gap-1.5 flex-wrap">
      {PERIODS.map((p) => {
        const isActive = current === p.value;
        return (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-defender-red text-white'
                : 'bg-surface-card border border-white/10 text-white/50 hover:bg-surface-hover hover:text-white'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
