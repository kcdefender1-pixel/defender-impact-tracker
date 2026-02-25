import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ingestRSS } from '@/lib/rss/ingest';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = createServiceClient();
    const result = await ingestRSS(supabase);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
