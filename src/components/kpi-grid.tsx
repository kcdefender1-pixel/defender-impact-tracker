import type { KpiConfig, MetricSnapshot } from '@/lib/types';
import { KpiCard } from '@/components/kpi-card';

interface KpiGridProps {
  kpis: KpiConfig[];
  snapshotsByKey: Record<string, MetricSnapshot[]>;
}

export function KpiGrid({ kpis, snapshotsByKey }: KpiGridProps) {
  if (kpis.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No KPIs configured. Run the Supabase schema to seed the Big 10.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
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
  );
}
