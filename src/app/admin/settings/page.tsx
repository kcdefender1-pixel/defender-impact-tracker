'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { KpiConfig, IntegrationStatus } from '@/lib/types';

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AdminSettingsPage() {
  const [kpis, setKpis] = useState<KpiConfig[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [ingesting, setIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from('kpi_config').select('*').order('sort_order', { ascending: true }),
      supabase.from('integration_status').select('*').order('name', { ascending: true }),
    ]).then(([kpiRes, intRes]) => {
      setKpis(kpiRes.data ?? []);
      setIntegrations(intRes.data ?? []);
      setLoading(false);
    });
  }, []);

  const updateKpi = (id: string, field: keyof KpiConfig, value: string | number) => {
    setKpis((prev) => prev.map((k) => (k.id === id ? { ...k, [field]: value } : k)));
  };

  const saveKpi = async (kpi: KpiConfig) => {
    setSavingId(kpi.id);
    await supabase
      .from('kpi_config')
      .update({
        title: kpi.title,
        description: kpi.description,
        unit: kpi.unit,
        freq: kpi.freq,
        sort_order: kpi.sort_order,
        notes: kpi.notes,
      })
      .eq('id', kpi.id);
    setSavingId(null);
    setSavedId(kpi.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const runIngest = async () => {
    setIngesting(true);
    setIngestMsg('');
    try {
      const res = await fetch('/api/rss-ingest');
      const data = await res.json();
      setIngestMsg(
        data.ok
          ? `Done: ${data.inserted} inserted, ${data.skipped} skipped`
          : `Error: ${data.error}`
      );
      // Refresh integrations
      const { data: fresh } = await supabase.from('integration_status').select('*').order('name');
      setIntegrations(fresh ?? []);
    } catch {
      setIngestMsg('Ingest failed.');
    } finally {
      setIngesting(false);
    }
  };

  const inputClass =
    'w-full rounded-[8px] border border-line bg-paper px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-defender-red/40 focus:border-defender-red transition-colors';

  return (
    <div className="px-4 py-8 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-8">
        <div className="kicker text-defender-red mb-2">
          Admin
        </div>
        <h1 className="display text-[3rem] md:text-[4rem] text-ink">Settings</h1>
        <p className="text-ink-3 text-sm mt-1">
          Configure KPIs, RSS feeds, and integrations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-4 text-sm">Loading settings...</div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: KPI Config */}
          <section>
            <h2 className="text-lg font-bold text-ink mb-4">KPI Configuration</h2>
            <div className="bg-card border border-line rounded-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-line">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider w-8">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider w-24">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider w-28">
                        Frequency
                      </th>
                      <th className="px-4 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {kpis.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-ink/[0.05] transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={kpi.sort_order}
                            onChange={(e) =>
                              updateKpi(kpi.id, 'sort_order', parseInt(e.target.value) || 0)
                            }
                            className="w-12 rounded-[8px] border border-line bg-paper px-2 py-1 text-xs text-center text-ink focus:outline-none focus:border-defender-red"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={kpi.title}
                            onChange={(e) => updateKpi(kpi.id, 'title', e.target.value)}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={kpi.unit ?? ''}
                            onChange={(e) => updateKpi(kpi.id, 'unit', e.target.value)}
                            placeholder="people"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={kpi.freq}
                            onChange={(e) => updateKpi(kpi.id, 'freq', e.target.value)}
                            className={inputClass}
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => saveKpi(kpi)}
                            disabled={savingId === kpi.id}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
                              savedId === kpi.id
                                ? 'bg-emerald-500/15 text-defender-green'
                                : 'text-ink-3 border border-line hover:bg-ink/[0.05]'
                            }`}
                          >
                            {savingId === kpi.id ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : savedId === kpi.id ? (
                              'Saved'
                            ) : (
                              <>
                                <Save size={12} />
                                Save
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 2: RSS Feeds */}
          <section>
            <h2 className="text-lg font-bold text-ink mb-4">RSS Ingestion</h2>
            <div className="bg-card border border-line rounded-card p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold text-ink mb-0.5">
                    kansascitydefender.com/feed/
                  </div>
                  <div className="text-xs text-ink-3">
                    WordPress RSS feed (auto-ingested hourly via Vercel Cron)
                  </div>
                </div>
                <button
                  onClick={runIngest}
                  disabled={ingesting}
                  className="flex items-center gap-2 bg-defender-red text-white rounded-button px-4 py-2 text-xs font-semibold hover:bg-ink transition-colors disabled:opacity-60 shrink-0"
                >
                  <RefreshCw size={13} className={ingesting ? 'animate-spin' : ''} />
                  Run Now
                </button>
              </div>

              {ingestMsg && (
                <div className="text-xs text-ink-3 bg-ink/[0.05] rounded-[8px] px-3 py-2">
                  {ingestMsg}
                </div>
              )}

              {integrations.length > 0 && (
                <div className="mt-4 border-t border-line pt-4">
                  <div className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-2">
                    Integration Status
                  </div>
                  {integrations.map((integ) => (
                    <div key={integ.id} className="flex items-center gap-3 text-xs text-ink-3">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          integ.status === 'ok'
                            ? 'bg-defender-green'
                            : integ.status === 'warning'
                            ? 'bg-defender-gold'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-medium">{integ.name}</span>
                      <span className="text-gray-400">
                        Last run: <span className="text-ink-3">{formatDate(integ.last_run_at)}</span>
                      </span>
                      {integ.message && (
                        <span className="text-gray-400 truncate max-w-xs">{integ.message}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Passcode */}
          <section>
            <h2 className="text-lg font-bold text-ink mb-4">Report Form Access</h2>
            <div className="bg-card border border-line rounded-card p-5">
              <div className="text-sm text-ink-3 mb-2">
                The report form at <code className="bg-ink/[0.05] rounded px-1 text-xs text-ink-2">/report</code> is protected by a passcode. To change it:
              </div>
              <ol className="text-sm text-ink-3 list-decimal list-inside space-y-1">
                <li>
                  Open <code className="bg-ink/[0.05] rounded px-1 text-xs text-ink-2">.env.local</code> in your project root
                </li>
                <li>
                  Update <code className="bg-ink/[0.05] rounded px-1 text-xs text-ink-2">REPORT_PASSCODE=yournewpasscode</code>
                </li>
                <li>Restart the dev server or redeploy to Vercel</li>
              </ol>
              <div className="mt-3 text-xs text-ink-4">
                Current passcode env var: <code>REPORT_PASSCODE</code> (set server-side, never exposed to client)
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
