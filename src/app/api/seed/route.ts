import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
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
    ai_narrative: "The Kansas City Defender's investigation uncovered that KCPD has received $1.2 billion in taxpayer funding since 2022, yet continues to claim it cannot afford basic services. Meanwhile, an officer responsible for killing three people remains on active patrol. This story ignited community outrage and accountability conversations, generating over 2,000 shares across social platforms and putting direct pressure on city leadership to answer for the department's choices.",
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
    raw_description: 'B-REAL Academy Cohort 3 launched with 40 students enrolled out of 60 applicants. Half of enrolled students are high school students. The program kicked off this month, marking a major moment for the Defender abolitionist freedom school.',
    ai_narrative: 'B-REAL Academy, the Defender\'s Abolitionist Freedom School, launched Cohort 3 with an overwhelming community response. 60 people applied for 40 available seats, a testament to the hunger for radical political education in Kansas City. Half of enrolled students are high schoolers, meaning the Defender is building the next generation of abolitionist organizers. The program combines political education, direct action training, and community building rooted in Black radical tradition.',
    internal_headline: '40 Students In, 60 Applied. B-REAL Freedom School Cohort 3 Is Underway.',
    funder_headline: 'Freedom School Cohort 3 Enrolls 40 Students From 60 Applicants; 50% High Schoolers',
    radical_metric_label: 'Students Enrolled',
    radical_metric_value: 40,
    radical_metric_unit: 'students',
    kpis_impacted: ['political_education_participants'],
    status: 'approved',
    confidence: 90,
    reported_at: '2026-02-13T14:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'policy_win',
    raw_description: 'After weeks of Defender reporting and sustained community organizing, Platform Ventures backed down from selling a property to ICE for use as a detention center. The Defender helped lead the narrative that turned public opinion and shaped the conditions for this victory.',
    ai_narrative: 'After weeks of relentless Defender reporting and sustained community organizing, Platform Ventures withdrew from plans to sell a property to ICE for use as a detention center. The Defender helped lead the narrative and shaped the conditions that made this victory possible. This win is a direct demonstration of how radical Black media translates into material outcomes. The people organized, the Defender amplified, and the community won.',
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
    raw_description: "Jon Jeter's Plunder Papers series launched with the first installment on February 2. Two-time Pulitzer finalist examining African poverty and colonial legacy. The Defender published this ongoing investigative series examining why Africans continue to live in grinding poverty seven decades after the alleged close of the colonial era.",
    ai_narrative: 'Jon Jeter, a two-time Pulitzer Prize finalist, launched The Plunder Papers through the Defender. This ongoing investigative series examines why African nations continue to live under grinding poverty seven decades after the supposed close of the colonial era. The Defender committed to publishing this groundbreaking international work, expanding its investigative journalism beyond Kansas City to expose the global systems of exploitation that connect directly to conditions here at home. This is the Defender operating as a world-class Black press.',
    internal_headline: 'Plunder Papers Launches: The Defender Takes On Colonial Theft, Globally',
    funder_headline: 'Defender Publishes New Investigative Series on Colonial Legacy by Jon Jeter',
    radical_metric_label: 'Series Installments Published',
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
    raw_description: 'Our coverage and call to action for the January 30 nationwide general strike against ICE reached over 15,000 people on social media. We were one of the first outlets to amplify the strike call following successful Minnesota action.',
    ai_narrative: 'The Kansas City Defender was among the first media outlets to amplify the call for the January 30 nationwide general strike against ICE enforcement. Following successful actions in Minnesota, the Defender mobilized its audience and reached over 15,000 people on social media. The Defender served as a critical organizing hub, connecting local community members to the national movement at a key moment of escalation.',
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
    ai_narrative: 'When 62 high school students walked out to protest a bill that would allow ICE agents onto school grounds, every one of them was suspended. The Defender broke the story and led the national narrative, reaching 411,000 views and helping shape public consciousness around the ICE fight in Kansas City. The story sparked outrage, went viral, and became a rallying point for the broader movement against ICE expansion in schools. This is Defender journalism turning community pain into movement power.',
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
    raw_description: "Free children's clothing distribution event held on 2/21/26 at Vineyard Neighborhood Association. 25 families received free kids clothing. 15 Defender organizers led the effort on the ground.",
    ai_narrative: "On February 21, 2026, the Defender's Mutual Aid program hosted a free children's clothing distribution at Vineyard Neighborhood Association. 25 families received free kids clothing, with 15 Defender organizers coordinating and leading the effort on the ground. This is the Defender's commitment to material solidarity in action. Mutual aid is not charity. It is the community taking care of the community.",
    internal_headline: '25 Families Clothed, 15 Organizers Strong: Mutual Aid Delivers Again',
    funder_headline: 'Defender Mutual Aid Serves 25 Families at Free Children\'s Clothing Distribution',
    radical_metric_label: 'Families Served',
    radical_metric_value: 25,
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
    ai_narrative: 'The Defender hosted an intensive organizer training for student activists, drawing participants committed to abolitionist direct action. Students built practical skills across political education, community organizing strategy, and movement building rooted in Black radical tradition. This training is an investment in the next generation of Defender comrades and a demonstration of the organization\'s commitment to developing leadership from within the community it serves.',
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
  // Political education (B-REAL Cohort 3: 40 enrolled)
  { metric_key: 'political_education_participants', value: 22, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 40, taken_at: '2026-02-13T00:00:00Z' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get('reset') === 'true';

  const supabase = createServiceClient();

  const results: Record<string, unknown> = {};

  // Always upsert KPI config (runs even if already seeded — ensures title/unit updates reach live DB)
  const { error: kpiErr } = await supabase
    .from('kpi_config')
    .upsert(KPI_CONFIG_UPDATES, { onConflict: 'key' });
  results.kpi_config = kpiErr ? { error: kpiErr.message } : 'updated';

  // If reset=true, clear existing data first
  if (reset) {
    const [e1, e2, e3] = await Promise.all([
      supabase.from('impact_events').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('metric_snapshots').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('stories').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    ]);
    results.cleared = {
      impacts: e1.error ? e1.error.message : true,
      metrics: e2.error ? e2.error.message : true,
      stories: e3.error ? e3.error.message : true,
    };
  }

  // Check if already seeded (skip if reset was just done)
  const { count: impactCount } = await supabase
    .from('impact_events')
    .select('id', { count: 'exact', head: true });

  if (!reset && (impactCount ?? 0) > 0) {
    return NextResponse.json({
      message: 'Already seeded. Visit /api/seed?reset=true to clear and re-seed.',
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

  // Bust the briefing cache so the next page load regenerates with fresh data
  revalidateTag('defender-briefing');

  return NextResponse.json({
    message: 'Seed complete',
    results,
  });
}
