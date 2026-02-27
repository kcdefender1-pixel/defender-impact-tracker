import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Whitelist editable fields
  const EDITABLE = [
    'internal_headline',
    'funder_headline',
    'raw_description',
    'ai_narrative',
    'radical_metric_value',
    'radical_metric_label',
    'radical_metric_unit',
    'program_area',
    'impact_type',
    'status',
    'confidence',
    'kpis_impacted',
    'evidence_links',
    'location_text',
  ] as const;

  const update: Record<string, unknown> = {};
  for (const key of EDITABLE) {
    if (key in body) {
      update[key] = body[key];
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
  }

  update.updated_at = new Date().toISOString();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('impact_events')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ impact: data });
}
