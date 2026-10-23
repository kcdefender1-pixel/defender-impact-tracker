'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Plus, X } from 'lucide-react';
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

const EMPTY_FORM = {
  title: '',
  link: '',
  author: '',
  published_at: '',
  summary_raw: '',
  tags: '',
};

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const supabase = createClient();

  const loadStories = async () => {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .order('published_at', { ascending: false });
    setStories(data ?? []);
  };

  useEffect(() => {
    loadStories().then(() => setLoading(false));
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
      await loadStories();
    } catch {
      setIngestResult('Ingest failed. Check the console.');
    } finally {
      setIngesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          link: form.link || null,
          author: form.author || null,
          published_at: form.published_at
            ? new Date(form.published_at).toISOString()
            : null,
          summary_raw: form.summary_raw || null,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveMsg({ type: 'err', text: data.error ?? 'Failed to save' });
      } else {
        setSaveMsg({ type: 'ok', text: 'Article added.' });
        setForm(EMPTY_FORM);
        setShowForm(false);
        await loadStories();
      }
    } catch {
      setSaveMsg({ type: 'err', text: 'Something went wrong.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 py-8 md:px-8 md:py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="kicker text-defender-red mb-2">
            Admin
          </div>
          <h1 className="display text-[3rem] md:text-[4rem] text-ink">
            Stories
          </h1>
          <p className="text-ink-3 text-sm mt-1">
            RSS-ingested and manually added Defender stories.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setShowForm((s) => !s);
              setSaveMsg(null);
            }}
            className="flex items-center gap-2 bg-ink/[0.06] text-ink rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-ink/[0.05] transition-colors"
          >
            {showForm ? <X size={15} /> : <Plus size={15} />}
            {showForm ? 'Cancel' : 'Add Article'}
          </button>
          <button
            onClick={runIngest}
            disabled={ingesting}
            className="flex items-center gap-2 bg-defender-red text-white rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-ink transition-colors disabled:opacity-60"
          >
            <RefreshCw size={15} className={ingesting ? 'animate-spin' : ''} />
            {ingesting ? 'Ingesting...' : 'RSS Ingest'}
          </button>
        </div>
      </div>

      {ingestResult && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-card text-sm text-defender-green">
          {ingestResult}
        </div>
      )}

      {saveMsg && (
        <div
          className={`mb-4 p-3 border rounded-card text-sm ${
            saveMsg.type === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-defender-green'
              : 'bg-rose-500/10 border-rose-500/20 text-defender-red'
          }`}
        >
          {saveMsg.text}
        </div>
      )}

      {/* Add Article Form */}
      {showForm && (
        <div className="mb-6 bg-card border border-line rounded-card p-6">
          <h2 className="text-base font-bold text-ink mb-4">Add Article Manually</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-ink-3 mb-1">
                  Title <span className="text-defender-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="62 High School Students Protest Bill That Would Allow ICE Agents Into Schools"
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1">URL</label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://kansascitydefender.com/justice/..."
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Ryan Sorrell"
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1">
                  Tags <span className="text-ink-4 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="justice, ice, students, accountability"
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-ink-3 mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={form.summary_raw}
                  onChange={(e) => setForm({ ...form, summary_raw: e.target.value })}
                  placeholder="One or two sentences describing what the story is about and why it mattered."
                  className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-defender-red/40 focus:border-defender-red resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setSaveMsg(null);
                }}
                className="text-sm text-ink-3 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-defender-red text-white rounded-button px-5 py-2.5 text-sm font-semibold hover:bg-ink transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-ink-4 text-sm">Loading stories...</div>
      ) : (
        <div className="bg-card border border-line rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-line">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-ink-4">
                      No stories yet. Trigger RSS ingest or run /api/seed.
                    </td>
                  </tr>
                ) : (
                  stories.map((story) => (
                    <tr key={story.id} className="hover:bg-ink/[0.05] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink text-sm leading-snug max-w-xs">
                          {story.title}
                        </div>
                        {story.summary_raw && (
                          <div className="text-xs text-ink-3 mt-0.5 line-clamp-1 max-w-xs">
                            {story.summary_raw}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            story.source === 'rss'
                              ? 'bg-blue-500/15 text-defender-blue'
                              : 'bg-ink/[0.05] text-ink-3'
                          }`}
                        >
                          {story.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-3">
                        {story.author ?? '--'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-ink-3">
                        {formatDate(story.published_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(story.tags ?? []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-ink/[0.05] text-ink-3"
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
                            className="text-ink-4 hover:text-defender-red transition-colors"
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
