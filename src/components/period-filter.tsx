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
    router.push(`/admin?period=${period}`);
  };

  return (
    <div className="inline-flex flex-wrap border-2 border-ink bg-card">
      {PERIODS.map((p) => {
        const isActive = current === p.value;
        return (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={`px-3.5 py-2 text-xs font-bold transition-colors ${
              isActive ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-ink/[0.06] hover:text-ink'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
