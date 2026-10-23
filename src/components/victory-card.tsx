'use client';

import type { ImpactEvent } from '@/lib/types';

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

function formatMetric(value: number): string {
  if (value >= 1_000_000_000) return `${+(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${+(value / 1_000_000).toFixed(1)}M`;
  if (value >= 100_000) return `${Math.round(value / 1_000)}K`;
  return value.toLocaleString();
}

// Accountability wins alternate red and ink so a run of them still has rhythm
const TONES = {
  red: { card: 'bg-defender-red text-white', metric: 'text-ink', muted: 'text-white/80', rule: 'border-ink/80' },
  ink: { card: 'bg-ink text-paper', metric: 'text-defender-red', muted: 'text-paper/65', rule: 'border-paper/25' },
  green: { card: 'bg-defender-green text-white', metric: 'text-ink', muted: 'text-white/80', rule: 'border-ink/80' },
};

export function VictoryCard({ win, index = 0 }: { win: ImpactEvent; index?: number }) {
  const isAccountability = win.impact_type === 'accountability';
  const tone = !isAccountability ? TONES.green : index % 3 === 1 ? TONES.ink : TONES.red;
  const date = new Date(win.reported_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`group relative flex flex-col border-2 border-ink p-6 min-h-[17rem] shadow-[6px_6px_0_0_#0E0D0C] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#0E0D0C] ${tone.card}`}
    >
      {/* Badge + date row */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <span className={`kicker px-2 py-1 ${tone === TONES.ink ? 'bg-defender-red text-white' : 'bg-ink text-paper'}`}>
          {WIN_TYPE_LABELS[win.impact_type ?? ''] ?? win.impact_type}
        </span>
        <span className={`kicker shrink-0 ${tone.muted}`}>{date}</span>
      </div>

      {/* Headline */}
      <p className="font-serif font-semibold text-[1.4rem] leading-[1.18] tracking-[-0.005em] mb-6">
        {win.internal_headline ?? win.funder_headline ?? win.raw_description.slice(0, 100)}
      </p>

      {/* Metric */}
      <div className={`mt-auto flex items-end justify-between gap-3 pt-4 border-t-2 ${tone.rule}`}>
        {win.radical_metric_value != null ? (
          <div className="flex items-end gap-2.5 min-w-0">
            <span className={`display text-[3.6rem] tabular-nums ${tone.metric}`}>
              {formatMetric(win.radical_metric_value)}
            </span>
            <span className="flex flex-col pb-1 min-w-0">
              {win.radical_metric_unit && (
                <span className="text-sm font-bold leading-tight">{win.radical_metric_unit}</span>
              )}
              {win.radical_metric_label && (
                <span className={`text-[11px] leading-tight truncate ${tone.muted}`}>{win.radical_metric_label}</span>
              )}
            </span>
          </div>
        ) : (
          <span />
        )}
        <span className={`kicker pb-1.5 shrink-0 ${tone.muted}`}>
          {AREA_LABELS[win.program_area] ?? win.program_area}
        </span>
      </div>
    </div>
  );
}
