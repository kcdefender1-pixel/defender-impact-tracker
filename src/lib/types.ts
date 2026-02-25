export type ProgramArea =
  | 'editorial'
  | 'mutual_aid'
  | 'political_education'
  | 'arts_culture'
  | 'development_fundraising'
  | 'operations_systems'
  | 'radar'
  | 'other';

export type ImpactType =
  | 'policy_win'
  | 'resource_delivery'
  | 'narrative_shift'
  | 'accountability'
  | 'legal_action'
  | 'event_turnout'
  | 'funds_raised'
  | 'safety_deescalation'
  | 'tipoff_lead'
  | 'other';

export type EventStatus = 'pending' | 'approved' | 'archived';
export type EventVisibility = 'internal' | 'public';
export type EventSource = 'manual_form' | 'rss_linked' | 'admin';
export type StorySource = 'rss' | 'manual';
export type IntegrationHealth = 'ok' | 'warning' | 'error';

export interface ImpactEvent {
  id: string;
  reported_at: string;
  reported_by_name: string;
  reported_by_email: string | null;
  program_area: ProgramArea;
  impact_type: ImpactType | null;
  raw_description: string;
  ai_narrative: string | null;
  internal_headline: string | null;
  funder_headline: string | null;
  radical_metric_label: string | null;
  radical_metric_value: number | null;
  radical_metric_unit: string | null;
  confidence: number;
  location_text: string | null;
  evidence_links: string[];
  related_story_id: string | null;
  kpis_impacted: string[];
  visibility: EventVisibility;
  status: EventStatus;
  source: EventSource;
  created_at: string;
  updated_at: string;
}

export interface KpiConfig {
  id: string;
  key: string;
  title: string;
  description: string | null;
  rationale: string | null;
  freq: string;
  unit: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MetricSnapshot {
  id: string;
  taken_at: string;
  metric_key: string;
  value: number;
  notes: string | null;
  created_at: string;
}

export interface Story {
  id: string;
  source: StorySource;
  rss_url: string | null;
  title: string;
  slug: string | null;
  link: string | null;
  published_at: string | null;
  author: string | null;
  tags: string[];
  summary_raw: string | null;
  summary_ai: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  enabled: boolean;
  last_run_at: string | null;
  status: IntegrationHealth;
  message: string | null;
  updated_at: string;
}

export interface AIEnhancementResult {
  ai_narrative: string;
  impact_type: ImpactType;
  internal_headline: string;
  funder_headline: string;
  radical_metric_label: string | null;
  radical_metric_value: number | null;
  radical_metric_unit: string | null;
  kpis_impacted: string[];
  confidence: number;
}

export interface ImpactFormData {
  reported_by_name: string;
  reported_by_email: string;
  program_area: ProgramArea | '';
  raw_description: string;
  location_text: string;
  evidence_links: string[];
}
