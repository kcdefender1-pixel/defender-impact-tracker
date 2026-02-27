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

    const { data: impacts } = await supabase
      .from('impact_events')
      .select('internal_headline, radical_metric_label, radical_metric_value, radical_metric_unit, reported_at')
      .eq('status', 'approved')
      .order('reported_at', { ascending: false })
      .limit(5);

    if (!impacts || impacts.length === 0) {
      return 'The Kansas City Defender is building power every day. Check back soon for highlights from our latest impact.';
    }

    const impactList = impacts
      .map((imp, i) => {
        const metric = imp.radical_metric_value
          ? ` (${imp.radical_metric_value}${imp.radical_metric_unit ? ' ' + imp.radical_metric_unit : ''})`
          : '';
        return `${i + 1}. ${imp.internal_headline}${metric}`;
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
        max_tokens: 300,
        system: `You write brief, galvanizing impact briefings for The Kansas City Defender, a radical abolitionist Black media organization in Kansas City. Write in a warm, affirming tone. Use "comrade" naturally. Start with an affirmation like "Peace, comrades!" or "What an incredible week!" Highlight 2-3 specific wins with numbers. Keep it to 3-4 sentences. Never use em dashes. Write like a trusted comrade giving a brief report at the start of a meeting.`,
        messages: [
          {
            role: 'user',
            content: `Write a brief Defender Impact Briefing based on these recent wins:\n\n${impactList}\n\nKeep it warm, galvanizing, 3-4 sentences max.`,
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
});
