'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { PROGRAM_AREAS } from '@/lib/constants';
import type { AIEnhancementResult, ImpactFormData, ProgramArea } from '@/lib/types';
import { AiReviewPanel } from '@/components/ai-review-panel';
import { createClient } from '@/lib/supabase/client';

type Phase = 'form' | 'enhancing' | 'review' | 'saving' | 'done';

const EMPTY_FORM: ImpactFormData = {
  reported_by_name: '',
  reported_by_email: '',
  program_area: '',
  raw_description: '',
  location_text: '',
  evidence_links: [],
};

export default function ReportPage() {
  const [phase, setPhase] = useState<Phase>('form');
  const [form, setForm] = useState<ImpactFormData>(EMPTY_FORM);
  const [linkInput, setLinkInput] = useState('');
  const [formError, setFormError] = useState('');
  const [aiResult, setAiResult] = useState<AIEnhancementResult | null>(null);
  const [enhanceError, setEnhanceError] = useState('');
  const [savedId, setSavedId] = useState('');

  const handleEnhance = async () => {
    if (!form.reported_by_name.trim()) {
      setFormError('Your name is required.');
      return;
    }
    if (!form.program_area) {
      setFormError('Program area is required.');
      return;
    }
    if (form.raw_description.trim().length < 20) {
      setFormError('Please describe the impact in at least a sentence or two.');
      return;
    }
    setFormError('');
    setPhase('enhancing');
    setEnhanceError('');

    try {
      const res = await fetch('/api/enhance-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_description: form.raw_description,
          program_area: form.program_area,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Enhancement failed');
      }
      const result: AIEnhancementResult = await res.json();
      setAiResult(result);
      setPhase('review');
    } catch (err) {
      setEnhanceError(err instanceof Error ? err.message : 'Something went wrong.');
      setPhase('form');
    }
  };

  const handleSave = async (edited: AIEnhancementResult) => {
    setPhase('saving');
    const supabase = createClient();
    const { data, error } = await supabase
      .from('impact_events')
      .insert({
        reported_by_name: form.reported_by_name,
        reported_by_email: form.reported_by_email || null,
        program_area: form.program_area as ProgramArea,
        raw_description: form.raw_description,
        location_text: form.location_text || null,
        evidence_links: form.evidence_links,
        ai_narrative: edited.ai_narrative,
        impact_type: edited.impact_type,
        internal_headline: edited.internal_headline,
        funder_headline: edited.funder_headline,
        radical_metric_label: edited.radical_metric_label,
        radical_metric_value: edited.radical_metric_value,
        radical_metric_unit: edited.radical_metric_unit,
        kpis_impacted: edited.kpis_impacted,
        confidence: edited.confidence,
        status: 'pending',
        source: 'manual_form',
        visibility: 'internal',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Save error:', error);
      setPhase('review');
      return;
    }
    setSavedId(data.id);
    setPhase('done');
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setLinkInput('');
    setAiResult(null);
    setEnhanceError('');
    setPhase('form');
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !form.evidence_links.includes(trimmed)) {
      setForm((f) => ({ ...f, evidence_links: [...f.evidence_links, trimmed] }));
      setLinkInput('');
    }
  };

  const removeLink = (link: string) => {
    setForm((f) => ({
      ...f,
      evidence_links: f.evidence_links.filter((l) => l !== link),
    }));
  };

  const inputClass =
    'w-full rounded-[10px] border border-white/10 bg-surface px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-defender-red/30 focus:border-defender-red transition-colors';
  const labelClass = 'block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5';

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-bold text-defender-red uppercase tracking-widest mb-1">
          The Kansas City Defender
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight">
          Report an Impact
        </h1>
        <p className="text-white/50 mt-1.5 text-sm">
          Describe what happened in plain language. Claude will turn it into a structured impact record with headlines and metrics.
        </p>
      </div>

      {/* Form */}
      {(phase === 'form' || phase === 'enhancing') && (
        <div className="bg-surface-card border border-white/[0.07] rounded-card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Your Name *</label>
              <input
                type="text"
                value={form.reported_by_name}
                onChange={(e) => setForm((f) => ({ ...f, reported_by_name: e.target.value }))}
                placeholder="Full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email (optional)</label>
              <input
                type="email"
                value={form.reported_by_email}
                onChange={(e) => setForm((f) => ({ ...f, reported_by_email: e.target.value }))}
                placeholder="you@kansascitydefender.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Pillar / Program Area *</label>
              <select
                value={form.program_area}
                onChange={(e) =>
                  setForm((f) => ({ ...f, program_area: e.target.value as ProgramArea }))
                }
                className={inputClass}
              >
                <option value="">Select pillar...</option>
                {PROGRAM_AREAS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Location (optional)</label>
              <input
                type="text"
                value={form.location_text}
                onChange={(e) => setForm((f) => ({ ...f, location_text: e.target.value }))}
                placeholder="e.g. Ms. Willa's, Kansas City MO"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelClass}>What happened? *</label>
            <textarea
              value={form.raw_description}
              onChange={(e) => setForm((f) => ({ ...f, raw_description: e.target.value }))}
              rows={6}
              placeholder="Write it like you'd say it in Slack. Include numbers, names, places, and context. For example: 'Washed approximately 400 pounds of kids clothing on 2/11 in preparation for the 2/21 community clothing distribution at Vineyard Neighborhood Association.'"
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>Evidence Links (optional)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                placeholder="https://..."
                className={inputClass}
              />
              <button
                onClick={addLink}
                type="button"
                className="px-3 py-2.5 border border-white/10 rounded-[10px] text-white/40 hover:bg-white/[0.05] transition-colors shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
            {form.evidence_links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.evidence_links.map((link) => (
                  <div
                    key={link}
                    className="flex items-center gap-1.5 bg-white/[0.08] rounded-full px-3 py-1 text-xs text-white/55 max-w-xs"
                  >
                    <span className="truncate">{link}</span>
                    <button onClick={() => removeLink(link)} className="shrink-0 hover:text-defender-red">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formError && (
            <p className="text-xs text-defender-red mb-4">{formError}</p>
          )}
          {enhanceError && (
            <p className="text-xs text-defender-red mb-4">AI enhancement failed: {enhanceError}</p>
          )}

          <button
            onClick={handleEnhance}
            disabled={phase === 'enhancing'}
            className="flex items-center justify-center gap-2 bg-defender-red text-white rounded-button px-6 py-3 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-60 w-full md:w-auto"
          >
            {phase === 'enhancing' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Claude is building your impact record...
              </>
            ) : (
              'Submit & Enhance with AI'
            )}
          </button>
        </div>
      )}

      {/* Review */}
      {(phase === 'review' || phase === 'saving') && aiResult && (
        <div>
          <div className="mb-6 p-4 bg-defender-green/10 border border-defender-green/30 rounded-card">
            <div className="text-sm font-semibold text-defender-green">
              Claude enhanced your impact. Review and edit below before saving.
            </div>
          </div>
          <AiReviewPanel
            rawData={form}
            aiResult={aiResult}
            onSave={handleSave}
            onReset={handleReset}
            isSaving={phase === 'saving'}
          />
        </div>
      )}

      {/* Success */}
      {phase === 'done' && (
        <div className="max-w-md mx-auto text-center py-16">
          <CheckCircle size={48} className="text-defender-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Impact Submitted</h2>
          <p className="text-white/50 text-sm mb-6">
            Your impact report is saved and pending review. An admin will approve it shortly.
          </p>
          {savedId && (
            <p className="text-xs font-mono text-white/35 mb-6">ID: {savedId}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="bg-defender-red text-white rounded-button px-5 py-2.5 text-sm font-semibold hover:bg-rose-700 transition-colors"
            >
              Report Another Impact
            </button>
            <a
              href="/"
              className="border border-white/10 rounded-button px-5 py-2.5 text-sm font-semibold text-white/55 hover:bg-white/[0.05] transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
