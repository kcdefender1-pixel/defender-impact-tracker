'use client';

import { useState } from 'react';
import type { AIEnhancementResult, ImpactFormData } from '@/lib/types';
import { IMPACT_TYPES, KPI_KEYS } from '@/lib/constants';

interface AiReviewPanelProps {
  rawData: ImpactFormData;
  aiResult: AIEnhancementResult;
  onSave: (edited: AIEnhancementResult) => void;
  onReset: () => void;
  isSaving: boolean;
}

const KPI_LABELS: Record<string, string> = {
  audience_growth_total_reach: 'Audience Growth',
  stories_published_total_weekly: 'Stories Published',
  editorial_narrative_power_pct: 'Editorial Narrative Power',
  political_education_participants: 'Political Education Participants',
  mutual_aid_participation_team_members: 'Mutual Aid Participation',
  community_served_count: 'Community Served',
  arts_culture_engagement_attendees_artists: 'Arts & Culture Engagement',
  membership_sustaining_donors_new_monthly: 'New Sustaining Donors',
  membership_retention_rate: 'Membership Retention',
  revenue_mix_quarterly_share_and_growth: 'Revenue Mix',
};

export function AiReviewPanel({
  rawData,
  aiResult,
  onSave,
  onReset,
  isSaving,
}: AiReviewPanelProps) {
  const [edited, setEdited] = useState<AIEnhancementResult>({ ...aiResult });

  const update = (field: keyof AIEnhancementResult, value: unknown) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const toggleKpi = (key: string) => {
    const kpis = edited.kpis_impacted.includes(key)
      ? edited.kpis_impacted.filter((k) => k !== key)
      : [...edited.kpis_impacted, key];
    update('kpis_impacted', kpis);
  };

  const labelClass = 'block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1';
  const inputClass =
    'w-full rounded-[10px] border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-colors';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Raw submission */}
      <div className="space-y-4">
        <div className="bg-surface-card border border-white/[0.07] rounded-card p-5">
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
            Your Submission
          </div>
          <div className="space-y-3 text-sm text-white/65">
            <div>
              <span className="font-semibold text-white">{rawData.reported_by_name}</span>
              {rawData.reported_by_email && (
                <span className="text-white/35 ml-1">({rawData.reported_by_email})</span>
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Program Area</span>
              <div className="mt-0.5 capitalize">{rawData.program_area.replace(/_/g, ' ')}</div>
            </div>
            {rawData.location_text && (
              <div>
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Location</span>
                <div className="mt-0.5">{rawData.location_text}</div>
              </div>
            )}
            <div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Description</span>
              <div className="mt-1 leading-relaxed whitespace-pre-wrap">{rawData.raw_description}</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-card p-4">
          <div className="text-xs font-semibold text-amber-400 mb-1">Confidence Score</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-amber-500/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${edited.confidence}%` }}
              />
            </div>
            <span className="text-sm font-bold font-mono text-amber-300">
              {edited.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Right: AI outputs (editable) */}
      <div className="space-y-4">
        <div className="bg-surface-card border border-white/[0.07] rounded-card p-5 space-y-4">
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
            AI Enhancement - Review and Edit
          </div>

          <div>
            <label className={labelClass}>Narrative</label>
            <textarea
              value={edited.ai_narrative}
              onChange={(e) => update('ai_narrative', e.target.value)}
              rows={4}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Internal Headline (staff-facing)</label>
            <input
              type="text"
              value={edited.internal_headline}
              onChange={(e) => update('internal_headline', e.target.value)}
              maxLength={100}
              className={inputClass}
            />
            <div className="text-right text-xs text-white/35 mt-0.5">
              {edited.internal_headline.length}/100
            </div>
          </div>

          <div>
            <label className={labelClass}>Funder Headline (external)</label>
            <input
              type="text"
              value={edited.funder_headline}
              onChange={(e) => update('funder_headline', e.target.value)}
              maxLength={110}
              className={inputClass}
            />
            <div className="text-right text-xs text-white/35 mt-0.5">
              {edited.funder_headline.length}/110
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Metric Label</label>
              <input
                type="text"
                value={edited.radical_metric_label ?? ''}
                onChange={(e) => update('radical_metric_label', e.target.value || null)}
                placeholder="e.g. Families Fed"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Value</label>
              <input
                type="number"
                value={edited.radical_metric_value ?? ''}
                onChange={(e) =>
                  update('radical_metric_value', e.target.value ? Number(e.target.value) : null)
                }
                placeholder="47"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <input
                type="text"
                value={edited.radical_metric_unit ?? ''}
                onChange={(e) => update('radical_metric_unit', e.target.value || null)}
                placeholder="families"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Impact Type</label>
            <select
              value={edited.impact_type}
              onChange={(e) => update('impact_type', e.target.value)}
              className={inputClass}
            >
              {IMPACT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>KPIs Impacted</label>
            <div className="grid grid-cols-1 gap-1.5 mt-1">
              {KPI_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={edited.kpis_impacted.includes(key)}
                    onChange={() => toggleKpi(key)}
                    className="w-3.5 h-3.5 accent-defender-red"
                  />
                  <span className="text-xs text-white/55 group-hover:text-white transition-colors">
                    {KPI_LABELS[key]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onSave(edited)}
            disabled={isSaving}
            className="flex-1 bg-defender-red text-white rounded-button px-4 py-3 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Impact'}
          </button>
          <button
            onClick={onReset}
            disabled={isSaving}
            className="px-4 py-3 text-sm font-semibold text-white/50 border border-white/10 rounded-button hover:bg-white/[0.05] transition-colors disabled:opacity-60"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
