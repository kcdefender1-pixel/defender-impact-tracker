import type { ImpactEvent } from '@/lib/types';
import { PROGRAM_AREA_BADGE, PROGRAM_AREA_DOT, PROGRAM_AREAS } from '@/lib/constants';
import Link from 'next/link';

interface ImpactTimelineProps {
  impacts: ImpactEvent[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor(diff / 60_000);
  if (days > 30) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
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
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm divide-y divide-gray-50">
      {impacts.map((impact) => {
        const programLabel =
          PROGRAM_AREAS.find((a) => a.value === impact.program_area)?.label ??
          impact.program_area;
        const dotColor = PROGRAM_AREA_DOT[impact.program_area] ?? 'bg-gray-400';
        const badgeColor =
          PROGRAM_AREA_BADGE[impact.program_area] ?? 'bg-gray-100 text-gray-600';

        return (
          <div
            key={impact.id}
            className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
          >
            {/* Dot */}
            <div className="shrink-0 mt-1.5">
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-defender-black text-sm leading-snug">
                {impact.internal_headline ?? impact.raw_description.slice(0, 80)}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor}`}
                >
                  {programLabel}
                </span>
                {impact.reported_by_name && (
                  <span className="text-xs text-gray-400">{impact.reported_by_name}</span>
                )}
              </div>
            </div>

            {/* Metric + time */}
            <div className="shrink-0 text-right">
              {impact.radical_metric_value !== null && impact.radical_metric_label && (
                <div>
                  <span className="font-mono font-bold text-defender-black text-sm">
                    {Number(impact.radical_metric_value).toLocaleString()}
                  </span>
                  <div className="text-[10px] text-gray-400 leading-tight">
                    {impact.radical_metric_label}
                  </div>
                </div>
              )}
              <div className="text-[10px] font-mono text-gray-400 mt-1">
                {timeAgo(impact.reported_at)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
