import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const SEED_STORIES = [
  {
    title: 'BREAKING: Platform Ventures Backs Down From ICE Detention Center Sale After Weeks of Mass Organizing and Protest',
    link: 'https://kansascitydefender.com/justice/platform-ventures-backs-down/',
    published_at: '2026-02-12T12:00:00Z',
    author: 'Ryan S.',
    tags: ['justice', 'ice', 'organizing', 'platform-ventures'],
    summary_raw: 'The people won. For now.',
    source: 'manual',
  },
  {
    title: "The Defender's Abolitionist Freedom School Is Back: Cohort 3 Applications Now Open",
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/defender-peoples-programs/b-real-academy-cohort-3-applications-open/',
    published_at: '2026-02-10T12:00:00Z',
    author: 'KC Defender Staff',
    tags: ['political-education', 'b-real-academy', 'freedom-school'],
    summary_raw: "The Defender's Abolitionist Freedom School is accepting applications for Cohort 3.",
    source: 'manual',
  },
  {
    title: 'KCPD Holds Taxpayers Hostage While Shielding a Killer in Blue',
    link: 'https://kansascitydefender.com/justice/kcpd-holds-taxpayers-hostage-while-shielding-a-killer-in-blue/',
    published_at: '2026-02-05T12:00:00Z',
    author: 'Ryan S.',
    tags: ['justice', 'kcpd', 'police-accountability', 'investigation'],
    summary_raw: 'The department has received $1.2 billion since 2022. Now it claims it cannot afford basic services while an officer who has killed three people remains on patrol.',
    source: 'manual',
  },
  {
    title: 'A Brilliant Boy, a Garbage Dump, and the $415 Standing Between Him and Medical School',
    link: 'https://kansascitydefender.com/world/a-brilliant-boy-a-garbage-dump-and-the-415-standing-between-him-and-medical-school/',
    published_at: '2026-02-02T12:00:00Z',
    author: 'Jon Jeter',
    tags: ['world', 'plunder-papers', 'africa', 'colonialism'],
    summary_raw: 'First installment in The Plunder Papers, an ongoing investigative series examining why Africans continue to live in grinding poverty seven decades after the alleged close of the colonial era.',
    source: 'manual',
  },
  {
    title: 'Abolitionist Architecture: How Black Designers Are Building a Liberatory Future',
    link: 'https://kansascitydefender.com/arts-culture/abolitionist-architecture-how-black-designers-are-building-a-liberatory-future/',
    published_at: '2025-12-02T12:00:00Z',
    author: 'KC Defender Staff',
    tags: ['arts-culture', 'architecture', 'abolition', 'design'],
    summary_raw: 'How Black designers are reimagining built environments through an abolitionist lens.',
    source: 'manual',
  },
];

