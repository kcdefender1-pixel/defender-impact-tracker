import type { KpiConfig, MetricSnapshot } from '@/lib/types';
import { KPI_LEFT_BORDER } from '@/lib/constants';
import { Sparkline } from '@/components/sparkline';

interface KpiCardProps {
  kpi: KpiConfig;
  latestValue: number | null;
  snapshots: MetricSnapshot[];
}

const KPI_SPARKLINE_COLOR: Record<string, string> = {
  audience_growth_total_reach: '#E11D48',
  stories_published_total_weekly: '#E11D48',
  editorial_narrative_power_pct: '#E11D48',
  political_education_participants: '#F59E0B',
  mutual_aid_participation_team_members: '#16A34A',
  community_served_count: '#16A34A',
  arts_culture_engagement_attendees_artists: '#8B5CF6',
  membership_sustaining_donors_new_monthly: '#3B82F6',
  membership_retention_rate: '#3B82F6',
  revenue_mix_quarterly_share_and_growth: '#F59E0B',
};

function formatValue(value: number, unit: string | null): string {
  if (unit === '%') return `${value}%`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function KpiCard({ kpi, latestValue, snapshots }: KpiCardProps) {
  const borderColor = KPI_LEFT_BORDER[kpi.key] ?? 'border-l-gray-300';
  const sparkColor = KPI_SPARKLINE_COLOR[kpi.key] ?? '#6B7280';
  const hasData = latestValue !== null;

  // Compute trend vs. previous snapshot
  const sorted = [...snapshots].sort(
    (a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime()
  );
  const prev = sorted[1]?.value ?? null;
  const trend =
    hasData && prev !== null && prev !== 0
      ? ((latestValue! - prev) / prev) * 100
      : null;

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm hover:shadow-md transition-shadow border-l-4 ${borderColor} p-4 flex flex-col gap-2`}
    >
      <div className="text-xs font-semibold text-gray-500 leading-tight line-clamp-2">
        {kpi.title}
      </div>

      <div className="flex items-end gap-2">
        {hasData ? (
          <>
            <span className="font-mono text-2xl font-bold text-defender-black leading-none">
              {formatValue(latestValue!, kpi.unit)}
            </span>
            {kpi.unit && kpi.unit !== '%' && (
              <span className="text-xs text-gray-400 pb-0.5">{kpi.unit}</span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-300 italic">No data yet</span>
        )}
        {trend !== null && (
          <span
            className={`ml-auto text-xs font-semibold pb-0.5 ${
              trend >= 0 ? 'text-defender-green' : 'text-defender-red'
            }`}
          >
            {trend >= 0 ? '+' : ''}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>

      {snapshots.length >= 2 && (
        <Sparkline snapshots={snapshots} color={sparkColor} />
      )}

      <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
        {kpi.freq} &middot; {kpi.unit ?? 'value'}
      </div>
    </div>
  );
}
