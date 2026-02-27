'use client';

import { useState } from 'react';
import type { ImpactEvent } from '@/lib/types';
import { PROGRAM_AREA_BADGE, PROGRAM_AREAS } from '@/lib/constants';
import Link from 'next/link';

// ─── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor(diff / 60_000);
  if (days > 30)
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

function formatMetricLarge(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return value.toLocaleString();
}

// Program-area accent colors for left border & icon ring
const AREA_HEX: Record<string, string> = {
  editorial: '#DC2626',
  mutual_aid: '#16A34A',
  political_education: '#2563EB',
  arts_culture: '#9333EA',
  development_fundraising: '#D97706',
  operations_systems: '#64748B',
  radar: '#DB2777',
  other: '#94A3B8',
};

const AREA_LIGHT: Record<string, string> = {
  editorial: 'rgba(220,38,38,0.07)',
  mutual_aid: 'rgba(22,163,74,0.07)',
  political_education: 'rgba(37,99,235,0.07)',
  arts_culture: 'rgba(147,51,234,0.07)',
  development_fundraising: 'rgba(217,119,6,0.07)',
  operations_systems: 'rgba(100,116,139,0.07)',
  radar: 'rgba(219,39,119,0.07)',
  other: 'rgba(148,163,184,0.07)',
};

const KPI_LABELS: Record<string, string> = {
  audience_growth_total_reach: 'Narrative Impact',
  stories_published_total_weekly: 'Stories Published',
  editorial_narrative_power_pct: 'Narrative Power',
  political_education_participants: 'Political Ed',
  mutual_aid_participation_team_members: 'Mutual Aid Organizers',
  community_served_count: 'Community Served',
  arts_culture_engagement_attendees_artists: 'Arts & Culture',
  membership_sustaining_donors_new_monthly: 'New Sustainers',
  membership_retention_rate: 'Retention',
  revenue_mix_quarterly_share_and_growth: 'Revenue',
};

// ─── edit state ───────────────────────────────────────────────────────────────

interface EditState {
  internal_headline: string;
  funder_headline: string;
  raw_description: string;
  radical_metric_value: string;
  radical_metric_label: string;
  radical_metric_unit: string;
}

// ─── ImpactCard ───────────────────────────────────────────────────────────────

