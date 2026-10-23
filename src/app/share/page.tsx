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

  const briefingParagraphs = briefingText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

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
          <div className="kicker text-defender-red mb-2">
            The Kansas City Defender
          </div>
          <h1 className="display text-[3rem] md:text-[4rem] text-ink">
            Impact Report
          </h1>
          <p className="text-ink-3 text-sm mt-1.5">{today}</p>
        </div>
        <PrintButton />
      </div>

      {/* Briefing */}
      <section className="mb-14 font-serif text-ink">
        <div className="kicker text-defender-red mb-5 font-sans">Impact Briefing &middot; Year to date</div>
        {briefingParagraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'dropcap text-[1.4rem] md:text-[1.6rem] leading-[1.42] mb-6'
                : i === briefingParagraphs.length - 1 && briefingParagraphs.length > 2
                ? 'italic text-[1.7rem] md:text-[2.2rem] leading-[1.15] mt-10 pt-7 border-t-2 border-ink'
                : 'text-[1.12rem] md:text-[1.2rem] leading-[1.65] text-ink-2 mb-5'
            }
          >
            {p}
          </p>
        ))}
      </section>

      {/* Stats strip */}
      {(accountabilityWins > 0 || policyWins > 0 || students > 0 || mutualAidFamilies > 0 || topViews) && (
        <section className="mb-14 flex flex-wrap gap-[2px] bg-ink border-2 border-ink">
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
        </section>
      )}

      {/* Victory Board */}
      {victories.length > 0 && (
        <section className="mb-14">
          <div className="flex items-end justify-between mb-6">
            <h2 className="slab">Victory Board</h2>
            <span className="kicker text-ink-3">Year to date</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {victories.map((win, i) => (
              <VictoryCard key={win.id} win={win} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Top Highlights */}
      {highlights.length > 0 && (
        <section className="mb-14">
          <h2 className="slab mb-6">Top Highlights</h2>
          <div className="space-y-3">
            {highlights.map((impact) => (
              <ShareHighlightCard key={impact.id} impact={impact} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="pt-6 border-t border-line text-center">
        <div className="text-xs text-ink-3">
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
  const valueColor = { red: 'text-defender-red', green: 'text-defender-green', gold: 'text-[#B07D00]' }[color];
  return (
    <div className="bg-card px-5 py-5 flex-1 min-w-[40%] md:min-w-0">
      <div className={`display text-[3.25rem] tabular-nums ${valueColor}`}>{value}</div>
      <div className="kicker text-ink-3 mt-2">{label}</div>
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
    <div className="bg-card border-2 border-ink p-5 flex gap-4 items-start">
      <div className="shrink-0 mt-0.5">
        <div className="w-2.5 h-2.5 bg-defender-red" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-medium text-ink-3">{date}</span>
          <span className="text-[11px] font-medium text-defender-red/70">
            {AREA_LABELS[impact.program_area] ?? impact.program_area}
          </span>
        </div>
        <p className="font-serif font-semibold text-[1.15rem] text-ink leading-snug mb-1.5">
          {impact.funder_headline ?? impact.internal_headline ?? impact.raw_description.slice(0, 120)}
        </p>
        {impact.radical_metric_value != null && (
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className="font-bold text-ink">{impact.radical_metric_value.toLocaleString()}</span>
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