const SEED_IMPACTS = [
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'accountability',
    raw_description: 'Our investigation into KCPD budget revealed the department received $1.2 billion since 2022 while claiming it cannot afford basic services. An officer who has killed three people remains on active patrol. Story generated significant community response and was shared over 2,000 times.',
    internal_headline: 'We Exposed KCPD for Hoarding $1.2B While a Killer Cop Patrols Free',
    funder_headline: 'Defender Investigation Reveals $1.2B Police Budget Gap, Sparks Accountability Push',
    radical_metric_label: 'Shares',
    radical_metric_value: 2000,
    radical_metric_unit: 'shares',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 92,
    reported_at: '2026-02-05T18:00:00Z',
  },
  {
    reported_by_name: 'Khadijah Bland',
    program_area: 'development_fundraising',
    impact_type: 'funds_raised',
    raw_description: 'Platform Ventures/ICE victory generated a wave of new donations. 12 new sustaining donors signed up in the week following the victory announcement. Total new monthly recurring revenue: $840.',
    internal_headline: 'The People Won and Then They Gave: 12 New Sustainers After ICE Victory',
    funder_headline: '12 New Sustaining Donors Join After Community Organizing Victory',
    radical_metric_label: 'New Sustaining Donors',
    radical_metric_value: 12,
    radical_metric_unit: 'donors',
    kpis_impacted: ['membership_sustaining_donors_new_monthly', 'revenue_mix_quarterly_share_and_growth'],
    status: 'approved',
    confidence: 95,
    reported_at: '2026-02-14T10:00:00Z',
  },
  {
    reported_by_name: 'Melissa Ferrer-Civil',
    program_area: 'political_education',
    impact_type: 'event_turnout',
    raw_description: 'B-REAL Academy Cohort 3 applications opened February 10. Within 72 hours we received 34 applications for the 14-week abolitionist freedom school program. 80% of applicants are under 30.',
    internal_headline: '34 Future Organizers Applied to Freedom School in 72 Hours',
    funder_headline: 'Freedom School Cohort 3 Receives 34 Applications in First 72 Hours',
    radical_metric_label: 'Applications Received',
    radical_metric_value: 34,
    radical_metric_unit: 'applications',
    kpis_impacted: ['political_education_participants'],
    status: 'approved',
    confidence: 88,
    reported_at: '2026-02-13T14:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'policy_win',
    raw_description: 'After weeks of mass organizing, protest, and sustained Defender coverage, Platform Ventures announced it would back down from selling a property to ICE for use as a detention center. This is a direct community victory.',
    internal_headline: 'WE WON: Platform Ventures Folds on ICE Detention Center',
    funder_headline: 'Community Organizing Campaign Stops ICE Detention Center Sale',
    radical_metric_label: 'ICE Facilities Blocked',
    radical_metric_value: 1,
    radical_metric_unit: 'facility',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct'],
    status: 'approved',
    confidence: 98,
    reported_at: '2026-02-12T16:00:00Z',
  },
  {
    reported_by_name: 'Mili Mansaray',
    program_area: 'mutual_aid',
    impact_type: 'resource_delivery',
    raw_description: 'February Hamer Free Food Program distribution served 47 families with fresh produce from Black farmers. 6 team members participated in the distribution at Ms. Willa Bookstore.',
    internal_headline: '47 Black Families Fed by Black Farmers Through Our Hands',
    funder_headline: 'February Food Distribution Serves 47 Families with Local Black Farm Produce',
    radical_metric_label: 'Families Served',
    radical_metric_value: 47,
    radical_metric_unit: 'families',
    kpis_impacted: ['community_served_count', 'mutual_aid_participation_team_members'],
    status: 'approved',
    confidence: 94,
    reported_at: '2026-02-15T20:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'narrative_shift',
    raw_description: 'The Plunder Papers series by Jon Jeter launched with the first installment on February 2. Two-time Pulitzer finalist examining African poverty and colonial legacy. The piece was picked up by 3 international outlets and generated significant engagement across the diaspora.',
    internal_headline: 'Plunder Papers Launches: Global Black Press Takes Notice',
    funder_headline: 'New Investigative Series on Colonial Legacy Gains International Attention',
    radical_metric_label: 'Media Pickups',
    radical_metric_value: 3,
    radical_metric_unit: 'outlets',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 85,
    reported_at: '2026-02-02T14:00:00Z',
  },
  {
    reported_by_name: 'Silas Lee',
    program_area: 'editorial',
    impact_type: 'event_turnout',
    raw_description: 'Our coverage and call to action for the January 30 nationwide general strike against ICE reached over 15,000 people on social media. We were one of the first outlets to amplify the strike call following Minnesota successful action.',
    internal_headline: '15K Reached on Strike Day: The Defender Led the Call',
    funder_headline: 'Defender Coverage of National Strike Reaches 15,000+ on Social Media',
    radical_metric_label: 'People Reached',
    radical_metric_value: 15000,
    radical_metric_unit: 'people',
    kpis_impacted: ['audience_growth_total_reach', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 82,
    reported_at: '2026-01-30T22:00:00Z',
  },
  {
    reported_by_name: 'Tiffany Watts',
    program_area: 'arts_culture',
    impact_type: 'narrative_shift',
    raw_description: 'Feature story on The Outsiders Social Club in Westport generated significant engagement and drove foot traffic to the new Black-owned coworking space. Owner reported 8 new membership inquiries directly from Defender readers.',
    internal_headline: 'Black Coworking Space Gets 8 New Leads from Our Coverage',
    funder_headline: 'Arts & Culture Feature Drives New Business to Black-Owned Coworking Space',
    radical_metric_label: 'Business Leads Generated',
    radical_metric_value: 8,
    radical_metric_unit: 'leads',
    kpis_impacted: ['arts_culture_engagement_attendees_artists', 'audience_growth_total_reach'],
    status: 'approved',
    confidence: 78,
    reported_at: '2026-01-22T16:00:00Z',
  },
];

const SEED_METRICS = [
  { metric_key: 'audience_growth_total_reach', value: 42000, taken_at: '2026-01-06T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 48000, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 51000, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 67000, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 85000, taken_at: '2026-02-03T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 2, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'community_served_count', value: 38, taken_at: '2026-01-15T00:00:00Z' },
  { metric_key: 'community_served_count', value: 47, taken_at: '2026-02-15T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 22, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'membership_sustaining_donors_new_monthly', value: 8, taken_at: '2026-01-31T00:00:00Z' },
  { metric_key: 'membership_sustaining_donors_new_monthly', value: 12, taken_at: '2026-02-15T00:00:00Z' },
];

export async function GET() {
  const supabase = createServiceClient();

  // Check if already seeded
  const { count: impactCount } = await supabase
    .from('impact_events')
    .select('id', { count: 'exact', head: true });

  if ((impactCount ?? 0) > 0) {
    return NextResponse.json({
      message: 'Already seeded. Delete existing data to re-seed.',
      existing_impacts: impactCount,
    });
  }

  const results: Record<string, unknown> = {};

  // Insert stories
  const { data: stories, error: storiesErr } = await supabase
    .from('stories')
    .insert(SEED_STORIES)
    .select('id');
  results.stories = storiesErr ? { error: storiesErr.message } : stories?.length;

  // Insert impact events
  const { data: impacts, error: impactsErr } = await supabase
    .from('impact_events')
    .insert(
      SEED_IMPACTS.map((i) => ({
        ...i,
        source: 'admin',
        visibility: 'internal',
      }))
    )
    .select('id');
  results.impacts = impactsErr ? { error: impactsErr.message } : impacts?.length;

  // Insert metric snapshots
  const { data: metrics, error: metricsErr } = await supabase
    .from('metric_snapshots')
    .insert(SEED_METRICS)
    .select('id');
  results.metrics = metricsErr ? { error: metricsErr.message } : metrics?.length;

  // Upsert integration status
  const { error: integErr } = await supabase.from('integration_status').upsert(
    {
      name: 'rss_kansascitydefender',
      enabled: true,
      last_run_at: new Date().toISOString(),
      status: 'ok',
      message: 'Seeded by /api/seed',
    },
    { onConflict: 'name' }
  );
  results.integration = integErr ? { error: integErr.message } : 'ok';

  return NextResponse.json({
    message: 'Seed complete',
    results,
  });
}
