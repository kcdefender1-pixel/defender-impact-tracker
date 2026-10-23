import { NextResponse } from 'next/server';
import { STAFF_COOKIE, STAFF_COOKIE_MAX_AGE, safeEqual, staffToken } from '@/lib/staff-auth';

export async function POST(request: Request) {
  const passcode = process.env.STAFF_PASSCODE;
  if (!passcode) {
    return NextResponse.json({ error: 'Staff access is not set up yet.' }, { status: 503 });
  }

  let attempt = '';
  try {
    const body = await request.json();
    attempt = typeof body.passcode === 'string' ? body.passcode : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!safeEqual(attempt, passcode)) {
    // Slow down guessing
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, await staffToken(passcode), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: STAFF_COOKIE_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
