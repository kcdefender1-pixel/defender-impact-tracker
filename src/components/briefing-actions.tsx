'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface BriefingActionsProps {
  text: string;
}

export function BriefingActions({ text }: BriefingActionsProps) {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch('/api/briefing', { method: 'POST' });
      router.refresh();
    } catch {
      // silent
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-bold bg-ink text-paper rounded-button px-3.5 py-2 hover:bg-defender-red transition-colors"
        title="Copy briefing text"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex items-center gap-1.5 text-xs font-bold text-ink border-2 border-ink rounded-button px-3 py-[6px] hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
        title="Regenerate briefing"
      >
        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
        Refresh
      </button>
    </div>
  );
}
