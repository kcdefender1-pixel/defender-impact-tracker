'use client';

import { useState } from 'react';
import type { ImpactEvent } from '@/lib/types';
import { PROGRAM_AREA_BADGE, PROGRAM_AREA_DOT, PROGRAM_AREAS } from '@/lib/constants';
import Link from 'next/link';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor(diff / 60_000);
  if (days > 30) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

function formatMetric(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return value.toLocaleString();
}

const KPI_KEY_LABELS: Record<string, string> = {
  audience_growth_total_reach: 'Narrative Impact',
  stories_published_total_weekly: 'Stories Published',
  editorial_narrative_power_pct: 'Narrative Power',
  political_education_participants: 'Political Ed',
  mutual_aid_participation_team_members: 'Mutual Aid',
  community_served_count: 'Community Served',
  arts_culture_engagement_attendees_artists: 'Arts & Culture',
  membership_sustaining_donors_new_monthly: 'New Sustainers',
  membership_retention_rate: 'Retention',
  revenue_mix_quarterly_share_and_growth: 'Revenue',
};

interface EditState {
  internal_headline: string;
  funder_headline: string;
  raw_description: string;
  radical_metric_value: string;
  radical_metric_label: string;
  radical_metric_unit: string;
}

interface ImpactCardProps {
  impact: ImpactEvent;
}

