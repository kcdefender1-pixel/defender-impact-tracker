import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, link, published_at, author, summary_raw, tags } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('stories')
      .insert({
        title: title.trim(),
        link: link?.trim() || null,
        published_at: published_at || null,
        author: author?.trim() || null,
        summary_raw: summary_raw?.trim() || null,
        tags: Array.isArray(tags) ? tags : [],
        source: 'manual',
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
