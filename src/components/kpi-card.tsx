'use client';

import { useState } from 'react';
import type { KpiConfig, MetricSnapshot } from '@/lib/types';
import { KPI_ACCENT_BG } from '@/lib/constants';
import { Sparkline } from '@/components/sparkline';
import { useToast } from '@/lib/toast-context';

interface KpiCardProps {
  kpi: KpiConfig;
  latestValue: number | null;
  snapshots: MetricSnapshot[];
}

const KPI_SPARKLINE_COLOR: Record<string, string> = {
  audience_growth_total_reach: '#E0263F',
  stories_published_total_weekly: '#E0263F',
  editorial_narrative_power_pct: '#E0263F',
  political_education_participants: '#D99A00',
  mutual_aid_participation_team_members: '#0B8A4E',
  community_served_count: '#0B8A4E',
  arts_culture_engagement_attendees_artists: '#7B5CF0',
  membership_sustaining_donors_new_monthly: '#2B4CFF',
  membership_retention_rate: '#2B4CFF',
  revenue_mix_quarterly_share_and_growth: '#2B4CFF',
};

function formatValue(value: number, unit: string | null): string {
  if (unit === '%') return `${value}%`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export function KpiCard({ kpi, latestValue, snapshots }: KpiCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [localSnapshots, setLocalSnapshots] = useState(snapshots);
  const [logValue, setLogValue] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logging, setLogging] = useState(false);
  const { toast } = useToast();

  const accentBg = KPI_ACCENT_BG[kpi.key] ?? 'bg-ink-4';
  const sparkColor = KPI_SPARKLINE_COLOR[kpi.key] ?? '#6B7280';

  const sorted = [...localSnapshots].sort(
    (a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
  );
  const currentLatest = sorted[0]?.value ?? latestValue;
  const hasData = currentLatest !== null;
  const prev = sorted[1]?.value ?? null;
  const trend =
    hasData && prev !== null && prev !== 0
      ? ((currentLatest! - prev) / prev) * 100
      : null;

  const handleLogSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!logValue || isNaN(Number(logValue))) return;
    setLogging(true);
    try {
      const res = await fetch('/api/metric-snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_key: kpi.key,
          value: Number(logValue),
          notes: logNotes || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.snapshot) {
        setLocalSnapshots((prev) => [data.snapshot, ...prev].slice(0, 6));
        setLogValue('');
        setLogNotes('');
        toast('Snapshot logged');
      } else {
        toast(data.error ?? 'Failed to log', 'error');
      }
    } catch {
      toast('Failed to log snapshot', 'error');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div
      className={`bg-card border-2 border-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0E0D0C] overflow-hidden cursor-pointer ${expanded ? 'shadow-[6px_6px_0_0_#0E0D0C]' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={`h-2 ${accentBg}`} />
      {/* Always visible header */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[13px] font-semibold text-ink-2 leading-snug line-clamp-2 flex-1">
            {kpi.title}
          </div>
          <div className={`text-ink-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-end gap-2">
          {hasData ? (
            <>
              <span className="display text-[3.4rem] text-ink tabular-nums">
                {formatValue(currentLatest!, kpi.unit)}
              </span>
              {kpi.unit && kpi.unit !== '%' && (
                <span className="text-xs font-semibold text-ink-3 pb-1.5">{kpi.unit}</span>
              )}
            </>
          ) : (
            <span className="text-sm text-ink-4 italic">No data yet</span>
          )}
          {trend !== null && (
            <span
              className={`ml-auto mb-1.5 text-xs font-bold px-2 py-0.5 ${
                trend >= 0 ? 'bg-defender-green text-white' : 'bg-defender-red text-white'
              }`}
            >
              {trend >= 0 ? '+' : ''}
              {trend.toFixed(1)}%
            </span>
          )}
        </div>

        {localSnapshots.length >= 2 && (
          <Sparkline snapshots={localSnapshots} color={sparkColor} />
        )}

        <div className="kicker text-ink-4">
          {kpi.freq} &middot; {kpi.unit ?? 'value'}
        </div>
      </div>

      {/* Expandable detail section */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 border-t-2 border-ink pt-4 space-y-3 bg-paper">
          {kpi.description && (
            <p className="text-xs text-ink-3 leading-relaxed">{kpi.description}</p>
          )}

          {localSnapshots.length >= 2 && (
            <div>
              <div className="text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-1.5">Trend</div>
              <Sparkline snapshots={localSnapshots} color={sparkColor} height={96} />
            </div>
          )}

          {sorted.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-1.5">
                Recent Snapshots
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {sorted.slice(0, 6).map((s) => (
                    <tr key={s.id} className="border-b border-line last:border-0">
                      <td className="py-1 text-ink-4">{formatDate(s.taken_at)}</td>
                      <td className="py-1 font-mono font-semibold text-right text-ink">
                        {formatValue(Number(s.value), kpi.unit)}
                      </td>
                      {s.notes && (
                        <td className="py-1 text-ink-4 pl-3 max-w-[120px] truncate">{s.notes}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {kpi.rationale && (
            <p className="text-[10px] text-ink-4 italic leading-relaxed">{kpi.rationale}</p>
          )}

          {/* Inline snapshot form */}
          <form
            onSubmit={handleLogSnapshot}
            onClick={(e) => e.stopPropagation()}
            className="flex items-end gap-2 pt-1"
          >
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] font-semibold text-ink-4 uppercase tracking-wider mb-1">
                Log today&apos;s value
              </label>
              <input
                type="number"
                step="any"
                value={logValue}
                onChange={(e) => setLogValue(e.target.value)}
                placeholder={kpi.unit ?? 'Value'}
                className="w-full bg-card border-2 border-ink/80 rounded-none px-2.5 py-1.5 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
              />
            </div>
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full bg-card border-2 border-ink/80 rounded-none px-2.5 py-1.5 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
              />
            </div>
            <button
              type="submit"
              disabled={logging || !logValue}
              className="shrink-0 bg-defender-red text-white text-xs font-semibold px-3 py-2 rounded-none hover:bg-ink transition-colors disabled:opacity-40"
            >
              {logging ? '...' : 'Log'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
