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
    title: '62 High School Students Protest Bill That Would Allow ICE Agents Into Schools. ALL 62 Get Suspended.',
    link: 'https://kansascitydefender.com/justice/62-students-suspended-ice-protest/',
    published_at: '2026-02-18T12:00:00Z',
    author: 'KC Defender Staff',
    tags: ['justice', 'ice', 'students', 'protest', 'schools'],
    summary_raw: '62 high school students were suspended after walking out to protest a bill that would allow ICE agents into schools. The Defender led the narrative on this story.',
    source: 'manual',
  },
];

const KPI_CONFIG_UPDATES = [
  {
    key: 'audience_growth_total_reach',
    title: 'Narrative Impact (FB + IG Views)',
    description: 'Total video and post views across Instagram and Facebook combined. IG: 2.2M + FB: 235K = 2.43M for last 28 days (Jan 30 - Feb 26, 2026).',
    rationale: 'Tracks narrative power and audience reach through actual platform view data.',
    freq: 'weekly',
    unit: 'views',
    sort_order: 1,
    notes: 'Pull from Instagram Insights + Facebook Page Insights monthly. Combine IG views + FB views for total.',
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
    reported_by_name: 'Melissa Ferrer-Civil',
    program_area: 'political_education',
    impact_type: 'event_turnout',
    raw_description: 'B-REAL Academy Cohort 3 received over 60 applicants total. 20 of the 40 student seats are filled by high school students. The program kicks off this weekend, marking a major moment for the Defender abolitionist freedom school.',
    internal_headline: '60+ Applied. 20 High Schoolers In. B-REAL Academy Kicks Off This Weekend.',
    funder_headline: 'Freedom School Cohort 3 Draws 60+ Applicants; 50% High School Students',
    radical_metric_label: 'Applicants',
    radical_metric_value: 60,
    radical_metric_unit: 'applicants',
    kpis_impacted: ['political_education_participants'],
    status: 'approved',
    confidence: 90,
    reported_at: '2026-02-13T14:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'policy_win',
    raw_description: 'After weeks of Defender reporting and sustained community organizing, Platform Ventures backed down from selling a property to ICE for use as a detention center. The Defender helped lead the narrative that turned public opinion and shaped the conditions for this victory. This is what narrative power looks like.',
    internal_headline: 'WE WON: The Defender Led the Narrative That Stopped the ICE Facility',
    funder_headline: 'Defender Narrative Leadership Helps Win Campaign Against ICE Detention Center',
    radical_metric_label: 'ICE Facilities Blocked',
    radical_metric_value: 1,
    radical_metric_unit: 'facility',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct'],
    status: 'approved',
    confidence: 98,
    reported_at: '2026-02-12T16:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'narrative_shift',
    raw_description: 'Jon Jeter\'s Plunder Papers series, written by the Defender, launched with the first installment on February 2. Two-time Pulitzer finalist examining African poverty and colonial legacy. The Defender wrote and published this ongoing investigative series examining why Africans continue to live in grinding poverty seven decades after the alleged close of the colonial era.',
    internal_headline: 'Plunder Papers Launches: The Defender Takes On Colonial Theft, Globally',
    funder_headline: 'Defender Publishes New Investigative Series on Colonial Legacy by Jon Jeter',
    radical_metric_label: 'Series Installments',
    radical_metric_value: 1,
    radical_metric_unit: 'installments',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 88,
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
    reported_by_name: 'KC Defender Staff',
    program_area: 'editorial',
    impact_type: 'narrative_shift',
    raw_description: '62 high school students were suspended after protesting a bill that would allow ICE agents into schools. The Defender broke and led the narrative on this story, which reached 411K views and helped shape public consciousness around the ICE fight in Kansas City.',
    internal_headline: '62 Students Suspended for Standing Up. We Told Their Story to 411K People.',
    funder_headline: 'Defender Coverage of Student ICE Protest Reaches 411K Views',
    radical_metric_label: 'Views',
    radical_metric_value: 411000,
    radical_metric_unit: 'views',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 96,
    reported_at: '2026-02-18T14:00:00Z',
  },
  {
    reported_by_name: 'KC Defender Staff',
    program_area: 'mutual_aid',
    impact_type: 'resource_delivery',
    raw_description: 'Free children\'s clothing distribution event held on 2/21/26 at Vineyard Neighborhood Association. Community members received free kids clothing through the Defender mutual aid program.',
    internal_headline: 'Free Kids Clothing in the Community: Mutual Aid Delivers Again',
    funder_headline: 'Defender Mutual Aid Program Hosts Free Children\'s Clothing Distribution',
    radical_metric_label: 'Families Served',
    radical_metric_value: null,
    radical_metric_unit: 'families',
    kpis_impacted: ['mutual_aid_participation_team_members', 'community_served_count'],
    status: 'approved',
    confidence: 90,
    reported_at: '2026-02-21T20:00:00Z',
  },
  {
    reported_by_name: 'KC Defender Staff',
    program_area: 'political_education',
    impact_type: 'event_turnout',
    raw_description: 'The Defender hosted an organizer training for students, building political education and direct action skills. Students participated in hands-on training around abolitionist organizing strategies.',
    internal_headline: 'Students Trained. The Next Generation of Organizers Is Ready.',
    funder_headline: 'Defender Delivers Organizer Training for Student Activists',
    radical_metric_label: 'Students Trained',
    radical_metric_value: null,
    radical_metric_unit: 'students',
    kpis_impacted: ['political_education_participants'],
    status: 'approved',
    confidence: 85,
    reported_at: '2026-02-10T18:00:00Z',
  },
];

const SEED_METRICS = [
  // Narrative Impact (FB + IG combined views) — actual data from screenshots
  { metric_key: 'audience_growth_total_reach', value: 650000, taken_at: '2026-01-06T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 920000, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 1400000, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 1950000, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 2100000, taken_at: '2026-02-03T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 2435000, taken_at: '2026-02-24T00:00:00Z' },
  // Stories published — weekly
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 2, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-02-03T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 5, taken_at: '2026-02-10T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-02-17T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-02-24T00:00:00Z' },
  // Political education
  { metric_key: 'political_education_participants', value: 22, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 60, taken_at: '2026-02-13T00:00:00Z' },
];

export async function GET() {
  const supabase = createServiceClient();

  const results: Record<string, unknown> = {};

  // Always upsert KPI config (runs even if already seeded — ensures title/unit updates reach live DB)
  const { error: kpiErr } = await supabase
    .from('kpi_config')
    .upsert(KPI_CONFIG_UPDATES, { onConflict: 'key' });
  results.kpi_config = kpiErr ? { error: kpiErr.message } : 'updated';

  // Check if already seeded
  const { count: impactCount } = await supabase
    .from('impact_events')
    .select('id', { count: 'exact', head: true });

  if ((impactCount ?? 0) > 0) {
    return NextResponse.json({
      message: 'Already seeded. Delete existing data to re-seed.',
      existing_impacts: impactCount,
      kpi_config: results.kpi_config,
    });
  }

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
