import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { metric_key, value, notes } = body;

    if (!metric_key || typeof metric_key !== 'string') {
      return NextResponse.json({ error: 'metric_key is required' }, { status: 400 });
    }
    if (value === undefined || value === null || isNaN(Number(value))) {
      return NextResponse.json({ error: 'A numeric value is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('metric_snapshots')
      .insert({
        metric_key,
        value: Number(value),
        taken_at: new Date().toISOString(),
        notes: notes?.trim() || null,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ snapshot: data });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
