import { AI_SYSTEM_PROMPT } from '@/lib/constants';
import type { AIEnhancementResult } from '@/lib/types';

interface EnhanceInput {
  raw_description: string;
  program_area: string;
  link?: string;
  tags?: string[];
}

export async function enhanceImpact(
  input: EnhanceInput
): Promise<AIEnhancementResult> {
  const userContent = [
    `Program area: ${input.program_area}`,
    input.link ? `Related link: ${input.link}` : '',
    input.tags?.length ? `Tags: ${input.tags.join(', ')}` : '',
    '',
    `Raw description: ${input.raw_description}`,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: AI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text: string = data.content[0].text;

  // Strip any accidental markdown fences
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned) as AIEnhancementResult;
}
