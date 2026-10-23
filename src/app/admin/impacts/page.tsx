import { createClient } from '@/lib/supabase/server';
import { ImpactTable } from '@/components/impact-table';
import type { ImpactEvent } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminImpactsPage() {
  const supabase = createClient();
  const { data: impacts, error } = await supabase
    .from('impact_events')
    .select('*')
    .order('reported_at', { ascending: false });

  const safeImpacts: ImpactEvent[] = impacts ?? [];

  return (
    <div className="px-4 py-8 md:px-8 md:py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="kicker text-defender-red mb-2">
            Admin
          </div>
          <h1 className="display text-[3rem] md:text-[4rem] text-ink">
            Impact Events
          </h1>
          <p className="text-ink-3 text-sm mt-1">
            Review, approve, and manage submitted impact reports.
          </p>
        </div>
        <Link
          href="/report"
          className="bg-defender-red text-white rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-ink transition-colors shrink-0"
        >
          + Report Impact
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-card text-sm text-defender-red">
          Could not load impacts. Make sure you have run the Supabase schema and seeded data.
        </div>
      )}

      <ImpactTable initialImpacts={safeImpacts} />
    </div>
  );
}
