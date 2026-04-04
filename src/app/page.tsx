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

function formatMetricValue(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return String(val);
}

interface CommandCenterProps {
  searchParams: { period?: string; view?: string };
}

export default async function CommandCenter({ searchParams }: CommandCenterProps) {
  const period = searchParams.period ?? 'all';
  const view = searchParams.view ?? 'highlights';
  const cutoff = getCutoff(period);

  // Year-to-date start for Victory Board (always Jan 1 of current year)
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

  const supabase = createClient();

  let snapshotsQuery = supabase.from('metric_snapshots').select('*').order('taken_at', { ascending: false });
  if (cutoff) {
    snapshotsQuery = snapshotsQuery.gte('taken_at', cutoff);
  }

  // Period-filtered impacts for the timeline
  let impactsQuery = supabase
    .from('impact_events')
    .select('*')
    .eq('status', 'approved');
  if (cutoff) {
    impactsQuery = impactsQuery.gte('reported_at', cutoff);
  }
  const impactsOrdered =
    view === 'highlights'
      ? impactsQuery.order('confidence', { ascending: false }).limit(10)
      : impactsQuery.order('reported_at', { ascending: false }).limit(10);

  const [kpisRes, snapshotsRes, impactsRes, syncRes, pendingRes, victoriesRes] = await Promise.all([
    supabase.from('kpi_config').select('*').order('sort_order', { ascending: true }),
    snapshotsQuery,
    impactsOrdered,
    supabase
      .from('integration_status')
      .select('*')
      .eq('name', 'rss_kansascitydefender')
      .maybeSingle(),
    supabase
      .from('impact_events')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    // Victory Board: accountability + policy wins, year-to-date, always unfiltered by period
    supabase
      .from('impact_events')
      .select('*')
      .eq('status', 'approved')
      .in('impact_type', ['accountability', 'policy_win'])
      .gte('reported_at', yearStart)
      .order('confidence', { ascending: false })
      .limit(6),
  ]);

  const kpis: KpiConfig[] = kpisRes.data ?? [];
  const allSnapshots: MetricSnapshot[] = snapshotsRes.data ?? [];
  const impacts: ImpactEvent[] = impactsRes.data ?? [];
  const syncStatus: IntegrationStatus | null = syncRes.data ?? null;
  const pendingCount: number = pendingRes.count ?? 0;
  const victories: ImpactEvent[] = victoriesRes.data ?? [];

  // Group snapshots by metric_key, keep last 6 per key for sparklines
  const snapshotsByKey: Record<string, MetricSnapshot[]> = {};
  for (const snap of allSnapshots) {
    if (!snapshotsByKey[snap.metric_key]) snapshotsByKey[snap.metric_key] = [];
    if (snapshotsByKey[snap.metric_key].length < 6) {
      snapshotsByKey[snap.metric_key].push(snap);
    }
  }

  // Stats strip: aggregate year-to-date from victories + period-filtered impacts
  const allImpactsForStats = victoriesRes.data ?? [];
  const accountabilityWins = allImpactsForStats.filter(
    (v: ImpactEvent) => v.impact_type === 'accountability'
  ).length;
  const policyWins = allImpactsForStats.filter(
    (v: ImpactEvent) => v.impact_type === 'policy_win'
  ).length;

  // For mutual aid and education stats, pull from current period impacts
  const mutualAidImpacts = impacts.filter((i) => i.program_area === 'mutual_aid');
  const familiesServed = mutualAidImpacts
    .filter((i) => i.radical_metric_unit === 'families' && i.radical_metric_value)
    .reduce((sum, i) => sum + (i.radical_metric_value ?? 0), 0);

  const edImpacts = impacts.filter(
    (i) => i.program_area === 'political_education' && i.radical_metric_value
  );
  const studentsInFreedomSchool =
    edImpacts.length > 0
      ? Math.max(...edImpacts.map((i) => i.radical_metric_value ?? 0))
      : 0;

  // Highest reach story
  const topReachImpact = [...impacts]
    .filter((i) => i.radical_metric_unit === 'views' && i.radical_metric_value)
    .sort((a, b) => (b.radical_metric_value ?? 0) - (a.radical_metric_value ?? 0))[0];

  const showStatsStrip =
    accountabilityWins > 0 ||
    policyWins > 0 ||
    familiesServed > 0 ||
    studentsInFreedomSchool > 0 ||
    topReachImpact != null;

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
      <section className="mb-8">
        <BriefingBlock />
      </section>

      {/* What We Built stats strip */}
      {showStatsStrip && (
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accountabilityWins > 0 && (
              <StatPill
                value={String(accountabilityWins)}
                label={accountabilityWins === 1 ? 'Accountability Win' : 'Accountability Wins'}
                color="red"
              />
            )}
            {policyWins > 0 && (
              <StatPill
                value={String(policyWins)}
                label={policyWins === 1 ? 'Policy Win' : 'Policy Wins'}
                color="green"
              />
            )}
            {studentsInFreedomSchool > 0 && (
              <StatPill
                value={String(studentsInFreedomSchool)}
                label="In Freedom School"
                color="gold"
              />
            )}
            {familiesServed > 0 && (
              <StatPill
                value={String(familiesServed)}
                label="Families Served"
                color="green"
              />
            )}
            {topReachImpact && (
              <StatPill
                value={formatMetricValue(topReachImpact.radical_metric_value ?? 0)}
                label="Peak Story Views"
                color="gold"
              />
            )}
          </div>
        </section>
      )}

      {/* Victory Board */}
      {victories.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-defender-black tracking-tight">
              Victory Board
            </h2>
            <span className="text-xs text-gray-400">Year to date</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {victories.map((win) => (
              <VictoryCard key={win.id} win={win} />
            ))}
          </div>
        </section>
      )}

      {/* 5 Pillars of Power */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-defender-black tracking-tight">
            5 Pillars of Power
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

// --- Sub-components ---

function StatPill({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: 'red' | 'green' | 'gold';
}) {
  const colorMap = {
    red: { bg: 'bg-red-50', border: 'border-red-100', val: 'text-defender-red', label: 'text-red-700' },
    green: { bg: 'bg-green-50', border: 'border-green-100', val: 'text-defender-green', label: 'text-green-700' },
    gold: { bg: 'bg-amber-50', border: 'border-amber-100', val: 'text-amber-600', label: 'text-amber-700' },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl px-4 py-3`}>
      <div className={`text-2xl font-bold tabular-nums tracking-tight ${c.val}`}>{value}</div>
      <div className={`text-xs font-medium mt-0.5 ${c.label}`}>{label}</div>
    </div>
  );
}

const WIN_TYPE_LABELS: Record<string, string> = {
  accountability: 'Accountability Win',
  policy_win: 'Policy Win',
};

const AREA_LABELS: Record<string, string> = {
  editorial: 'Editorial',
  mutual_aid: 'Mutual Aid',
  political_education: 'Political Education',
  arts_culture: 'Arts & Culture',
  development_fundraising: 'Development',
  operations_systems: 'Operations',
  radar: 'Radar',
  other: 'Other',
};

function VictoryCard({ win }: { win: ImpactEvent }) {
  const isAccountability = win.impact_type === 'accountability';
  const date = new Date(win.reported_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
      style={{ borderLeft: `3px solid ${isAccountability ? '#E11D48' : '#16A34A'}` }}
    >
      <div className="flex items-center justify-between mb-2 gap-2">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            isAccountability
              ? 'bg-red-50 text-defender-red'
              : 'bg-green-50 text-defender-green'
          }`}
        >
          {WIN_TYPE_LABELS[win.impact_type ?? ''] ?? win.impact_type}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{date}</span>
      </div>

      <p className="text-sm font-bold text-defender-black leading-snug mb-2">
        {win.internal_headline ?? win.funder_headline ?? win.raw_description.slice(0, 80)}
      </p>

      {win.radical_metric_value != null && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`text-lg font-bold tabular-nums ${
              isAccountability ? 'text-defender-red' : 'text-defender-green'
            }`}
          >
            {win.radical_metric_value.toLocaleString()}
          </span>
          {win.radical_metric_unit && (
            <span className="text-xs text-gray-500">{win.radical_metric_unit}</span>
          )}
          {win.radical_metric_label && (
            <span className="text-xs text-gray-400">· {win.radical_metric_label}</span>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400">
        {AREA_LABELS[win.program_area] ?? win.program_area}
      </div>
    </div>
  );
}
