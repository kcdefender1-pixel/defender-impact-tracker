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
        max_tokens: 700,
        system: `You write the Kansas City Defender's year-to-date impact briefing. The title and subtitle are handled separately -- write ONLY the body paragraphs.

Style guide -- match this exactly:
- 4 paragraphs, each separated by a blank line
- Declarative, plain, authoritative. Short sentences. No hedging.
- Name specific people, companies, organizations, and outcomes
- Include real numbers from the data
- Say what the Defender did and what changed because of it
- The Defender is both essential to these wins AND the media arm of broader movement organizing -- name coalition partners when relevant
- Span coverage, accountability, mutual aid, and recognition across the paragraphs
- No em dashes. No "comrades." No vague time (use months). No AI hedging language.
- Close with a line that establishes the Defender's national significance

Example tone and structure:
"Four months into 2026, the Kansas City Defender has helped force a corporate reversal on an ICE detention sale, driven an officer out of the Kansas City Police Department, and reached over three million people with coverage of student resistance to ICE in schools.

We have been the only media organization in the room as twenty-three organizations launched a campaign to stop a $25 million World Cup Jail from becoming permanent infrastructure. We took our reporting international, exposing how the State Department is weaponizing foreign secret police. The Vera Institute cited our ICE reporting in a national policy brief.

[Third paragraph covering other key wins and institutional recognition.]

A Black abolitionist outlet in the middle of the country is doing some of the most important journalism in it."`,
        messages: [
          {
            role: 'user',
            content: `Write the body of the Defender's year-to-date Impact Briefing. 4 paragraphs, blank line between each. Real names, real numbers, real outcomes. Match the tone and structure from the style guide exactly.\n\nImpacts:\n${impactList}`,
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
