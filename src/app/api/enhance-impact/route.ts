import { NextRequest, NextResponse } from 'next/server';
import { enhanceImpact } from '@/lib/ai/enhance-impact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raw_description, program_area, link, tags } = body;

    if (!raw_description || typeof raw_description !== 'string') {
      return NextResponse.json(
        { error: 'raw_description is required' },
        { status: 400 }
      );
    }
    if (!program_area || typeof program_area !== 'string') {
      return NextResponse.json(
        { error: 'program_area is required' },
        { status: 400 }
      );
    }

    const result = await enhanceImpact({ raw_description, program_area, link, tags });
    return NextResponse.json(result);
  } catch (error) {
    console.error('enhance-impact error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance impact. Please try again.' },
      { status: 500 }
    );
  }
}
