import { createClient } from '@/lib/supabase/server';
import { KpiGrid } from '@/components/kpi-grid';
import { ImpactTimeline } from '@/components/impact-timeline';
import type { KpiConfig, MetricSnapshot, ImpactEvent, IntegrationStatus } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatSyncTime(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function CommandCenter() {
  const supabase = createClient();

  // Fetch all data in parallel
  const [kpisRes, snapshotsRes, impactsRes, syncRes, pendingRes] = await Promise.all([
    supabase.from('kpi_config').select('*').order('sort_order', { ascending: true }),
    supabase.from('metric_snapshots').select('*').order('taken_at', { ascending: false }),
    supabase
      .from('impact_events')
      .select('*')
      .eq('status', 'approved')
      .order('reported_at', { ascending: false })
      .limit(10),
    supabase
      .from('integration_status')
      .select('*')
      .eq('name', 'rss_kansascitydefender')
      .maybeSingle(),
    supabase
      .from('impact_events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const kpis: KpiConfig[] = kpisRes.data ?? [];
  const allSnapshots: MetricSnapshot[] = snapshotsRes.data ?? [];
  const impacts: ImpactEvent[] = impactsRes.data ?? [];
  const syncStatus: IntegrationStatus | null = syncRes.data ?? null;
  const pendingCount: number = pendingRes.count ?? 0;

  // Group snapshots by metric_key, keep last 6 per key for sparklines
  const snapshotsByKey: Record<string, MetricSnapshot[]> = {};
  for (const snap of allSnapshots) {
    if (!snapshotsByKey[snap.metric_key]) snapshotsByKey[snap.metric_key] = [];
    if (snapshotsByKey[snap.metric_key].length < 6) {
      snapshotsByKey[snap.metric_key].push(snap);
    }
  }

  return (
    <div className="px-4 py-8 md:px-8 md:py-10">
      {/* Header row */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
            The Kansas City Defender
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-defender-black leading-tight">
            Command Center
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Organizational impact at a glance.
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                syncStatus?.status === 'ok'
                  ? 'bg-defender-green'
                  : syncStatus?.status === 'warning'
                  ? 'bg-defender-gold'
                  : 'bg-gray-300'
              }`}
            />
            RSS: {formatSyncTime(syncStatus?.last_run_at ?? null)}
          </div>
          {pendingCount > 0 && (
            <Link
              href="/admin/impacts"
              className="text-xs font-semibold bg-amber-100 text-amber-800 rounded-full px-2.5 py-1 hover:bg-amber-200 transition-colors"
            >
              {pendingCount} pending review
            </Link>
          )}
        </div>
      </div>

      {/* Big 10 KPI grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-defender-black tracking-tight">
            The Big 10
          </h2>
          <Link
            href="/admin/metrics"
            className="text-xs font-semibold text-defender-red hover:underline"
          >
            + Add snapshot
          </Link>
        </div>
        <KpiGrid kpis={kpis} snapshotsByKey={snapshotsByKey} />
      </section>

      {/* Recent impacts timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-defender-black tracking-tight">
            Recent Impacts
          </h2>
          <div className="flex gap-3">
            <Link
              href="/report"
              className="text-xs font-semibold text-defender-red hover:underline"
            >
              + Report Impact
            </Link>
            <Link
              href="/admin/impacts"
              className="text-xs font-semibold text-gray-400 hover:text-gray-600"
            >
              View all
            </Link>
          </div>
        </div>
        <ImpactTimeline impacts={impacts} />
      </section>
    </div>
  );
}
