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
    'w-full rounded-[8px] border border-gray-200 bg-white/80 px-2.5 py-1.5 text-sm text-defender-black focus:outline-none focus:ring-1 focus:ring-defender-red/40 focus:border-defender-red transition-colors';

  return (
    <div className="px-4 py-8 md:px-8 md:py-10 max-w-4xl">
      <div className="mb-8">
        <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
          Admin
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-defender-black">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure KPIs, RSS feeds, and integrations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading settings...</div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: KPI Config */}
          <section>
            <h2 className="text-lg font-bold text-defender-black mb-4">KPI Configuration</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                        Frequency
                      </th>
                      <th className="px-4 py-3 w-16" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {kpis.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={kpi.sort_order}
                            onChange={(e) =>
                              updateKpi(kpi.id, 'sort_order', parseInt(e.target.value) || 0)
                            }
                            className="w-12 rounded-[8px] border border-gray-200 px-2 py-1 text-xs text-center focus:outline-none focus:border-defender-red"
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
                                ? 'bg-green-100 text-green-700'
                                : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
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
            <h2 className="text-lg font-bold text-defender-black mb-4">RSS Ingestion</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm p-5">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold text-defender-black mb-0.5">
                    kansascitydefender.com/feed/
                  </div>
                  <div className="text-xs text-gray-400">
                    WordPress RSS feed (auto-ingested hourly via Vercel Cron)
                  </div>
                </div>
                <button
                  onClick={runIngest}
                  disabled={ingesting}
                  className="flex items-center gap-2 bg-defender-red text-white rounded-button px-4 py-2 text-xs font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 shrink-0"
                >
                  <RefreshCw size={13} className={ingesting ? 'animate-spin' : ''} />
                  Run Now
                </button>
              </div>

              {ingestMsg && (
                <div className="text-xs text-gray-600 bg-gray-50 rounded-[8px] px-3 py-2">
                  {ingestMsg}
                </div>
              )}

              {integrations.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Integration Status
                  </div>
                  {integrations.map((integ) => (
                    <div key={integ.id} className="flex items-center gap-3 text-xs text-gray-600">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          integ.status === 'ok'
                            ? 'bg-defender-green'
                            : integ.status === 'warning'
                            ? 'bg-defender-gold'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="font-medium">{integ.name}</span>
                      <span className="text-gray-400">
                        Last run: {formatDate(integ.last_run_at)}
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
            <h2 className="text-lg font-bold text-defender-black mb-4">Report Form Access</h2>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm p-5">
              <div className="text-sm text-gray-600 mb-2">
                The report form at <code className="bg-gray-100 rounded px-1 text-xs">/report</code> is protected by a passcode. To change it:
              </div>
              <ol className="text-sm text-gray-500 list-decimal list-inside space-y-1">
                <li>
                  Open <code className="bg-gray-100 rounded px-1 text-xs">.env.local</code> in your project root
                </li>
                <li>
                  Update <code className="bg-gray-100 rounded px-1 text-xs">REPORT_PASSCODE=yournewpasscode</code>
                </li>
                <li>Restart the dev server or redeploy to Vercel</li>
              </ol>
              <div className="mt-3 text-xs text-gray-400">
                Current passcode env var: <code>REPORT_PASSCODE</code> (set server-side, never exposed to client)
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
