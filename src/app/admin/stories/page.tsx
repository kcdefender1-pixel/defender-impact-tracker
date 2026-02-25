'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import type { Story } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

function formatDate(iso: string | null): string {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string>('');

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setStories(data ?? []);
        setLoading(false);
      });
  }, []);

  const runIngest = async () => {
    setIngesting(true);
    setIngestResult('');
    try {
      const res = await fetch('/api/rss-ingest');
      const data = await res.json();
      setIngestResult(
        data.ok
          ? `Done: ${data.inserted} new, ${data.skipped} skipped`
          : `Error: ${data.error}`
      );
      // Refresh list
      const { data: fresh } = await supabase
        .from('stories')
        .select('*')
        .order('published_at', { ascending: false });
      setStories(fresh ?? []);
    } catch {
      setIngestResult('Ingest failed. Check the console.');
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="px-4 py-8 md:px-8 md:py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
            Admin
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-defender-black">
            Stories
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            RSS-ingested and manually added Defender stories.
          </p>
        </div>
        <button
          onClick={runIngest}
          disabled={ingesting}
          className="flex items-center gap-2 bg-defender-red text-white rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 shrink-0"
        >
          <RefreshCw size={15} className={ingesting ? 'animate-spin' : ''} />
          {ingesting ? 'Ingesting...' : 'Trigger RSS Ingest'}
        </button>
      </div>

      {ingestResult && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-card text-sm text-green-700">
          {ingestResult}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading stories...</div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                      No stories yet. Trigger RSS ingest or run /api/seed.
                    </td>
                  </tr>
                ) : (
                  stories.map((story) => (
                    <tr key={story.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-defender-black text-sm leading-snug max-w-xs">
                          {story.title}
                        </div>
                        {story.summary_raw && (
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                            {story.summary_raw}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            story.source === 'rss'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {story.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {story.author ?? '--'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">
                        {formatDate(story.published_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(story.tags ?? []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {story.link && (
                          <a
                            href={story.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-defender-red transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
