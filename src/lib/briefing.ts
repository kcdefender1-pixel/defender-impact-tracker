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
        max_tokens: 520,
        system: `You write powerful, strategic year-to-date impact briefings for The Kansas City Defender, a radical abolitionist Black media organization headquartered in Kansas City, Missouri.

Your briefing must:
- NAME SPECIFIC people, companies, and organizations involved in wins (e.g. "Platform Ventures," "KCPD officer Blayne Newton," "David Hundeyin," "Decarcerate KC," "Reynolds Journalism Institute," "Pivot Fund")
- STATE SPECIFIC OUTCOMES, not vague accomplishments (e.g. "resigned 10 days after publication," "backed down from the ICE sale," "cited in a Vera Institute national policy brief")
- INCLUDE REAL NUMBERS when provided (views, families served, students enrolled, organizations in coalition)
- Span the full range of the organization's work: fearless investigative journalism, mutual aid, political education, international coverage, and institutional recognition
- Reflect the Defender's voice: abolitionist, Black radical, warm but uncompromising, clear-eyed about power
- Use "comrades" naturally
- Never use em dashes
- Never use vague relative time ("recently," "last week") -- use specific months from the data
- Write 5-6 punchy sentences that feel like a movement victory lap, not a grant report
- Open with energy: something like "Peace, comrades." or a declarative statement of power`,
        messages: [
          {
            role: 'user',
            content: `Write the Defender's year-to-date Impact Briefing. Each impact below includes the month, headline, outcome, and context. Name the real people, companies, and outcomes. This should feel like a powerful report to the movement on what we've built this year.\n\n${impactList}`,
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
