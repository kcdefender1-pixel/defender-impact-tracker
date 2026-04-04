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

export function VictoryCard({ win }: { win: ImpactEvent }) {
  const isAccountability = win.impact_type === 'accountability';
  const date = new Date(win.reported_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden ${
        isAccountability
          ? 'bg-gradient-to-br from-[#7f1d1d] to-[#be123c]'
          : 'bg-gradient-to-br from-[#14532d] to-[#15803d]'
      }`}
    >
      <div className="p-5">
        {/* Badge + date row */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white/90 border border-white/10">
            {WIN_TYPE_LABELS[win.impact_type ?? ''] ?? win.impact_type}
          </span>
          <span className="text-[11px] text-white/50 shrink-0 font-mono">{date}</span>
        </div>

        {/* Headline */}
        <p className="text-[15px] font-bold text-white leading-snug mb-3">
          {win.internal_headline ?? win.funder_headline ?? win.raw_description.slice(0, 100)}
        </p>

        {/* Metric */}
        {win.radical_metric_value != null && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-white/90 tabular-nums tracking-tight">
              {win.radical_metric_value.toLocaleString()}
            </span>
            <div className="flex flex-col">
              {win.radical_metric_unit && (
                <span className="text-xs text-white/60 font-medium">{win.radical_metric_unit}</span>
              )}
              {win.radical_metric_label && (
                <span className="text-[10px] text-white/40">{win.radical_metric_label}</span>
              )}
            </div>
          </div>
        )}

        {/* Program area */}
        <div className="text-[11px] text-white/40 font-medium">
          {AREA_LABELS[win.program_area] ?? win.program_area}
        </div>
      </div>
    </div>
  );
}
