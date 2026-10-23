'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, Lock } from 'lucide-react';

// Only send people back to a path on this site
function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/admin';
}

function StaffLogin() {
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        // Full navigation so the middleware sees the new cookie
        window.location.assign(next);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Sign-in failed.');
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-md">
        <span className="kicker inline-flex items-center gap-1.5 bg-ink text-paper px-2.5 py-1 mb-6">
          <Lock size={11} /> Staff only
        </span>
        <h1 className="display text-[3.4rem] md:text-[4.2rem] text-ink">Staff sign in</h1>
        <p className="mt-3 text-[15px] text-ink-2 leading-relaxed">
          The Command Center, impact tracker, and report form are for Defender staff.
        </p>

        <form onSubmit={submit} className="mt-8 border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_#0E0D0C]">
          <label htmlFor="passcode" className="kicker text-ink-3 block mb-2">
            Staff password
          </label>
          <input
            id="passcode"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-paper border-2 border-ink px-3 py-2.5 text-[15px] text-ink focus:outline-none focus:ring-4 focus:ring-defender-gold/60"
          />
          {error && <p className="mt-3 text-[13px] font-semibold text-defender-red">{error}</p>}
          <button
            type="submit"
            disabled={loading || !passcode}
            className="mt-5 inline-flex items-center gap-2 bg-defender-red text-white rounded-button px-5 py-2.5 text-[14px] font-bold hover:bg-ink transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StaffPage() {
  return (
    <Suspense>
      <StaffLogin />
    </Suspense>
  );
}
