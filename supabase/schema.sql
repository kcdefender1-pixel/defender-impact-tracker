-- ============================================================
-- Defender Impact Dashboard — Supabase Schema
-- Run this entire file in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fyaskxeosddfykuonrhx/sql/new
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ENUMS
create type program_area as enum (
  'editorial',
  'mutual_aid',
  'political_education',
  'arts_culture',
  'development_fundraising',
  'operations_systems',
  'radar',
  'other'
);

create type impact_type as enum (
  'policy_win',
  'resource_delivery',
  'narrative_shift',
  'accountability',
  'legal_action',
  'event_turnout',
  'funds_raised',
  'safety_deescalation',
  'tipoff_lead',
  'other'
);

create type story_source as enum ('rss', 'manual');
create type event_source as enum ('manual_form', 'rss_linked', 'admin');
create type event_visibility as enum ('internal', 'public');
create type event_status as enum ('pending', 'approved', 'archived');
create type user_role as enum ('admin', 'editor', 'contributor', 'viewer');
create type integration_health as enum ('ok', 'warning', 'error');

-- STORIES (RSS + manual)
create table stories (
  id uuid primary key default uuid_generate_v4(),
  source story_source not null default 'rss',
  rss_url text,
  title text not null,
  slug text,
  link text,
  published_at timestamptz,
  author text,
  tags text[] default '{}',
  summary_raw text,
  summary_ai text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- IMPACT EVENTS (the heart of the system)
create table impact_events (
  id uuid primary key default uuid_generate_v4(),
  reported_at timestamptz default now(),
  reported_by_name text not null,
  reported_by_email text,
  program_area program_area not null,
  impact_type impact_type,
  raw_description text not null,
  ai_narrative text,
  internal_headline text,
  funder_headline text,
  radical_metric_label text,
  radical_metric_value numeric,
  radical_metric_unit text,
  confidence int default 0 check (confidence >= 0 and confidence <= 100),
  location_text text,
  evidence_links text[] default '{}',
  related_story_id uuid references stories(id),
  kpis_impacted text[] default '{}',
  visibility event_visibility default 'internal',
  status event_status default 'pending',
  source event_source default 'manual_form',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- METRIC SNAPSHOTS (manual KPI tracking)
create table metric_snapshots (
  id uuid primary key default uuid_generate_v4(),
  taken_at timestamptz default now(),
  metric_key text not null,
  value numeric not null,
  notes text,
  created_at timestamptz default now()
);

-- INTEGRATION STATUS (system health tracking)
create table integration_status (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  enabled boolean default true,
  last_run_at timestamptz,
  status integration_health default 'ok',
  message text,
  updated_at timestamptz default now()
);

-- KPI CONFIG (editable Big 10)
create table kpi_config (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  title text not null,
  description text,
  rationale text,
  freq text default 'weekly',
  unit text,
  notes text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AUDIT LOG
create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  table_name text not null,
  record_id uuid not null,
  action text not null,
  changed_by uuid,
  changed_at timestamptz default now(),
  old_values jsonb,
  new_values jsonb
);

-- INDEXES
create index idx_impact_events_status on impact_events(status);
create index idx_impact_events_program on impact_events(program_area);
create index idx_impact_events_reported on impact_events(reported_at desc);
create index idx_stories_published on stories(published_at desc);
create index idx_metric_snapshots_key on metric_snapshots(metric_key, taken_at desc);

-- UPDATED_AT TRIGGER
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stories_updated before update on stories
  for each row execute function update_updated_at();
create trigger impact_events_updated before update on impact_events
  for each row execute function update_updated_at();
create trigger kpi_config_updated before update on kpi_config
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY
alter table stories enable row level security;
alter table impact_events enable row level security;
alter table metric_snapshots enable row level security;
alter table integration_status enable row level security;
alter table kpi_config enable row level security;
alter table audit_log enable row level security;

create policy "Authenticated users can read all stories"
  on stories for select to authenticated using (true);

create policy "Authenticated users can read all impacts"
  on impact_events for select to authenticated using (true);

create policy "Authenticated users can insert impacts"
  on impact_events for insert to authenticated with check (true);

create policy "Authenticated users can update impacts"
  on impact_events for update to authenticated using (true);

create policy "Authenticated users can read metrics"
  on metric_snapshots for select to authenticated using (true);

create policy "Authenticated users can read kpi config"
  on kpi_config for select to authenticated using (true);

create policy "Public can insert impacts via form"
  on impact_events for insert to anon with check (source = 'manual_form');

create policy "Public can read stories for autocomplete"
  on stories for select to anon using (true);

create policy "Public can read kpi config"
  on kpi_config for select to anon using (true);

create policy "Public can read metric snapshots"
  on metric_snapshots for select to anon using (true);

create policy "Public can read approved impacts"
  on impact_events for select to anon using (status = 'approved');

create policy "Public can read integration status"
  on integration_status for select to anon using (true);

-- ============================================================
-- KPI SEED DATA (Big 10)
-- ============================================================
insert into kpi_config (key, title, description, rationale, freq, unit, sort_order, notes) values
('audience_growth_total_reach', 'Audience Growth (Editorial + Org-wide)', 'Total people reached across IG, FB, website, and newsletter.', 'Tracks narrative power and audience expansion.', 'weekly', 'people', 1, 'For MVP, allow manual entry or CSV upload; automate later.'),
('stories_published_total_weekly', 'Number of Defender Stories Published', 'Total number of stories published (social posts, reels, short video explainers, newsletters, articles). Goal: at least 2 per week.', 'Adds accountability to story pipeline health without being punitive.', 'weekly', 'stories', 2, null),
('editorial_narrative_power_pct', 'Editorial Narrative Power', '% of stories (all formats) that meet at least 3 of 5 defined Defender Story Criteria.', 'Measures narrative quality and alignment with Defender criteria.', 'weekly', '%', 3, null),
('political_education_participants', 'Political Education Engagement', 'Number of participants in Freedom School, trainings, and educational offerings.', 'Measures leadership in abolitionist pedagogy and Black political education.', 'weekly', 'participants', 4, null),
('mutual_aid_participation_team_members', 'Mutual Aid Participation', 'Number of active team members involved in Mutual Aid programs.', 'Measures depth of engagement and movement-building muscle.', 'weekly', 'people', 5, null),
('community_served_count', 'Community Served (Mutual Aid)', 'Number of people directly served (clothing, groceries, bookstore support, etc.).', 'Captures material support provided to Black community.', 'weekly', 'people', 6, null),
('arts_culture_engagement_attendees_artists', 'Arts & Culture Engagement', 'Number of event attendees + unique Black artists engaged.', 'Reflects cultural power-building, artist relationships, and creative resonance.', 'weekly', 'people', 7, null),
('membership_sustaining_donors_new_monthly', 'Membership Health: New Sustaining Donors', 'Number of sustaining donors we are building monthly.', 'Tracks community commitment and grassroots sustainability.', 'monthly', 'donors', 8, null),
('membership_retention_rate', 'Membership Health: Retention', 'Donor retention rate.', 'Sustainability.', 'monthly', '%', 9, null),
('revenue_mix_quarterly_share_and_growth', 'Revenue Mix Dashboard & Growth/Diversification', 'Transparent breakdown of grants, major gifts, membership, ad revenue, etc.', 'Supports internal strategy and external trust-building.', 'quarterly', 'USD / %', 10, null);
