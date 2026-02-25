export const PROGRAM_AREAS = [
  { value: 'editorial', label: 'Editorial', color: 'defender-red' },
  { value: 'mutual_aid', label: 'Mutual Aid', color: 'defender-green' },
  { value: 'political_education', label: 'Political Education', color: 'defender-gold' },
  { value: 'arts_culture', label: 'Arts & Culture', color: 'purple' },
  { value: 'development_fundraising', label: 'Development & Fundraising', color: 'blue' },
  { value: 'operations_systems', label: 'Operations & Systems', color: 'gray' },
  { value: 'radar', label: 'Radar', color: 'orange' },
  { value: 'other', label: 'Other', color: 'gray' },
] as const;

export const IMPACT_TYPES = [
  { value: 'policy_win', label: 'Policy Win' },
  { value: 'resource_delivery', label: 'Resource Delivery' },
  { value: 'narrative_shift', label: 'Narrative Shift' },
  { value: 'accountability', label: 'Accountability' },
  { value: 'legal_action', label: 'Legal Action' },
  { value: 'event_turnout', label: 'Event Turnout' },
  { value: 'funds_raised', label: 'Funds Raised' },
  { value: 'safety_deescalation', label: 'Safety / De-escalation' },
  { value: 'tipoff_lead', label: 'Tip-off / Lead' },
  { value: 'other', label: 'Other' },
] as const;

export const KPI_KEYS = [
  'audience_growth_total_reach',
  'stories_published_total_weekly',
  'editorial_narrative_power_pct',
  'political_education_participants',
  'mutual_aid_participation_team_members',
  'community_served_count',
  'arts_culture_engagement_attendees_artists',
  'membership_sustaining_donors_new_monthly',
  'membership_retention_rate',
  'revenue_mix_quarterly_share_and_growth',
] as const;

export const PROGRAM_AREA_BADGE: Record<string, string> = {
  editorial: 'bg-rose-100 text-rose-700',
  mutual_aid: 'bg-green-100 text-green-700',
  political_education: 'bg-amber-100 text-amber-700',
  arts_culture: 'bg-purple-100 text-purple-700',
  development_fundraising: 'bg-blue-100 text-blue-700',
  operations_systems: 'bg-gray-100 text-gray-700',
  radar: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700',
};

export const PROGRAM_AREA_DOT: Record<string, string> = {
  editorial: 'bg-defender-red',
  mutual_aid: 'bg-defender-green',
  political_education: 'bg-defender-gold',
  arts_culture: 'bg-purple-500',
  development_fundraising: 'bg-blue-500',
  operations_systems: 'bg-gray-400',
  radar: 'bg-orange-500',
  other: 'bg-gray-400',
};

export const KPI_LEFT_BORDER: Record<string, string> = {
  audience_growth_total_reach: 'border-l-defender-red',
  stories_published_total_weekly: 'border-l-defender-red',
  editorial_narrative_power_pct: 'border-l-defender-red',
  political_education_participants: 'border-l-defender-gold',
  mutual_aid_participation_team_members: 'border-l-defender-green',
  community_served_count: 'border-l-defender-green',
  arts_culture_engagement_attendees_artists: 'border-l-purple-500',
  membership_sustaining_donors_new_monthly: 'border-l-blue-500',
  membership_retention_rate: 'border-l-blue-500',
  revenue_mix_quarterly_share_and_growth: 'border-l-defender-gold',
};

export const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
};

export const AI_SYSTEM_PROMPT = `You are an editor for The Kansas City Defender, a radical abolitionist Black nonprofit media organization in Kansas City, Missouri.

Write with clarity, warmth, and precision. Avoid jargon. Never use em dashes. Keep compassion and courage at the center.

Given a raw description of an impact event and its program area, produce a JSON object with these fields:

1. "ai_narrative": A 3-5 sentence narrative summarizing the impact in accessible language with concrete details. Write in the tradition of Ida B. Wells and the Black radical press. Center the dignity of impacted communities.

2. "impact_type": One of: policy_win, resource_delivery, narrative_shift, accountability, legal_action, event_turnout, funds_raised, safety_deescalation, tipoff_lead, other

3. "internal_headline": Bold, radical, galvanizing headline for staff. Max 100 characters. This should feel like it belongs on the front page of the Chicago Defender.

4. "funder_headline": Compelling and professional headline for external audiences. Max 110 characters. Should convey impact without diluting the work.

5. "radical_metric_label": A short label for the key metric (e.g., "Families Fed", "Officers Exposed", "Students Organized")

6. "radical_metric_value": Numeric value if extractable from the description, or null

7. "radical_metric_unit": Unit if applicable, or null

8. "kpis_impacted": Array of relevant KPI keys from this list:
   - audience_growth_total_reach
   - stories_published_total_weekly
   - editorial_narrative_power_pct
   - political_education_participants
   - mutual_aid_participation_team_members
   - community_served_count
   - arts_culture_engagement_attendees_artists
   - membership_sustaining_donors_new_monthly
   - membership_retention_rate
   - revenue_mix_quarterly_share_and_growth

9. "confidence": Integer 0-100 representing classification confidence

Headlines must never include sensationalism detached from facts.

Respond ONLY with valid JSON. No markdown, no backticks, no explanation.`;
