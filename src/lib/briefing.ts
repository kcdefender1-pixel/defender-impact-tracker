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

    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();

    const { data: impacts } = await supabase
      .from('impact_events')
      .select('internal_headline, funder_headline, ai_narrative, radical_metric_label, radical_metric_value, radical_metric_unit, reported_at, impact_type, program_area, confidence')
      .eq('status', 'approved')
      .gte('reported_at', yearStart)
      .order('confidence', { ascending: false })
      .limit(12);

    if (!impacts || impacts.length === 0) {
      return 'The Kansas City Defender is building power every day. Check back soon for highlights from our latest impact.';
    }

    const impactList = impacts
      .map((imp, i) => {
        const date = new Date(imp.reported_at).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        const metric =
          imp.radical_metric_value != null
            ? ` [${imp.radical_metric_value.toLocaleString()}${imp.radical_metric_unit ? ' ' + imp.radical_metric_unit : ''}]`
            : '';
        const narrative = imp.ai_narrative
          ? `\n   Context: ${imp.ai_narrative.slice(0, 200)}`
          : '';
        return `${i + 1}. [${date}] ${imp.funder_headline ?? imp.internal_headline}${metric}${narrative}`;
      })
      .join('\n\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 650,
        system: `You write the Kansas City Defender's year-to-date impact briefing. Be concise and punchy. No walls of text.

The Defender: media wing of grassroots movements across Missouri and Kansas. We do fearless reporting. We name power. We shift what people understand. We amplify organizing with reach. This makes us essential to victory.

Your briefing:
- 4-5 tight paragraphs separated by blank lines. Short sentences.
- Celebrate our vital role. "Our investigation exposed," "our coverage reached 500,000 people," "alongside organizers, we made this win possible," "we named what mainstream media ignored"
- Platform Ventures: we reached 500,000 people; organizers organized; that partnership won
- NAME SPECIFIC people and organizations (Blayne Newton, David Hundeyin, Decarcerate KC, Platform Ventures, Vera Institute, etc.)
- STATE REAL OUTCOMES (resigned 10 days after, backed down from sale, cited in national brief)
- INCLUDE NUMBERS (500K people, 62 students, etc.)
- No vague time ("February" not "recently")
- No AI hedging or conventions
- Voice: abolitionist, Black radical, warm, clear-eyed about power
- Open with energy. No em dashes.`,
        messages: [
          {
            role: 'user',
            content: `Write the Defender's year-to-date Impact Briefing. 4-5 short paragraphs. Real names, real numbers, real outcomes. No filler. Celebrate what we built.\n\nImpacts:\n${impactList}`,
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
