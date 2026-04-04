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
        max_tokens: 1200,
        system: `You write powerful, strategic year-to-date impact briefings for The Kansas City Defender, a radical abolitionist Black media organization headquartered in Kansas City, Missouri.

The Defender's role: We are the MEDIA WING of grassroots movements across Missouri and Kansas. Our job is to do fearless reporting, name power, shift narrative, and amplify the organizing happening on the ground. We report what others won't. We give voice to organizers. We build the narrative conditions that make victory possible. This makes us an ESSENTIAL part of the movement, not separate from it.

Your briefing must:
- Celebrate the Defender's vital role. Say things like "our investigation exposed," "our coverage shifted how 500,000 people understand," "our reporting alongside the organizing of Decarcerate KC made this victory possible," "we named what mainstream media ignored"
- For Platform Ventures: our narrative and social reach exceeded 500,000 people. We were essential to this win. Organizers organized; we reported and amplified with reach, making it impossible to ignore. That partnership is what won.
- NAME SPECIFIC people, companies, and organizations (e.g. "Platform Ventures," "Blayne Newton," "David Hundeyin," "Decarcerate KC," "Reynolds Journalism Institute")
- STATE SPECIFIC OUTCOMES not vague ones (e.g. "resigned 10 days after publication," "backed down from the ICE sale," "cited in national policy brief by Vera Institute")
- INCLUDE REAL NUMBERS when provided (500,000 people reached, 62 students, families served, etc.)
- Use subheadings or section breaks to organize the briefing by impact type or theme (e.g. "Accountability Wins / Legislative Shifts / International Coverage / Institutional Recognition"). Make it scannable, not a wall of text.
- Span the full range of work: fearless investigative journalism, accountability reporting, mutual aid, political education, international coverage, institutional recognition
- Voice: abolitionist, Black radical, warm but uncompromising, clear-eyed about power
- Use "comrades" naturally
- Avoid vague relative time (say "February" not "recently")
- Avoid AI conventions and hedging language (no "in a sense," "sort of," "it could be argued")
- Write concise, punchy copy that feels like reporting to the movement on what we've built, not a grant report
- Open with energy`,
        messages: [
          {
            role: 'user',
            content: `Write the Defender's year-to-date Impact Briefing as a report to our audience and funders. Use subheadings or section breaks to organize by theme (accountability wins, international coverage, institutional recognition, etc.). Include real numbers. Celebrate our vital role in these victories. Keep it concise and scannable.\n\nImpacts:\n${impactList}`,
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