function ImpactCard({ impact: init }: { impact: ImpactEvent }) {
  const [impact, setImpact] = useState<ImpactEvent>(init);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({
    internal_headline: init.internal_headline ?? '',
    funder_headline: init.funder_headline ?? '',
    raw_description: init.raw_description,
    radical_metric_value: init.radical_metric_value !== null ? String(init.radical_metric_value) : '',
    radical_metric_label: init.radical_metric_label ?? '',
    radical_metric_unit: init.radical_metric_unit ?? '',
  });

  const programLabel =
    PROGRAM_AREAS.find((a) => a.value === impact.program_area)?.label ?? impact.program_area;
  const badgeColor = PROGRAM_AREA_BADGE[impact.program_area] ?? 'bg-gray-100 text-gray-600';
  const accentHex = AREA_HEX[impact.program_area] ?? '#94A3B8';
  const accentLight = AREA_LIGHT[impact.program_area] ?? 'rgba(148,163,184,0.07)';
  const isEditorial = impact.program_area === 'editorial';

  const headline = impact.internal_headline ?? impact.raw_description.slice(0, 100);
  const narrative = impact.ai_narrative ?? impact.raw_description;

  function startEdit() {
    setEdit({
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

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/impact-events/${impact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internal_headline: edit.internal_headline || null,
          funder_headline: edit.funder_headline || null,
          raw_description: edit.raw_description,
          radical_metric_value: edit.radical_metric_value !== '' ? parseFloat(edit.radical_metric_value) : null,
          radical_metric_label: edit.radical_metric_label || null,
          radical_metric_unit: edit.radical_metric_unit || null,
        }),
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
      setSaveError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="relative transition-colors"
      style={{ borderLeft: `3px solid ${accentHex}` }}
    >
      {/* ── Collapsed row ── */}
      <button
        type="button"
        onClick={() => { if (!editing) setOpen((v) => !v); }}
        className="w-full text-left flex items-start gap-3 px-4 py-4 transition-colors hover:bg-black/[0.02] focus:outline-none group"
        style={open ? { backgroundColor: accentLight } : undefined}
        aria-expanded={open}
      >
        {/* program dot */}
        <span
          className="shrink-0 mt-[5px] w-[7px] h-[7px] rounded-full transition-transform group-hover:scale-125"
          style={{ backgroundColor: accentHex }}
        />

        {/* text */}
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-[13px] leading-snug text-gray-900">
            {headline}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-semibold ${badgeColor}`}>
              {programLabel}
            </span>
            {isEditorial && (
              <span className="inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-semibold bg-gray-100 text-gray-500">
                Story
              </span>
            )}
            {impact.reported_by_name && (
              <span className="text-[11px] text-gray-400">{impact.reported_by_name}</span>
            )}
          </span>
        </span>

        {/* metric + time + chevron */}
        <span className="shrink-0 text-right flex items-start gap-2.5">
          <span>
            {impact.radical_metric_value !== null && impact.radical_metric_label && (
              <span className="block">
                <span className="font-mono font-bold text-[13px] text-gray-900">
                  {formatMetricLarge(Number(impact.radical_metric_value))}
                </span>
                <span className="block text-[10px] text-gray-400 leading-tight mt-[1px]">
                  {impact.radical_metric_label}
                </span>
              </span>
            )}
            <span className="block text-[10px] font-mono text-gray-400 mt-1">{timeAgo(impact.reported_at)}</span>
          </span>
          <span
            className="mt-1 text-gray-300 group-hover:text-gray-400 transition-all shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.28s ease' }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 5L6.5 9L10.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>

      {/* ── Expandable detail panel ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.32s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          {/* inner wrapper with fade-in */}
          <div
            style={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.22s ease 0.08s',
              backgroundColor: accentLight,
              borderTop: `1px solid ${accentHex}22`,
            }}
          >
            {!editing ? (
              /* ── READ MODE ── */
              <div className="divide-y divide-black/[0.05]">

                {/* Section 1 — Narrative */}
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-2">
                    {isEditorial ? 'Why This Story Mattered' : 'Impact Narrative'}
                  </p>
                  <p className="text-[13px] text-gray-700 leading-relaxed">{narrative}</p>
                </div>

                {/* Section 2 — Key metric (big display) + funder headline */}
                {(impact.radical_metric_value !== null || impact.funder_headline) && (
                  <div className="px-5 py-4 grid grid-cols-2 gap-4">
                    {impact.radical_metric_value !== null && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                          Key Metric
                        </p>
                        <div className="flex items-end gap-1.5">
                          <span
                            className="font-black text-[2.4rem] leading-none tabular-nums"
                            style={{ color: accentHex }}
                          >
                            {formatMetricLarge(Number(impact.radical_metric_value))}
                          </span>
                          <span className="text-[12px] text-gray-500 mb-1">
                            {impact.radical_metric_unit ?? ''}{impact.radical_metric_label ? ` ${impact.radical_metric_label}` : ''}
                          </span>
                        </div>
                      </div>
                    )}
                    {impact.funder_headline && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                          Funder Framing
                        </p>
                        <p className="text-[12px] text-gray-600 italic leading-snug">{impact.funder_headline}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Section 3 — KPIs + confidence */}
                <div className="px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {impact.kpis_impacted && impact.kpis_impacted.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1.5">
                        KPIs Moved
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {impact.kpis_impacted.map((k) => (
                          <span
                            key={k}
                            className="text-[10px] font-semibold rounded-full px-2 py-[3px]"
                            style={{ backgroundColor: `${accentHex}18`, color: accentHex }}
                          >
                            {KPI_LABELS[k] ?? k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  <div className="ml-auto flex items-center gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                        Confidence
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="h-[5px] w-20 bg-black/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${impact.confidence}%`, backgroundColor: accentHex }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{impact.confidence}%</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={startEdit}
                      className="flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-70 px-2.5 py-1 rounded-md"
                      style={{ color: accentHex, backgroundColor: `${accentHex}15` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M7 1.5L8.5 3L3 8.5H1.5V7L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>

                {/* Section 4 — Evidence links (optional) */}
                {impact.evidence_links && impact.evidence_links.length > 0 && (
                  <div className="px-5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1.5">
                      Evidence
                    </p>
                    <div className="flex flex-col gap-1">
                      {impact.evidence_links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] truncate hover:underline"
                          style={{ color: accentHex }}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── EDIT MODE ── */
              <div className="px-5 py-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: accentHex }}>
                  Editing Impact
                </p>

                {/* Internal headline */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 block mb-1">
                    Internal Headline
                  </label>
                  <input
                    type="text"
                    value={edit.internal_headline}
                    onChange={(e) => setEdit((s) => ({ ...s, internal_headline: e.target.value }))}
                    className="w-full text-[13px] font-semibold text-gray-900 bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none transition-shadow"
                    style={{ boxShadow: `0 0 0 0px ${accentHex}40` }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
                  />
                </div>

                {/* Funder headline */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 block mb-1">
                    Funder Headline
                  </label>
                  <input
                    type="text"
                    value={edit.funder_headline}
                    onChange={(e) => setEdit((s) => ({ ...s, funder_headline: e.target.value }))}
                    className="w-full text-[13px] text-gray-700 italic bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none transition-shadow"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={edit.raw_description}
                    onChange={(e) => setEdit((s) => ({ ...s, raw_description: e.target.value }))}
                    rows={3}
                    className="w-full text-[13px] text-gray-700 bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none resize-none transition-shadow"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
                  />
                </div>

                {/* Metric */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Value', field: 'radical_metric_value' as const, type: 'number', placeholder: '411000' },
                    { label: 'Label', field: 'radical_metric_label' as const, type: 'text', placeholder: 'Views' },
                    { label: 'Unit', field: 'radical_metric_unit' as const, type: 'text', placeholder: 'views' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 block mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={edit[field]}
                        onChange={(e) => setEdit((s) => ({ ...s, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full text-[12px] font-mono text-gray-700 bg-white border border-black/10 rounded-lg px-2.5 py-2 focus:outline-none transition-shadow"
                        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
                      />
                    </div>
                  ))}
                </div>

                {saveError && (
                  <p className="text-[11px] text-red-600 font-medium">{saveError}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setSaveError(null); }}
                    disabled={saving}
                    className="text-[12px] font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="text-[12px] font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                    style={{ backgroundColor: accentHex }}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M5 1.5A3.5 3.5 0 1 1 1.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Saving
                      </>
                    ) : 'Save Changes'}
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

// ─── ImpactTimeline ───────────────────────────────────────────────────────────

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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm overflow-hidden divide-y divide-black/[0.04]">
      {impacts.map((impact) => (
        <ImpactCard key={impact.id} impact={impact} />
      ))}
    </div>
  );
}
