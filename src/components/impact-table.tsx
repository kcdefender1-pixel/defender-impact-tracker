'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, Archive, RefreshCw, ChevronUp, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import type { ImpactEvent } from '@/lib/types';
import {
  PROGRAM_AREAS,
  IMPACT_TYPES,
  PROGRAM_AREA_BADGE,
  STATUS_BADGE,
} from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

interface ImpactTableProps {
  initialImpacts: ImpactEvent[];
}

type SortKey = 'reported_at' | 'reported_by_name' | 'program_area' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'archived', label: 'Archived' },
];

const AREA_HEX: Record<string, string> = {
  editorial: '#DC2626',
  mutual_aid: '#16A34A',
  political_education: '#2563EB',
  arts_culture: '#9333EA',
  development_fundraising: '#D97706',
  operations_systems: '#64748B',
  radar: '#DB2777',
  other: '#94A3B8',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface EditState {
  internal_headline: string;
  funder_headline: string;
  raw_description: string;
  ai_narrative: string;
  radical_metric_value: string;
  radical_metric_label: string;
  radical_metric_unit: string;
}

// ─── Expanded row edit panel ──────────────────────────────────────────────────

function ExpandedRow({
  impact: init,
  onUpdate,
  onClose,
  accentHex,
}: {
  impact: ImpactEvent;
  onUpdate: (updated: ImpactEvent) => void;
  onClose: () => void;
  accentHex: string;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState>({
    internal_headline: init.internal_headline ?? '',
    funder_headline: init.funder_headline ?? '',
    raw_description: init.raw_description,
    ai_narrative: init.ai_narrative ?? '',
    radical_metric_value: init.radical_metric_value !== null ? String(init.radical_metric_value) : '',
    radical_metric_label: init.radical_metric_label ?? '',
    radical_metric_unit: init.radical_metric_unit ?? '',
  });

  const narrative = init.ai_narrative ?? init.raw_description;

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/impact-events/${init.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internal_headline: edit.internal_headline || null,
          funder_headline: edit.funder_headline || null,
          raw_description: edit.raw_description,
          ai_narrative: edit.ai_narrative || null,
          radical_metric_value: edit.radical_metric_value !== '' ? parseFloat(edit.radical_metric_value) : null,
          radical_metric_label: edit.radical_metric_label || null,
          radical_metric_unit: edit.radical_metric_unit || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error ?? 'Save failed');
        return;
      }
      const { impact: updated } = await res.json();
      onUpdate(updated);
      setEditing(false);
    } catch {
      setSaveError('Network error — try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr>
      <td colSpan={9} className="p-0">
        <div
          style={{
            borderLeft: `3px solid ${accentHex}`,
            backgroundColor: `${accentHex}08`,
            borderTop: `1px solid ${accentHex}20`,
          }}
        >
          {!editing ? (
            /* READ MODE */
            <div className="divide-y divide-white/[0.05]">
              {/* Narrative */}
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 mb-2">
                  Impact Narrative
                </p>
                <p className="text-[13px] text-white/65 leading-relaxed max-w-3xl">{narrative}</p>
              </div>

              {/* Funder headline */}
              {init.funder_headline && (
                <div className="px-6 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 mb-1">
                    Funder Headline
                  </p>
                  <p className="text-[13px] text-white/55 italic">{init.funder_headline}</p>
                </div>
              )}

              {/* Meta + actions */}
              <div className="px-6 py-3 flex items-center gap-6">
                {init.kpis_impacted && init.kpis_impacted.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {init.kpis_impacted.map((k) => (
                      <span
                        key={k}
                        className="text-[10px] font-semibold rounded-full px-2 py-[2px]"
                        style={{ backgroundColor: `${accentHex}18`, color: accentHex }}
                      >
                        {k.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] font-semibold text-white/40 hover:text-white/70 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    Collapse
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{ backgroundColor: accentHex }}
                  >
                    <Pencil size={10} />
                    Edit Fields
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="px-6 py-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: accentHex }}>
                Editing Impact
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Internal headline */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 block mb-1">
                    Internal Headline
                  </label>
                  <input
                    type="text"
                    value={edit.internal_headline}
                    onChange={(e) => setEdit((s) => ({ ...s, internal_headline: e.target.value }))}
                    className="w-full text-[13px] font-semibold text-white bg-surface border border-white/10 rounded-lg px-3 py-2 focus:outline-none"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
                  />
                </div>

                {/* Funder headline */}
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 block mb-1">
                    Funder Headline
                  </label>
                  <input
                    type="text"
                    value={edit.funder_headline}
                    onChange={(e) => setEdit((s) => ({ ...s, funder_headline: e.target.value }))}
                    className="w-full text-[13px] italic text-white/80 bg-surface border border-white/10 rounded-lg px-3 py-2 focus:outline-none"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
                  />
                </div>

                {/* Raw description */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 block mb-1">
                    Raw Description
                  </label>
                  <textarea
                    value={edit.raw_description}
                    onChange={(e) => setEdit((s) => ({ ...s, raw_description: e.target.value }))}
                    rows={3}
                    className="w-full text-[12px] text-white/80 bg-surface border border-white/10 rounded-lg px-3 py-2 focus:outline-none resize-none"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
                  />
                </div>

                {/* AI narrative */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 block mb-1">
                    AI Narrative
                  </label>
                  <textarea
                    value={edit.ai_narrative}
                    onChange={(e) => setEdit((s) => ({ ...s, ai_narrative: e.target.value }))}
                    rows={3}
                    className="w-full text-[12px] text-white/80 bg-surface border border-white/10 rounded-lg px-3 py-2 focus:outline-none resize-none"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
                  />
                </div>

                {/* Metric */}
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Metric Value', field: 'radical_metric_value' as const, type: 'number', placeholder: '411000' },
                    { label: 'Label', field: 'radical_metric_label' as const, type: 'text', placeholder: 'Views' },
                    { label: 'Unit', field: 'radical_metric_unit' as const, type: 'text', placeholder: 'views' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 block mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={edit[field]}
                        onChange={(e) => setEdit((s) => ({ ...s, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full text-[12px] font-mono text-white/80 bg-surface border border-white/10 rounded-lg px-2.5 py-2 focus:outline-none"
                        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${accentHex}40`)}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {saveError && <p className="text-[11px] text-red-600 font-medium">{saveError}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setEditing(false); setSaveError(null); }}
                  disabled={saving}
                  className="text-[12px] font-semibold text-white/45 hover:text-white/70 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="text-[12px] font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-1.5"
                  style={{ backgroundColor: accentHex }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M5 1.5A3.5 3.5 0 1 1 1.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Saving
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── ImpactTable ──────────────────────────────────────────────────────────────

export function ImpactTable({ initialImpacts }: ImpactTableProps) {
  const [impacts, setImpacts] = useState<ImpactEvent[]>(initialImpacts);
  const [statusFilter, setStatusFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('reported_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const supabase = createClient();

  const filtered = useMemo(() => {
    let list = [...impacts];
    if (statusFilter) list = list.filter((i) => i.status === statusFilter);
    if (programFilter) list = list.filter((i) => i.program_area === programFilter);
    if (typeFilter) list = list.filter((i) => i.impact_type === typeFilter);
    list.sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [impacts, statusFilter, programFilter, typeFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const setLoading = (id: string, val: boolean) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (val) { next.add(id); } else { next.delete(id); }
      return next;
    });
  };

  const updateStatus = async (id: string, status: 'approved' | 'archived') => {
    setLoading(id, true);
    const { error } = await supabase.from('impact_events').update({ status }).eq('id', id);
    if (!error) setImpacts((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setLoading(id, false);
  };

  const rerunAi = async (impact: ImpactEvent) => {
    setLoading(impact.id, true);
    try {
      const res = await fetch('/api/enhance-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_description: impact.raw_description, program_area: impact.program_area }),
      });
      if (!res.ok) throw new Error('AI failed');
      const result = await res.json();
      await supabase.from('impact_events').update({
        ai_narrative: result.ai_narrative,
        impact_type: result.impact_type,
        internal_headline: result.internal_headline,
        funder_headline: result.funder_headline,
        radical_metric_label: result.radical_metric_label,
        radical_metric_value: result.radical_metric_value,
        radical_metric_unit: result.radical_metric_unit,
        kpis_impacted: result.kpis_impacted,
        confidence: result.confidence,
      }).eq('id', impact.id);
      setImpacts((prev) =>
        prev.map((i) => i.id === impact.id ? { ...i, ...result } : i)
      );
    } catch { /* silent */ }
    setLoading(impact.id, false);
  };

  const bulkApprove = async () => {
    const ids = Array.from(selected);
    await supabase.from('impact_events').update({ status: 'approved' }).in('id', ids);
    setImpacts((prev) => prev.map((i) => (selected.has(i.id) ? { ...i, status: 'approved' } : i)));
    setSelected(new Set());
  };

  const bulkArchive = async () => {
    const ids = Array.from(selected);
    await supabase.from('impact_events').update({ status: 'archived' }).in('id', ids);
    setImpacts((prev) => prev.map((i) => (selected.has(i.id) ? { ...i, status: 'archived' } : i)));
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((i) => i.id)));
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={12} className="inline ml-0.5" /> : <ChevronDown size={12} className="inline ml-0.5" />
    ) : null;

  const thClass = 'px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider cursor-pointer hover:text-white transition-colors select-none';
  const tdClass = 'px-3 py-3 text-sm align-top';

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-1 bg-surface-card border border-white/[0.07] rounded-[10px] p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
                statusFilter === tab.value ? 'bg-defender-red text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="rounded-[10px] border border-white/[0.07] bg-surface px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-defender-red"
        >
          <option value="">All Programs</option>
          {PROGRAM_AREAS.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-[10px] border border-white/[0.07] bg-surface px-3 py-1.5 text-xs font-medium text-white focus:outline-none focus:border-defender-red"
        >
          <option value="">All Types</option>
          {IMPACT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="ml-auto text-xs text-white/35 self-center">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-defender-red/5 border border-defender-red/20 rounded-[10px]">
          <span className="text-xs font-semibold text-defender-red">{selected.size} selected</span>
          <button onClick={bulkApprove} className="text-xs font-semibold text-defender-green hover:underline">Approve All</button>
          <button onClick={bulkArchive} className="text-xs font-semibold text-white/50 hover:underline">Archive All</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-white/35 hover:text-white/60">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-card border border-white/[0.07] rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-white/[0.07]">
              <tr>
                <th className="px-3 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-defender-red"
                  />
                </th>
                <th className="px-3 py-3 w-8" />
                <th className={thClass} onClick={() => toggleSort('reported_at')}>Date <SortIcon col="reported_at" /></th>
                <th className={thClass} onClick={() => toggleSort('reported_by_name')}>Reporter <SortIcon col="reported_by_name" /></th>
                <th className={thClass} onClick={() => toggleSort('program_area')}>Program <SortIcon col="program_area" /></th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Headline</th>
                <th className={thClass}>Metric</th>
                <th className={thClass} onClick={() => toggleSort('status')}>Status <SortIcon col="status" /></th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-sm text-white/30">
                    No impact events match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((impact) => {
                  const loading = loadingIds.has(impact.id);
                  const isExpanded = expandedId === impact.id;
                  const programLabel = PROGRAM_AREAS.find((a) => a.value === impact.program_area)?.label ?? impact.program_area;
                  const typeLabel = IMPACT_TYPES.find((t) => t.value === impact.impact_type)?.label ?? impact.impact_type ?? '';
                  const accentHex = AREA_HEX[impact.program_area] ?? '#94A3B8';

                  return (
                    <>
                      <tr
                        key={impact.id}
                        className={`transition-colors border-b border-white/[0.05] ${loading ? 'opacity-60' : ''} ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}
                        style={isExpanded ? { borderLeft: `3px solid ${accentHex}` } : { borderLeft: '3px solid transparent' }}
                      >
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(impact.id)}
                            onChange={() => toggleSelect(impact.id)}
                            className="accent-defender-red"
                          />
                        </td>
                        {/* Expand toggle */}
                        <td className="px-1 py-3">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : impact.id)}
                            className="p-1 rounded transition-colors hover:bg-white/[0.05] text-white/30 hover:text-white/60"
                            title={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            <ChevronRight
                              size={14}
                              style={{
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                              }}
                            />
                          </button>
                        </td>
                        <td className={tdClass}>
                          <span className="font-mono text-xs text-white/40">{formatDate(impact.reported_at)}</span>
                        </td>
                        <td className={tdClass}>
                          <div className="font-medium text-white text-xs">{impact.reported_by_name}</div>
                          {impact.reported_by_email && (
                            <div className="text-white/35 text-xs">{impact.reported_by_email}</div>
                          )}
                        </td>
                        <td className={tdClass}>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PROGRAM_AREA_BADGE[impact.program_area] || 'bg-gray-100 text-gray-600'}`}>
                            {programLabel}
                          </span>
                        </td>
                        <td className={tdClass}>
                          <span className="text-xs text-white/45">{typeLabel}</span>
                        </td>
                        <td className={tdClass}>
                          <div className="font-semibold text-white text-xs leading-tight max-w-[200px]" title={impact.internal_headline ?? ''}>
                            {impact.internal_headline || <span className="italic text-white/30">No headline</span>}
                          </div>
                          {impact.funder_headline && (
                            <div className="text-white/35 text-xs mt-0.5 leading-tight max-w-[200px] truncate">{impact.funder_headline}</div>
                          )}
                        </td>
                        <td className={tdClass}>
                          {impact.radical_metric_label ? (
                            <div>
                              <span className="font-bold font-mono text-white text-sm">
                                {impact.radical_metric_value?.toLocaleString() ?? '?'}
                              </span>
                              <span className="text-xs text-white/35 ml-1">{impact.radical_metric_unit}</span>
                              <div className="text-xs text-white/45">{impact.radical_metric_label}</div>
                            </div>
                          ) : (
                            <span className="text-white/25 text-xs">--</span>
                          )}
                        </td>
                        <td className={tdClass}>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[impact.status] || 'bg-gray-100 text-gray-600'}`}>
                            {impact.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            {impact.status !== 'approved' && (
                              <button
                                onClick={() => updateStatus(impact.id, 'approved')}
                                disabled={loading}
                                title="Approve"
                                className="p-1.5 rounded-[8px] text-defender-green hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}
                            {impact.status !== 'archived' && (
                              <button
                                onClick={() => updateStatus(impact.id, 'archived')}
                                disabled={loading}
                                title="Archive"
                                className="p-1.5 rounded-[8px] text-white/35 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                              >
                                <Archive size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => rerunAi(impact)}
                              disabled={loading}
                              title="Re-run AI"
                              className="p-1.5 rounded-[8px] text-white/35 hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline expanded detail + edit panel */}
                      {isExpanded && (
                        <ExpandedRow
                          key={`${impact.id}-expanded`}
                          impact={impacts.find((i) => i.id === impact.id) ?? impact}
                          accentHex={accentHex}
                          onUpdate={(updated) =>
                            setImpacts((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
                          }
                          onClose={() => setExpandedId(null)}
                        />
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
