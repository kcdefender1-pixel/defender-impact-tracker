import { createClient } from '@/lib/supabase/server';
import { KpiGrid } from '@/components/kpi-grid';
import { ImpactTimeline } from '@/components/impact-timeline';
import { BriefingBlock } from '@/components/briefing-block';
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

function getCutoff(period: string): string | null {
  const now = new Date();

  if (period === 'this_month') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }
  if (period === '30d') {
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === '60d') {
    return new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  }
  if (period === '90d') {
    return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }

  return null; // all time
}

interface CommandCenterProps {
  searchParams: { period?: string; view?: string };
}

export default async function CommandCenter({ searchParams }: CommandCenterProps) {
  const period = searchParams.period ?? '30d';
  const view = searchParams.view ?? 'highlights';
  const cutoff = getCutoff(period);

  const supabase = createClient();

  // Fetch all data in parallel
  let snapshotsQuery = supabase.from('metric_snapshots').select('*').order('taken_at', { ascending: false });
  if (cutoff) {
    snapshotsQuery = snapshotsQuery.gte('taken_at', cutoff);
  }

  const [kpisRes, snapshotsRes, impactsRes, syncRes, pendingRes] = await Promise.all([
    supabase.from('kpi_config').select('*').order('sort_order', { ascending: true }),
    snapshotsQuery,
    view === 'highlights'
      ? supabase
          .from('impact_events')
          .select('*')
          .eq('status', 'approved')
          .order('confidence', { ascending: false })
          .limit(10)
      : supabase
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

      {/* Impact Briefing */}
      <section className="mb-10">
        <BriefingBlock />
      </section>

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
        <KpiGrid kpis={kpis} snapshotsByKey={snapshotsByKey} period={period} />
      </section>

      {/* Impacts timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-defender-black tracking-tight">
              {view === 'highlights' ? 'Top Highlights' : 'Recent Impacts'}
            </h2>
            {/* View toggle tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
              <Link
                href={`/?period=${period}&view=highlights`}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                  view === 'highlights'
                    ? 'bg-defender-red text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Top Highlights
              </Link>
              <Link
                href={`/?period=${period}&view=recent`}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                  view === 'recent'
                    ? 'bg-defender-red text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Recent
              </Link>
            </div>
          </div>
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
