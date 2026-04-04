import { unstable_cache } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function _generateBriefing(): Promise<string> {
  try {
    const supabase = getServiceClient();

    // Always use year-to-date so the briefing tells the full arc of the year's work
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

    const { data: impacts } = await supabase
      .from('impact_events')
      .select('internal_headline, funder_headline, radical_metric_label, radical_metric_value, radical_metric_unit, reported_at, impact_type, program_area')
      .eq('status', 'approved')
      .gte('reported_at', yearStart)
      .order('confidence', { ascending: false })
      .limit(8);

    if (!impacts || impacts.length === 0) {
      return 'The Kansas City Defender is building power every day. Check back soon for highlights from our latest impact.';
    }

    const impactList = impacts
      .map((imp, i) => {
        const date = new Date(imp.reported_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        const metric =
          imp.radical_metric_value != null
            ? ` -- ${imp.radical_metric_value.toLocaleString()}${imp.radical_metric_unit ? ' ' + imp.radical_metric_unit : ''}`
            : '';
        return `${i + 1}. [${date}] ${imp.internal_headline ?? imp.funder_headline}${metric}`;
      })
      .join('\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 320,
        system: `You write brief, galvanizing year-to-date impact briefings for The Kansas City Defender, a radical abolitionist Black media organization in Kansas City. Write in a warm, affirming tone that honors the work. Use "comrades" naturally. Start with an affirmation like "Peace, comrades!" or a strong opening line. Highlight 2-3 specific wins with numbers or outcomes. Keep it to 3-4 sentences. Never use em dashes. Never use relative time language like "last week", "recently", or "just" -- always use the specific month and year provided in brackets (e.g., "In February," or "This March,"). Write like a trusted comrade giving a brief year-in-review report at the start of a meeting.`,
        messages: [
          {
            role: 'user',
            content: `Write a brief Defender Impact Briefing covering our top wins so far this year. Each item includes its date in brackets -- use those specific dates in your writing.\n\n${impactList}\n\nKeep it warm, galvanizing, 3-4 sentences max.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return 'The Kansas City Defender is building power every day. Check back soon for highlights from our latest impact.';
    }

    const json = await response.json();
    return json.content?.[0]?.text ?? 'The Kansas City Defender is building power every day.';
  } catch {
    return 'The Kansas City Defender is building power every day. Check back soon for highlights from our latest impact.';
  }
}

export const generateBriefing = unstable_cache(_generateBriefing, ['defender-briefing'], {
  revalidate: 3600,
  tags: ['defender-briefing'],
});
