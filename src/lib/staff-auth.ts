// Staff access is one shared passcode (STAFF_PASSCODE, set on the server, never in code).
// A successful sign-in sets a cookie holding a token derived from the passcode, so
// changing the passcode signs everyone out. Works in both middleware (edge) and routes.

export const STAFF_COOKIE = 'defender_staff';
export const STAFF_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

export async function staffToken(passcode: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passcode),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode('defender-staff-session-v1'));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time comparison so a wrong guess takes as long as a near-miss
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isStaffToken(token: string | undefined): Promise<boolean> {
  const passcode = process.env.STAFF_PASSCODE;
  // No passcode configured means nobody gets in, rather than everybody
  if (!passcode || !token) return false;
  return safeEqual(token, await staffToken(passcode));
}

// Pages and APIs that only staff may use. The public impact page, /share,
// and the scheduled RSS import stay open.
const STAFF_PAGES = ['/admin', '/report'];
const STAFF_APIS = [
  '/api/impact-events',
  '/api/metric-snapshots',
  '/api/stories',
  '/api/briefing',
  '/api/enhance-impact',
];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export function staffRouteKind(pathname: string): 'page' | 'api' | null {
  if (matches(pathname, STAFF_PAGES)) return 'page';
  if (matches(pathname, STAFF_APIS)) return 'api';
  return null;
}
