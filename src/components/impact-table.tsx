'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, Archive, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ImpactTable({ initialImpacts }: ImpactTableProps) {
  const [impacts, setImpacts] = useState<ImpactEvent[]>(initialImpacts);
  const [statusFilter, setStatusFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('reported_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const filtered = useMemo(() => {
    let list = [...impacts];
    if (statusFilter) list = list.filter((i) => i.status === statusFilter);
    if (programFilter) list = list.filter((i) => i.program_area === programFilter);
    if (typeFilter) list = list.filter((i) => i.impact_type === typeFilter);

    list.sort((a, b) => {
      const av: string = String(a[sortKey] ?? '');
      const bv: string = String(b[sortKey] ?? '');
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
    const { error } = await supabase
      .from('impact_events')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setImpacts((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    }
    setLoading(id, false);
  };

  const rerunAi = async (impact: ImpactEvent) => {
    setLoading(impact.id, true);
    try {
      const res = await fetch('/api/enhance-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_description: impact.raw_description,
          program_area: impact.program_area,
        }),
      });
      if (!res.ok) throw new Error('AI failed');
      const result = await res.json();
      await supabase
        .from('impact_events')
        .update({
          ai_narrative: result.ai_narrative,
          impact_type: result.impact_type,
          internal_headline: result.internal_headline,
          funder_headline: result.funder_headline,
          radical_metric_label: result.radical_metric_label,
          radical_metric_value: result.radical_metric_value,
          radical_metric_unit: result.radical_metric_unit,
          kpis_impacted: result.kpis_impacted,
          confidence: result.confidence,
        })
        .eq('id', impact.id);
      setImpacts((prev) =>
        prev.map((i) =>
          i.id === impact.id
            ? {
                ...i,
                ai_narrative: result.ai_narrative,
                impact_type: result.impact_type,
                internal_headline: result.internal_headline,
                funder_headline: result.funder_headline,
                radical_metric_label: result.radical_metric_label,
                radical_metric_value: result.radical_metric_value,
                radical_metric_unit: result.radical_metric_unit,
                kpis_impacted: result.kpis_impacted,
                confidence: result.confidence,
              }
            : i
        )
      );
    } catch {
      // silent fail - user can retry
    }
    setLoading(impact.id, false);
  };

  const bulkApprove = async () => {
    const ids = Array.from(selected);
    await supabase
      .from('impact_events')
      .update({ status: 'approved' })
      .in('id', ids);
    setImpacts((prev) =>
      prev.map((i) => (selected.has(i.id) ? { ...i, status: 'approved' } : i))
    );
    setSelected(new Set());
  };

  const bulkArchive = async () => {
    const ids = Array.from(selected);
    await supabase
      .from('impact_events')
      .update({ status: 'archived' })
      .in('id', ids);
    setImpacts((prev) =>
      prev.map((i) => (selected.has(i.id) ? { ...i, status: 'archived' } : i))
    );
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
      sortDir === 'asc' ? (
        <ChevronUp size={12} className="inline ml-0.5" />
      ) : (
        <ChevronDown size={12} className="inline ml-0.5" />
      )
    ) : null;

  const thClass =
    'px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-defender-black transition-colors select-none';
  const tdClass = 'px-3 py-3 text-sm align-top';

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Status tabs */}
        <div className="flex gap-1 bg-white/60 border border-gray-200/50 rounded-[10px] p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-defender-red text-white'
                  : 'text-gray-500 hover:text-defender-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="rounded-[10px] border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 focus:outline-none focus:border-defender-red"
        >
          <option value="">All Programs</option>
          {PROGRAM_AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-[10px] border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 focus:outline-none focus:border-defender-red"
        >
          <option value="">All Types</option>
          {IMPACT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <div className="ml-auto text-xs text-gray-400 self-center">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-defender-red/5 border border-defender-red/20 rounded-[10px]">
          <span className="text-xs font-semibold text-defender-red">
            {selected.size} selected
          </span>
          <button
            onClick={bulkApprove}
            className="text-xs font-semibold text-defender-green hover:underline"
          >
            Approve All
          </button>
          <button
            onClick={bulkArchive}
            className="text-xs font-semibold text-gray-500 hover:underline"
          >
            Archive All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-3 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-defender-red"
                  />
                </th>
                <th className={thClass} onClick={() => toggleSort('reported_at')}>
                  Date <SortIcon col="reported_at" />
                </th>
                <th className={thClass} onClick={() => toggleSort('reported_by_name')}>
                  Reporter <SortIcon col="reported_by_name" />
                </th>
                <th className={thClass} onClick={() => toggleSort('program_area')}>
                  Program <SortIcon col="program_area" />
                </th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Headline</th>
                <th className={thClass}>Metric</th>
                <th className={thClass} onClick={() => toggleSort('status')}>
                  Status <SortIcon col="status" />
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                    No impact events match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((impact) => {
                  const loading = loadingIds.has(impact.id);
                  const programLabel = PROGRAM_AREAS.find(
                    (a) => a.value === impact.program_area
                  )?.label ?? impact.program_area;
                  const typeLabel = IMPACT_TYPES.find(
                    (t) => t.value === impact.impact_type
                  )?.label ?? impact.impact_type ?? '';

                  return (
                    <tr
                      key={impact.id}
                      className={`hover:bg-gray-50/50 transition-colors ${loading ? 'opacity-60' : ''}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(impact.id)}
                          onChange={() => toggleSelect(impact.id)}
                          className="accent-defender-red"
                        />
                      </td>
                      <td className={tdClass}>
                        <span className="font-mono text-xs text-gray-500">
                          {formatDate(impact.reported_at)}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="font-medium text-defender-black text-xs">
                          {impact.reported_by_name}
                        </div>
                        {impact.reported_by_email && (
                          <div className="text-gray-400 text-xs">{impact.reported_by_email}</div>
                        )}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            PROGRAM_AREA_BADGE[impact.program_area] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {programLabel}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <span className="text-xs text-gray-500">{typeLabel}</span>
                      </td>
                      <td className={tdClass}>
                        <div
                          className="font-semibold text-defender-black text-xs leading-tight max-w-[200px]"
                          title={impact.internal_headline ?? ''}
                        >
                          {impact.internal_headline || (
                            <span className="italic text-gray-400">No headline</span>
                          )}
                        </div>
                        {impact.funder_headline && (
                          <div className="text-gray-400 text-xs mt-0.5 leading-tight max-w-[200px] truncate">
                            {impact.funder_headline}
                          </div>
                        )}
                      </td>
                      <td className={tdClass}>
                        {impact.radical_metric_label ? (
                          <div>
                            <span className="font-bold font-mono text-defender-black text-sm">
                              {impact.radical_metric_value?.toLocaleString() ?? '?'}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              {impact.radical_metric_unit}
                            </span>
                            <div className="text-xs text-gray-500">
                              {impact.radical_metric_label}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">--</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            STATUS_BADGE[impact.status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
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
                              className="p-1.5 rounded-[8px] text-defender-green hover:bg-green-50 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {impact.status !== 'archived' && (
                            <button
                              onClick={() => updateStatus(impact.id, 'archived')}
                              disabled={loading}
                              title="Archive"
                              className="p-1.5 rounded-[8px] text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              <Archive size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => rerunAi(impact)}
                            disabled={loading}
                            title="Re-run AI"
                            className="p-1.5 rounded-[8px] text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          >
                            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