function ImpactCard({ impact: initialImpact }: ImpactCardProps) {
  const [impact, setImpact] = useState<ImpactEvent>(initialImpact);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    internal_headline: impact.internal_headline ?? '',
    funder_headline: impact.funder_headline ?? '',
    raw_description: impact.raw_description,
    radical_metric_value: impact.radical_metric_value !== null ? String(impact.radical_metric_value) : '',
    radical_metric_label: impact.radical_metric_label ?? '',
    radical_metric_unit: impact.radical_metric_unit ?? '',
  });

  const programLabel =
    PROGRAM_AREAS.find((a) => a.value === impact.program_area)?.label ?? impact.program_area;
  const dotColor = PROGRAM_AREA_DOT[impact.program_area] ?? 'bg-gray-400';
  const badgeColor = PROGRAM_AREA_BADGE[impact.program_area] ?? 'bg-gray-100 text-gray-600';

  function handleExpand() {
    if (editing) return;
    setExpanded((v) => !v);
  }

  function startEdit() {
    setEditState({
      internal_headline: impact.internal_headline ?? '',
      funder_headline: impact.funder_headline ?? '',
      raw_description: impact.raw_description,
      radical_metric_value: impact.radical_metric_value !== null ? String(impact.radical_metric_value) : '',
      radical_metric_label: impact.radical_metric_label ?? '',
      radical_metric_unit: impact.radical_metric_unit ?? '',
    });
    setSaveError(null);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setSaveError(null);
  }

  async function saveEdit() {
    setSaving(true);
    setSaveError(null);
    try {
      const body: Record<string, unknown> = {
        internal_headline: editState.internal_headline || null,
        funder_headline: editState.funder_headline || null,
        raw_description: editState.raw_description,
        radical_metric_value: editState.radical_metric_value !== ''
          ? parseFloat(editState.radical_metric_value)
          : null,
        radical_metric_label: editState.radical_metric_label || null,
        radical_metric_unit: editState.radical_metric_unit || null,
      };

      const res = await fetch(`/api/impact-events/${impact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error ?? 'Save failed');
        return;
      }

      const { impact: updated } = await res.json();
      setImpact(updated);
      setEditing(false);
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const displayNarrative = impact.ai_narrative ?? impact.raw_description;
  const displayHeadline = impact.internal_headline ?? impact.raw_description.slice(0, 100);

  return (
    <div className="border-b border-gray-50 last:border-b-0">
      {/* Collapsed row — always visible, click to expand */}
      <button
        type="button"
        onClick={handleExpand}
        className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors group focus:outline-none"
        aria-expanded={expanded}
      >
        {/* Dot */}
        <div className="shrink-0 mt-1.5">
          <div className={`w-2 h-2 rounded-full ${dotColor} transition-all group-hover:scale-125`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-defender-black text-sm leading-snug">
            {displayHeadline}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor}`}>
              {programLabel}
            </span>
            {impact.reported_by_name && (
              <span className="text-xs text-gray-400">{impact.reported_by_name}</span>
            )}
          </div>
        </div>

        {/* Metric + time + chevron */}
        <div className="shrink-0 text-right flex items-start gap-3">
          <div>
            {impact.radical_metric_value !== null && impact.radical_metric_label && (
              <div>
                <span className="font-mono font-bold text-defender-black text-sm">
                  {formatMetric(Number(impact.radical_metric_value))}
                </span>
                <div className="text-[10px] text-gray-400 leading-tight">{impact.radical_metric_label}</div>
              </div>
            )}
            <div className="text-[10px] font-mono text-gray-400 mt-1">{timeAgo(impact.reported_at)}</div>
          </div>
          {/* Chevron */}
          <div
            className="mt-1 text-gray-300 group-hover:text-gray-400 transition-all"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </button>

      {/* Expandable detail panel — CSS grid trick for smooth height animation */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-5 pb-5 pt-1 bg-gray-50/40 border-t border-gray-100">
            {!editing ? (
              /* ── READ MODE ─────────────────────────────── */
              <div className="space-y-4">
                {/* Narrative */}
                {displayNarrative && (
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Impact Narrative
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{displayNarrative}</p>
                  </div>
                )}

                {/* Funder headline */}
                {impact.funder_headline && (
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Funder Headline
                    </div>
                    <p className="text-sm text-gray-600 italic">{impact.funder_headline}</p>
                  </div>
                )}

                {/* Metric detail */}
                {impact.radical_metric_value !== null && (
                  <div className="flex items-end gap-1.5">
                    <span className="font-mono font-black text-3xl text-defender-black leading-none">
                      {formatMetric(Number(impact.radical_metric_value))}
                    </span>
                    <span className="text-sm text-gray-500 mb-0.5">
                      {impact.radical_metric_unit ?? ''}{impact.radical_metric_label ? ` · ${impact.radical_metric_label}` : ''}
                    </span>
                  </div>
                )}

                {/* KPIs impacted */}
                {impact.kpis_impacted && impact.kpis_impacted.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      KPIs Impacted
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {impact.kpis_impacted.map((k) => (
                        <span
                          key={k}
                          className="text-[10px] font-semibold bg-defender-red/10 text-defender-red rounded-full px-2 py-0.5"
                        >
                          {KPI_KEY_LABELS[k] ?? k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence links */}
                {impact.evidence_links && impact.evidence_links.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Evidence
                    </div>
                    <div className="flex flex-col gap-1">
                      {impact.evidence_links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-defender-red hover:underline truncate"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Confidence
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-defender-green rounded-full"
                          style={{ width: `${impact.confidence}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">{impact.confidence}%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={startEdit}
                    className="text-xs font-semibold text-defender-red hover:text-defender-red/80 transition-colors flex items-center gap-1"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M7.5 1.5L9.5 3.5L3.5 9.5H1.5V7.5L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              /* ── EDIT MODE ─────────────────────────────── */
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-defender-red uppercase tracking-widest mb-2">
                  Editing Impact
                </div>

                {/* Internal headline */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Internal Headline
                  </label>
                  <input
                    type="text"
                    value={editState.internal_headline}
                    onChange={(e) => setEditState((s) => ({ ...s, internal_headline: e.target.value }))}
                    className="w-full text-sm font-semibold text-defender-black border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white"
                    placeholder="Internal headline..."
                  />
                </div>

                {/* Funder headline */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Funder Headline
                  </label>
                  <input
                    type="text"
                    value={editState.funder_headline}
                    onChange={(e) => setEditState((s) => ({ ...s, funder_headline: e.target.value }))}
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white"
                    placeholder="Funder headline..."
                  />
                </div>

                {/* Raw description */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Description
                  </label>
                  <textarea
                    value={editState.raw_description}
                    onChange={(e) => setEditState((s) => ({ ...s, raw_description: e.target.value }))}
                    rows={3}
                    className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white resize-none"
                    placeholder="Description..."
                  />
                </div>

                {/* Metric fields */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Metric Value
                    </label>
                    <input
                      type="number"
                      value={editState.radical_metric_value}
                      onChange={(e) => setEditState((s) => ({ ...s, radical_metric_value: e.target.value }))}
                      className="w-full text-sm font-mono text-defender-black border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white"
                      placeholder="e.g. 411000"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={editState.radical_metric_label}
                      onChange={(e) => setEditState((s) => ({ ...s, radical_metric_label: e.target.value }))}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white"
                      placeholder="e.g. Views"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={editState.radical_metric_unit}
                      onChange={(e) => setEditState((s) => ({ ...s, radical_metric_unit: e.target.value }))}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-all bg-white"
                      placeholder="e.g. views"
                    />
                  </div>
                </div>

                {/* Error */}
                {saveError && (
                  <p className="text-xs text-red-600 font-medium">{saveError}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={saving}
                    className="text-xs font-semibold bg-defender-red text-white px-4 py-1.5 rounded-lg hover:bg-defender-red/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M5 1.5A3.5 3.5 0 1 1 1.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImpactTimelineProps {
  impacts: ImpactEvent[];
}

export function ImpactTimeline({ impacts }: ImpactTimelineProps) {
  if (impacts.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm p-8 text-center">
        <p className="text-gray-400 text-sm">No approved impacts yet.</p>
        <p className="text-gray-400 text-xs mt-1">
          Be the first to{' '}
          <Link href="/report" className="text-defender-red hover:underline font-medium">
            report one
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm overflow-hidden">
      {impacts.map((impact) => (
        <ImpactCard key={impact.id} impact={impact} />
      ))}
    </div>
  );
}
