import { createClient } from '@/lib/supabase/server';
import { KpiGrid } from '@/components/kpi-grid';
import { ImpactTimeline } from '@/components/impact-timeline';
import { BriefingBlock } from '@/components/briefing-block';
import { VictoryCard } from '@/components/victory-card';
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


  const stats: { value: string; label: string }[] = [];
  if (accountabilityWins > 0)
    stats.push({ value: String(accountabilityWins), label: accountabilityWins === 1 ? 'Accountability win' : 'Accountability wins' });
  if (policyWins > 0)
    stats.push({ value: String(policyWins), label: policyWins === 1 ? 'Policy win' : 'Policy wins' });
  if (topReachImpact)
    stats.push({ value: formatMetricValue(topReachImpact.radical_metric_value ?? 0), label: 'Peak story views' });
  if (studentsInFreedomSchool > 0)
    stats.push({ value: String(studentsInFreedomSchool), label: 'In Freedom School' });
  if (familiesServed > 0)
    stats.push({ value: String(familiesServed), label: 'Families served' });

  const year = new Date().getFullYear();

  return (
    <div>
      {/* ── Cover ─────────────────────────────────────────────── */}
      <section className="bg-defender-red text-ink relative overflow-hidden border-b-2 border-ink">
        <div
          aria-hidden
          className="display absolute -right-6 -bottom-10 md:-bottom-16 text-[14rem] md:text-[24rem] leading-none text-ink/[0.07] select-none pointer-events-none"
        >
          {year}
        </div>

        <div className="relative max-w-[1320px] mx-auto px-4 md:px-8 pt-8 pb-10 md:pt-12 md:pb-16 grid md:grid-cols-12 gap-10 md:gap-8 items-end">
          <div className="md:col-span-7 rise">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="kicker bg-ink text-paper px-2.5 py-1">Command Center</span>
              <span className="kicker inline-flex items-center gap-1.5 text-ink/70">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    syncStatus?.status === 'ok'
                      ? 'bg-ink'
                      : syncStatus?.status === 'warning'
                      ? 'bg-defender-gold'
                      : 'bg-ink/30'
                  }`}
                />
                RSS {formatSyncTime(syncStatus?.last_run_at ?? null)}
              </span>
              {pendingCount > 0 && (
                <Link
                  href="/admin/impacts"
                  className="kicker bg-defender-gold text-ink px-2.5 py-1 hover:bg-paper transition-colors"
                >
                  {pendingCount} pending review &rarr;
                </Link>
              )}
            </div>
            <h1 className="display text-[clamp(3.4rem,9vw,8.25rem)] text-ink">
              Building the conditions for{' '}
              <span className="text-paper">victory.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] font-medium text-ink/80 leading-relaxed">
              The Kansas City Defender&apos;s impact, year to date. What we reported, who it moved,
              and what changed because of it.
            </p>
          </div>

          {showStatsStrip && (
            <div className="md:col-span-5 flex flex-col gap-2.5">
              {stats.slice(0, 4).map((s, i) => (
                <CoverStat key={s.label} value={s.value} label={s.label} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Wins ticker ───────────────────────────────────────── */}
      {victories.length > 0 && <WinsTicker wins={victories} />}

      {/* ── Briefing ──────────────────────────────────────────── */}
      <BriefingBlock />

      <div className="max-w-[1320px] mx-auto px-4 md:px-8">
        {/* ── Victory Board ───────────────────────────────────── */}
        {victories.length > 0 && (
          <section className="py-14 md:py-20 border-t-2 border-ink">
            <SectionHead title="Victory Board" note={`${year} to date`} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {victories.map((win, i) => (
                <VictoryCard key={win.id} win={win} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── 5 Pillars of Power ──────────────────────────────── */}
        <section className="py-14 md:py-20 border-t-2 border-ink">
          <SectionHead
            title="5 Pillars of Power"
            action={
              <Link href="/admin/metrics" className="kicker text-ink-3 hover:text-defender-red transition-colors">
                + Add snapshot
              </Link>
            }
          />
          <KpiGrid kpis={kpis} snapshotsByKey={snapshotsByKey} period={period} />
        </section>

        {/* ── Impacts ─────────────────────────────────────────── */}
        <section className="py-14 md:py-20 border-t-2 border-ink">
          <SectionHead
            title={view === 'highlights' ? 'Top Highlights' : 'Recent Impacts'}
            action={
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-ink">
                  <Link
                    href={`/admin?period=${period}&view=highlights`}
                    className={`text-xs font-bold px-3 py-1.5 transition-colors ${
                      view === 'highlights' ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/[0.06]'
                    }`}
                  >
                    Highlights
                  </Link>
                  <Link
                    href={`/admin?period=${period}&view=recent`}
                    className={`text-xs font-bold px-3 py-1.5 transition-colors ${
                      view === 'recent' ? 'bg-ink text-paper' : 'text-ink hover:bg-ink/[0.06]'
                    }`}
                  >
                    Recent
                  </Link>
                </div>
                <Link href="/admin/impacts" className="kicker text-ink-3 hover:text-ink">
                  View all &rarr;
                </Link>
              </div>
            }
          />
          <ImpactTimeline impacts={impacts} />
        </section>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SectionHead({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <h2 className="slab">{title}</h2>
      {note && <span className="kicker text-ink-3">{note}</span>}
      {action}
    </div>
  );
}

const COVER_STAT_STYLES = [
  { bar: 'bg-ink', value: 'text-defender-red', label: 'text-paper', tilt: 'md:-rotate-[1.2deg]' },
  { bar: 'bg-paper', value: 'text-defender-red', label: 'text-ink', tilt: 'md:rotate-[0.8deg]' },
  { bar: 'bg-ink', value: 'text-defender-gold', label: 'text-paper', tilt: 'md:-rotate-[0.5deg]' },
  { bar: 'bg-ink', value: 'text-paper', label: 'text-paper/70', tilt: 'md:rotate-[1deg]' },
];

function CoverStat({ value, label, index }: { value: string; label: string; index: number }) {
  const s = COVER_STAT_STYLES[index % COVER_STAT_STYLES.length];
  return (
    <div
      className={`rise ${s.bar} ${s.tilt} flex items-center justify-between gap-4 px-5 py-3 transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]`}
      style={{ animationDelay: `${150 + index * 90}ms` }}
    >
      <span className={`display text-[clamp(2.75rem,5vw,4rem)] tabular-nums ${s.value}`}>{value}</span>
      <span className={`display text-right text-[clamp(1.1rem,2vw,1.5rem)] leading-[0.95] ${s.label}`}>
        {label}
      </span>
    </div>
  );
}

function WinsTicker({ wins }: { wins: ImpactEvent[] }) {
  const items = wins.map((w) => w.internal_headline ?? w.funder_headline ?? w.raw_description.slice(0, 80));
  // Duplicate the run so the -50% translate loops seamlessly
  const loop = [...items, ...items];
  return (
    <div className="bg-ink overflow-hidden border-b-2 border-ink" aria-label="Recent wins">
      <div className="marquee-track flex w-max items-center gap-8 py-3.5 pr-8">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap" aria-hidden={i >= items.length}>
            <span className="display text-[1.35rem] text-defender-gold">{t}</span>
            <span className="text-defender-red text-lg">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
