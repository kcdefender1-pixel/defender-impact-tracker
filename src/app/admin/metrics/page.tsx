'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase/client';
import type { MetricSnapshot, KpiConfig } from '@/lib/types';

const KPI_KEY_LABELS: Record<string, string> = {
  audience_growth_total_reach: 'Audience Growth',
  stories_published_total_weekly: 'Stories Published',
  editorial_narrative_power_pct: 'Editorial Narrative Power',
  political_education_participants: 'Political Education Participants',
  mutual_aid_participation_team_members: 'Mutual Aid Participation',
  community_served_count: 'Community Served',
  arts_culture_engagement_attendees_artists: 'Arts & Culture Engagement',
  membership_sustaining_donors_new_monthly: 'New Sustaining Donors',
  membership_retention_rate: 'Membership Retention',
  revenue_mix_quarterly_share_and_growth: 'Revenue Mix',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AdminMetricsPage() {
  const [snapshots, setSnapshots] = useState<MetricSnapshot[]>([]);
  const [kpis, setKpis] = useState<KpiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from('metric_snapshots').select('*').order('taken_at', { ascending: true }),
      supabase.from('kpi_config').select('*').order('sort_order', { ascending: true }),
    ]).then(([snapRes, kpiRes]) => {
      setSnapshots(snapRes.data ?? []);
      setKpis(kpiRes.data ?? []);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!formKey || !formValue) return;
    setSaving(true);
    setSaveMsg('');
    const { data, error } = await supabase
      .from('metric_snapshots')
      .insert({
        metric_key: formKey,
        value: parseFloat(formValue),
        taken_at: new Date(formDate).toISOString(),
        notes: formNotes || null,
      })
      .select()
      .single();

    if (!error && data) {
      setSnapshots((prev) => [...prev, data].sort((a, b) =>
        new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
      ));
      setFormValue('');
      setFormNotes('');
      setSaveMsg(`Saved snapshot for ${KPI_KEY_LABELS[formKey] ?? formKey}`);
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  };

  // Group snapshots by key
  const byKey: Record<string, MetricSnapshot[]> = {};
  for (const s of snapshots) {
    if (!byKey[s.metric_key]) byKey[s.metric_key] = [];
    byKey[s.metric_key].push(s);
  }

  const keysWithData = Object.keys(byKey).sort();

  const inputClass =
    'w-full rounded-[10px] border border-gray-200 bg-white/80 px-3 py-2 text-sm text-defender-black focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <div className="px-4 py-8 md:px-8 md:py-10 max-w-6xl">
      <div className="mb-6">
        <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
          Admin
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-defender-black">
          Metrics
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Log KPI snapshots and track trends over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: entry form */}
        <div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm p-5">
            <div className="text-sm font-bold text-defender-black mb-4">Add Snapshot</div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>KPI</label>
                <select
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select KPI...</option>
                  {kpis.map((k) => (
                    <option key={k.key} value={k.key}>
                      {k.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Value</label>
                <input
                  type="number"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="e.g. 85000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Notes (optional)</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Any context..."
                  className={inputClass}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!formKey || !formValue || saving}
                className="w-full bg-defender-red text-white rounded-button px-4 py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Snapshot'}
              </button>

              {saveMsg && (
                <p className="text-xs text-defender-green font-medium">{saveMsg}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: charts + tables */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading metrics...</div>
          ) : keysWithData.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No metric snapshots yet. Add your first one.
            </div>
          ) : (
            keysWithData.map((key) => {
              const data = byKey[key].map((s) => ({
                date: formatDate(s.taken_at),
                value: Number(s.value),
              }));
              const latest = data[data.length - 1]?.value;
              const label = KPI_KEY_LABELS[key] ?? key;
              const kpiUnit = kpis.find((k) => k.key === key)?.unit ?? '';

              return (
                <div
                  key={key}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-defender-black">{label}</div>
                    {latest !== undefined && (
                      <div className="font-mono font-bold text-defender-black">
                        {latest.toLocaleString()}
                        {kpiUnit && (
                          <span className="text-xs text-gray-400 ml-1">{kpiUnit}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {data.length >= 2 ? (
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
                          itemStyle={{ color: '#0B0B0B' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#E11D48"
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#E11D48' }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Add 2+ snapshots to see a trend line.</p>
                  )}
                  <div className="mt-2 text-xs text-gray-400">
                    {data.length} snapshot{data.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
