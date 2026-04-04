import { generateBriefing } from '@/lib/briefing';
import { revalidateTag } from 'next/cache';
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

export async function POST() {
  revalidateTag('defender-briefing');
  return NextResponse.json({ ok: true });
}
