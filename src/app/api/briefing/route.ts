import { generateBriefing } from '@/lib/briefing';
import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const text = await generateBriefing();
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 });
  }
}
