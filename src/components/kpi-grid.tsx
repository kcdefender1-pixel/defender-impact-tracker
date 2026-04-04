'use client';

import { useState } from 'react';
import type { KpiConfig, MetricSnapshot } from '@/lib/types';
import { KpiCard } from '@/components/kpi-card';
import { PeriodFilter } from '@/components/period-filter';
import { KPI_TO_PILLAR } from '@/lib/constants';

const PILLARS = [
  { value: 'organizing', label: 'Organizing Power' },
  { value: 'material', label: 'Material Power' },
  { value: 'narrative', label: 'Narrative Power' },
  { value: 'cultural', label: 'Cultural Power' },
  { value: 'institutional', label: 'Institutional Power' },
];

interface KpiGridProps {
  kpis: KpiConfig[];
  snapshotsByKey: Record<string, MetricSnapshot[]>;
  period: string;
}

export function KpiGrid({ kpis, snapshotsByKey, period }: KpiGridProps) {
  const pillarWithData = PILLARS.find((pillar) =>
    kpis
      .filter((kpi) => KPI_TO_PILLAR[kpi.key] === pillar.value)
      .some((kpi) => (snapshotsByKey[kpi.key]?.length ?? 0) > 0)
  );
  const [activePillar, setActivePillar] = useState(pillarWithData?.value ?? 'narrative');

  if (kpis.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No KPIs configured. Run the Supabase schema to seed the Big 10.
      </div>
    );
  }

  const pillarKpis = kpis.filter((kpi) => KPI_TO_PILLAR[kpi.key] === activePillar);

  return (
    <div>
      <PeriodFilter current={period} />

      {/* Pillar tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5 mt-4">
        {PILLARS.map((pillar) => {
          const isActive = activePillar === pillar.value;
          const hasData = kpis
            .filter((kpi) => KPI_TO_PILLAR[kpi.key] === pillar.value)
            .some((kpi) => (snapshotsByKey[kpi.key]?.length ?? 0) > 0);

          return (
            <button
              key={pillar.value}
              onClick={() => setActivePillar(pillar.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-defender-red text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {pillar.label}
              {hasData && !isActive && (
                <span className="ml-1 w-1 h-1 rounded-full bg-defender-green inline-block align-middle" />
              )}
            </button>
          );
        })}
      </div>

      {/* KPI cards for active pillar */}
      {pillarKpis.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No KPIs mapped to this pillar yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillarKpis.map((kpi) => {
            const snapshots = snapshotsByKey[kpi.key] ?? [];
            const sorted = [...snapshots].sort(
              (a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
            );
            const latestValue = sorted[0]?.value ?? null;
            return (
              <KpiCard
                key={kpi.key}
                kpi={kpi}
                latestValue={latestValue}
                snapshots={snapshots}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
