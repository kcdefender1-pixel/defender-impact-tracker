'use client';

import { useState } from 'react';
import type { KpiConfig, MetricSnapshot } from '@/lib/types';
import { KpiCard } from '@/components/kpi-card';
import { PeriodFilter } from '@/components/period-filter';
import { KPI_TO_PILLAR } from '@/lib/constants';

const PILLARS = [
  { value: 'organizing', label: 'Organizing', active: 'bg-defender-gold text-ink' },
  { value: 'material', label: 'Material', active: 'bg-defender-green text-white' },
  { value: 'narrative', label: 'Narrative', active: 'bg-defender-red text-white' },
  { value: 'cultural', label: 'Cultural', active: 'bg-defender-violet text-ink' },
  { value: 'institutional', label: 'Institutional', active: 'bg-defender-blue text-white' },
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
      <div className="text-center py-12 text-ink-4 text-sm">
        No KPIs configured. Run the Supabase schema to seed the Big 10.
      </div>
    );
  }

  const pillarKpis = kpis.filter((kpi) => KPI_TO_PILLAR[kpi.key] === activePillar);

  return (
    <div>
      <PeriodFilter current={period} />

      {/* Pillar tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[2px] bg-ink border-2 border-ink mb-8 mt-6">
        {PILLARS.map((pillar, i) => {
          const isActive = activePillar === pillar.value;
          const hasData = kpis
            .filter((kpi) => KPI_TO_PILLAR[kpi.key] === pillar.value)
            .some((kpi) => (snapshotsByKey[kpi.key]?.length ?? 0) > 0);

          return (
            <button
              key={pillar.value}
              onClick={() => setActivePillar(pillar.value)}
              className={`relative text-left px-4 pt-3 pb-3.5 transition-colors ${
                i === PILLARS.length - 1 ? 'col-span-2 lg:col-span-1' : ''
              } ${isActive ? pillar.active : 'bg-card text-ink hover:bg-paper-2'}`}
            >
              <span className={`kicker block mb-1 ${isActive ? 'opacity-80' : 'text-ink-4'}`}>
                Pillar {i + 1}
                {hasData && !isActive && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-defender-green inline-block align-middle" />
                )}
              </span>
              <span className="display text-[1.6rem] md:text-[1.9rem]">{pillar.label}</span>
            </button>
          );
        })}
      </div>

      {/* KPI cards for active pillar */}
      {pillarKpis.length === 0 ? (
        <div className="text-center py-8 text-ink-4 text-sm">
          No KPIs mapped to this pillar yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
