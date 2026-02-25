import Parser from 'rss-parser';
import type { SupabaseClient } from '@supabase/supabase-js';

const parser = new Parser();
const RSS_URLS = ['https://kansascitydefender.com/feed/'];

export async function ingestRSS(supabase: SupabaseClient): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const url of RSS_URLS) {
    let feed;
    try {
      feed = await parser.parseURL(url);
    } catch (err) {
      errors.push(`Failed to fetch ${url}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }

    for (const item of feed.items ?? []) {
      if (!item.link) continue;

      // Deduplicate by link
      const { data: existing } = await supabase
        .from('stories')
        .select('id')
        .eq('link', item.link)
        .maybeSingle();

      if (existing) {
        skipped++;
        continue;
      }

      const slug =
        item.link
          .split('/')
          .filter(Boolean)
          .pop() ?? '';

      const { error: insertErr } = await supabase.from('stories').insert({
        source: 'rss',
        rss_url: url,
        title: item.title ?? 'Untitled',
        slug,
        link: item.link,
        published_at: item.isoDate ?? item.pubDate ?? null,
        author: (item as Record<string, unknown>)['dc:creator'] as string ?? item.creator ?? null,
        tags: item.categories ?? [],
        summary_raw: item.contentSnippet?.slice(0, 500) ?? '',
      });

      if (insertErr) {
        errors.push(`Insert error for ${item.link}: ${insertErr.message}`);
      } else {
        inserted++;
      }
    }
  }

  // Update integration status
  await supabase.from('integration_status').upsert(
    {
      name: 'rss_kansascitydefender',
      enabled: true,
      last_run_at: new Date().toISOString(),
      status: errors.length > 0 ? 'warning' : 'ok',
      message: errors.length > 0
        ? `Inserted ${inserted}, skipped ${skipped}. Errors: ${errors.join('; ')}`
        : `Inserted ${inserted}, skipped ${skipped}`,
    },
    { onConflict: 'name' }
  );

  return { inserted, skipped, errors };
}
