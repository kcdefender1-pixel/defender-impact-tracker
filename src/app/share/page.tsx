import { createClient } from '@/lib/supabase/server';
import { VictoryCard } from '@/components/victory-card';
import { PrintButton } from '@/components/print-button';
import { generateBriefing } from '@/lib/briefing';
import type { ImpactEvent } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function formatMetricValue(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return String(val);
}

export default async function SharePage() {
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
  const supabase = createClient();

  const [briefingText, victoriesRes, highlightsRes] = await Promise.all([
    generateBriefing().catch(() => 'The Kansas City Defender is building power every day.'),
    supabase
      .from('impact_events')
      .select('*')
      .eq('status', 'approved')
      .in('impact_type', ['accountability', 'policy_win'])
      .gte('reported_at', yearStart)
      .order('confidence', { ascending: false })
      .limit(6),
    supabase
      .from('impact_events')
      .select('*')
      .eq('status', 'approved')
      .gte('reported_at', yearStart)
      .order('confidence', { ascending: false })
      .limit(5),
  ]);

  const victories: ImpactEvent[] = victoriesRes.data ?? [];
  const highlights: ImpactEvent[] = highlightsRes.data ?? [];

  // Stats
  const accountabilityWins = victories.filter((v) => v.impact_type === 'accountability').length;
  const policyWins = victories.filter((v) => v.impact_type === 'policy_win').length;

  const mutualAidFamilies = highlights
    .filter((i) => i.radical_metric_unit === 'families' && i.radical_metric_value)
    .reduce((sum, i) => sum + (i.radical_metric_value ?? 0), 0);

  const edImpacts = highlights.filter(
    (i) => i.program_area === 'political_education' && i.radical_metric_value
  );
  const students = edImpacts.length > 0 ? Math.max(...edImpacts.map((i) => i.radical_metric_value ?? 0)) : 0;

  const topViews = highlights
    .filter((i) => i.radical_metric_unit === 'views' && i.radical_metric_value)
    .sort((a, b) => (b.radical_metric_value ?? 0) - (a.radical_metric_value ?? 0))[0];

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 md:py-14">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
            The Kansas City Defender
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Impact Report
          </h1>
          <p className="text-white/45 text-sm mt-1.5">{today}</p>
        </div>
        <PrintButton />
      </div>

      {/* Briefing */}
      <section className="mb-10">
        <div className="bg-surface-card border border-white/[0.07] rounded-card p-6 md:p-8">
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-3">
            Impact Briefing
          </div>
          <div className="w-12 h-[2px] bg-defender-red/30 mb-4" />
          <p className="text-[1.05rem] text-white/80 leading-[1.7] font-medium">
            {briefingText}
          </p>
        </div>
      </section>

      {/* Stats strip */}
      {(accountabilityWins > 0 || policyWins > 0 || students > 0 || mutualAidFamilies > 0 || topViews) && (
        <section className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accountabilityWins > 0 && (
              <ShareStat value={String(accountabilityWins)} label={accountabilityWins === 1 ? 'Accountability Win' : 'Accountability Wins'} color="red" />
            )}
            {policyWins > 0 && (
              <ShareStat value={String(policyWins)} label={policyWins === 1 ? 'Policy Win' : 'Policy Wins'} color="green" />
            )}
            {students > 0 && (
              <ShareStat value={String(students)} label="In Freedom School" color="gold" />
            )}
            {mutualAidFamilies > 0 && (
              <ShareStat value={String(mutualAidFamilies)} label="Families Served" color="green" />
            )}
            {topViews && (
              <ShareStat value={formatMetricValue(topViews.radical_metric_value ?? 0)} label="Peak Story Views" color="gold" />
            )}
          </div>
        </section>
      )}

      {/* Victory Board */}
      {victories.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Victory Board
            </h2>
            <span className="text-xs text-white/35">Year to date</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {victories.map((win) => (
              <VictoryCard key={win.id} win={win} />
            ))}
          </div>
        </section>
      )}

      {/* Top Highlights */}
      {highlights.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4">
            Top Highlights
          </h2>
          <div className="space-y-3">
            {highlights.map((impact) => (
              <ShareHighlightCard key={impact.id} impact={impact} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="pt-6 border-t border-white/[0.07] text-center">
        <div className="text-xs text-white/35">
          The Kansas City Defender &middot; Impact Dashboard &middot; {today}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ShareStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: 'red' | 'green' | 'gold';
}) {
  const colorMap = {
    red:   { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    val: 'text-rose-400',    label: 'text-rose-300'    },
    green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', val: 'text-emerald-400', label: 'text-emerald-300' },
    gold:  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   val: 'text-amber-400',   label: 'text-amber-300'   },
  };
  const c = colorMap[color];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl px-4 py-3`}>
      <div className={`text-2xl font-bold tabular-nums tracking-tight ${c.val}`}>{value}</div>
      <div className={`text-xs font-medium mt-0.5 ${c.label}`}>{label}</div>
    </div>
  );
}

const AREA_LABELS: Record<string, string> = {
  editorial: 'Editorial',
  mutual_aid: 'Mutual Aid',
  political_education: 'Political Education',
  arts_culture: 'Arts & Culture',
  development_fundraising: 'Development',
  other: 'Other',
};

function ShareHighlightCard({ impact }: { impact: ImpactEvent }) {
  const date = new Date(impact.reported_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-surface-card border border-white/[0.07] rounded-xl p-4 flex gap-4 items-start">
      <div className="shrink-0 mt-0.5">
        <div className="w-2 h-2 rounded-full bg-defender-red" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-medium text-white/35">{date}</span>
          <span className="text-[11px] font-medium text-defender-red/70">
            {AREA_LABELS[impact.program_area] ?? impact.program_area}
          </span>
        </div>
        <p className="text-sm font-bold text-white leading-snug mb-1">
          {impact.funder_headline ?? impact.internal_headline ?? impact.raw_description.slice(0, 120)}
        </p>
        {impact.radical_metric_value != null && (
          <div className="flex items-center gap-1.5 text-xs text-white/45">
            <span className="font-bold text-white">{impact.radical_metric_value.toLocaleString()}</span>
            {impact.radical_metric_unit && <span>{impact.radical_metric_unit}</span>}
          </div>
        )}
      </div>
      {impact.confidence >= 90 && (
        <div className="shrink-0 text-[10px] font-bold text-defender-green bg-emerald-500/10 rounded-full px-2 py-0.5">
          {impact.confidence}%
        </div>
      )}
    </div>
  );
}
