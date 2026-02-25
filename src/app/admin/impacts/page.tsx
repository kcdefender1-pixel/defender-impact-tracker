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
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
            Admin
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-defender-black">
            Impact Events
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review, approve, and manage submitted impact reports.
          </p>
        </div>
        <Link
          href="/report"
          className="bg-defender-red text-white rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors shrink-0"
        >
          + Report Impact
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-card text-sm text-red-700">
          Could not load impacts. Make sure you have run the Supabase schema and seeded data.
        </div>
      )}

      <ImpactTable initialImpacts={safeImpacts} />
    </div>
  );
}
