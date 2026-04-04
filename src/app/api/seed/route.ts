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
  {
    title: 'KCPD Officer Blayne Newton Quietly Exits With $50K After Defender Exposé',
    link: 'https://kansascitydefender.com/justice/blayne-newton-kcpd-resignation/',
    published_at: '2026-02-23T12:00:00Z',
    author: 'Ryan S.',
    tags: ['justice', 'kcpd', 'police-accountability', 'blayne-newton'],
    summary_raw: 'Less than 10 days after the Defender published its investigation, KCPD officer Blayne Newton resigned and accepted a $50,000 separation package. The people demanded accountability. The department blinked.',
    source: 'manual',
  },
  {
    title: 'B-REAL Academy Week 2: Build the School That Does Not Yet Exist',
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/defender-peoples-programs/b-real-academy-week-2/',
    published_at: '2026-03-09T12:00:00Z',
    author: 'KC Defender Staff',
    tags: ['political-education', 'b-real-academy', 'freedom-school', 'youth'],
    summary_raw: 'Cohort 3 students imagined the radical future of Black education in Week 2 of B-REAL Academy. High school students led the "Radical Imagination" session, envisioning and designing the schools they actually need.',
    source: 'manual',
  },
  {
    title: 'The Reynolds Journalism Institute Features the Kansas City Defender as a Model for Black Independent Media',
    link: 'https://rjionline.org/news/kansas-city-defender/',
    published_at: '2026-03-16T12:00:00Z',
    author: 'Reynolds Journalism Institute',
    tags: ['press', 'recognition', 'journalism', 'rji'],
    summary_raw: 'The Reynolds Journalism Institute at the University of Missouri featured the Kansas City Defender as a leading model for Black independent media in 2026.',
    source: 'manual',
  },
  {
    title: 'Pivot Fund Spotlights Kansas City Defender in National Roundup of Grantees Driving Change',
    link: 'https://pivotfund.org/grantees/kansas-city-defender/',
    published_at: '2026-04-01T12:00:00Z',
    author: 'Pivot Fund',
    tags: ['press', 'recognition', 'funding', 'pivot-fund'],
    summary_raw: 'The Pivot Fund featured the Kansas City Defender in its April 2026 national spotlight of grantees driving systemic change through radical local journalism and community power-building.',
    source: 'manual',
  },
];

const KPI_CONFIG_UPDATES = [
  {
    key: 'audience_growth_total_reach',
    title: 'Narrative Impact (FB + IG Views)',
    description: 'Total video and post views across Instagram and Facebook combined. Last verified: IG 2.2M + FB 235K = 2.43M (28-day window ending Feb 24, 2026). Update monthly from Instagram Insights + Facebook Page Insights.',
    rationale: 'Tracks narrative power and audience reach through actual platform view data.',
    freq: 'weekly',
    unit: 'views',
    sort_order: 1,
    notes: 'Pull from Instagram Insights + Facebook Page Insights monthly. Combine IG views + FB views for total.',
  },
  {
    key: 'community_served_count',
    title: 'Community Members Served',
    description: 'Total number of community members directly served through Defender mutual aid programs including distributions, events, and direct resource delivery.',
    rationale: 'Tracks Material Power: direct, tangible impact on community members through mutual aid.',
    freq: 'monthly',
    unit: 'people',
    sort_order: 5,
    notes: 'Count unique individuals/families served at each mutual aid event. Report monthly.',
  },
  {
    key: 'mutual_aid_participation_team_members',
    title: 'Mutual Aid Organizers Active',
    description: 'Number of Defender organizers who actively participated in mutual aid events and distributions.',
    rationale: 'Tracks internal organizing capacity and team engagement in Material Power programs.',
    freq: 'monthly',
    unit: 'organizers',
    sort_order: 6,
    notes: 'Count Defender organizers who showed up and led or supported each mutual aid event.',
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
  // --- March–April 2026 impacts ---
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'accountability',
    raw_description: 'Less than 10 days after the Defender published its KCPD investigation exposing officer Blayne Newton, Newton resigned from the department and accepted a $50,000 separation package. The Defender broke the story on February 5 and the accountability came swiftly.',
    ai_narrative: 'Less than ten days after the Defender published its investigation into KCPD officer Blayne Newton, Newton resigned from the department and accepted a $50,000 separation package. The Defender broke the story on February 5, exposing Newton\'s record while KCPD leadership shielded him. The swift outcome is a direct demonstration of what Black investigative journalism can do: name the harm, demand accountability, and change the conditions. The community kept the pressure on. The department blinked.',
    internal_headline: 'Blayne Newton Out. $50K Package. Defender Investigation Worked.',
    funder_headline: 'Defender Exposé Leads to KCPD Officer Resignation Within 10 Days of Publication',
    radical_metric_label: 'Days to Resignation',
    radical_metric_value: 10,
    radical_metric_unit: 'days',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct', 'stories_published_total_weekly'],
    status: 'approved',
    confidence: 97,
    reported_at: '2026-02-23T14:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'narrative_shift',
    raw_description: 'The Vera Institute of Justice cited the Kansas City Defender\'s ICE reporting in a national policy brief released March 3, 2026. The brief drew on our coverage of the Platform Ventures campaign and student suspensions to make the case for ICE-free zones and community protection policies at the national level.',
    ai_narrative: 'The Vera Institute of Justice, one of the nation\'s most respected criminal justice research organizations, cited the Kansas City Defender\'s ICE reporting in a national policy brief released March 3, 2026. The brief drew directly on the Defender\'s coverage of the Platform Ventures campaign and the 62 students suspended for protesting ICE in schools, using local Kansas City stories to argue for national ICE-free zone policies. When Defender journalism shapes national policy conversations, that is narrative power at its highest level.',
    internal_headline: 'Vera Institute Cites Our ICE Coverage in National Policy Brief',
    funder_headline: 'Defender ICE Reporting Cited by Vera Institute in National Policy Recommendations',
    radical_metric_label: 'National Policy Citations',
    radical_metric_value: 1,
    radical_metric_unit: 'citation',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct'],
    status: 'approved',
    confidence: 92,
    reported_at: '2026-03-03T18:00:00Z',
  },
  {
    reported_by_name: 'Melissa Ferrer-Civil',
    program_area: 'political_education',
    impact_type: 'event_turnout',
    raw_description: 'B-REAL Academy Week 2 session held March 9. Theme: Radical Imagination. Session focus: "Build the School That Doesn\'t Yet Exist." High school students led the session, envisioning radical alternatives to the current education system. Students presented their visions for liberatory Black education.',
    ai_narrative: 'B-REAL Academy\'s Cohort 3 gathered for Week 2 on March 9 for a session on Radical Imagination. Under the guiding question "Build the School That Doesn\'t Yet Exist," high school students took the lead, envisioning and designing liberatory alternatives to the education systems that have failed Black young people. Students presented bold, creative visions for what Black schooling could look like when it centers healing, community, and political consciousness. This is abolitionist education in practice.',
    internal_headline: 'B-REAL Week 2: High Schoolers Imagine the School That Sets Us Free',
    funder_headline: 'B-REAL Academy Cohort 3 Week 2: Student-Led Radical Imagination Session',
    radical_metric_label: 'Students Engaged',
    radical_metric_value: 40,
    radical_metric_unit: 'students',
    kpis_impacted: ['political_education_participants'],
    status: 'approved',
    confidence: 91,
    reported_at: '2026-03-09T20:00:00Z',
  },
  {
    reported_by_name: 'Ryan Sorrell',
    program_area: 'editorial',
    impact_type: 'narrative_shift',
    raw_description: 'Two major national outlets featured the Kansas City Defender in March and April 2026. The Reynolds Journalism Institute (RJI) at University of Missouri featured the Defender in March 16 as a model for Black independent media. The Pivot Fund spotlighted the Defender in their April 1 national grantee roundup highlighting organizations driving systemic change.',
    ai_narrative: 'In March and April 2026, the Kansas City Defender earned back-to-back national recognition. The Reynolds Journalism Institute at the University of Missouri featured the Defender as a leading model for Black independent media, and the Pivot Fund spotlighted the organization in its national roundup of grantees driving systemic change. These features reflect the Defender\'s growing national reputation as a template for what radical Black community journalism can look like. What we build in Kansas City is being studied and celebrated across the country.',
    internal_headline: 'RJI and Pivot Fund Both Feature the Defender. We Are the Model.',
    funder_headline: 'Defender Featured by Reynolds Journalism Institute and Pivot Fund in National Spotlights',
    radical_metric_label: 'National Features',
    radical_metric_value: 2,
    radical_metric_unit: 'features',
    kpis_impacted: ['audience_growth_total_reach', 'editorial_narrative_power_pct'],
    status: 'approved',
    confidence: 95,
    reported_at: '2026-04-01T16:00:00Z',
  },
  {
    reported_by_name: 'Brittany V.',
    program_area: 'mutual_aid',
    impact_type: 'resource_delivery',
    raw_description: 'Mutual Aid Clothing Sort Day held April 2, 2026. 10 comrades showed up to sort and organize clothing donations. Built a new 3-team organized system: Spring/Summer storage, Fall/Winter storage, and sorting/storage prep. Created "Grab and Go" bags organized by gender, size, and type. All prepped and ready for the upcoming April People\'s Mass Clothing Distribution event. Led by Brittany V., Carmon, and Kristoff McIntosh.',
    ai_narrative: 'On April 2, 2026, ten Defender comrades gathered for a Mutual Aid Clothing Sort Day, building the infrastructure for the upcoming People\'s Mass Clothing Distribution. The team created a new organized three-team system dividing responsibilities across Spring/Summer storage, Fall/Winter storage, and active sorting and prep. Comrades assembled "Grab and Go" bags organized by gender, size, and type, ready to move directly into community hands. Led by Brittany V., Carmon, and Kristoff McIntosh, this is the Defender doing the unglamorous, essential work that makes mutual aid actually function at scale.',
    internal_headline: '10 Comrades, 3-Team System, and a Mass Distribution Ready to Roll',
    funder_headline: 'Defender Mutual Aid Builds Organized Clothing Distribution System Ahead of April Mass Event',
    radical_metric_label: 'Comrades Who Showed Up',
    radical_metric_value: 10,
    radical_metric_unit: 'organizers',
    kpis_impacted: ['mutual_aid_participation_team_members', 'community_served_count'],
    status: 'approved',
    confidence: 93,
    reported_at: '2026-04-02T20:00:00Z',
  },
];

const SEED_METRICS = [
  // Narrative Impact (FB + IG combined views) — verified through Feb 24, 2026
  { metric_key: 'audience_growth_total_reach', value: 650000, taken_at: '2026-01-06T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 920000, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 1400000, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 1950000, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 2100000, taken_at: '2026-02-03T00:00:00Z' },
  { metric_key: 'audience_growth_total_reach', value: 2435000, taken_at: '2026-02-24T00:00:00Z' },
  // Stories published — weekly (Jan through early April)
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-01-13T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 2, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-01-27T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-02-03T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 5, taken_at: '2026-02-10T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-02-17T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-02-24T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-03-03T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-03-10T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 4, taken_at: '2026-03-17T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-03-24T00:00:00Z' },
  { metric_key: 'stories_published_total_weekly', value: 3, taken_at: '2026-03-31T00:00:00Z' },
  // Political education — B-REAL Cohort 3 weekly sessions
  { metric_key: 'political_education_participants', value: 22, taken_at: '2026-01-20T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 40, taken_at: '2026-02-13T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 40, taken_at: '2026-03-09T00:00:00Z' },
  { metric_key: 'political_education_participants', value: 40, taken_at: '2026-03-23T00:00:00Z' },
  // Material Power — mutual aid events
  { metric_key: 'community_served_count', value: 25, taken_at: '2026-02-21T00:00:00Z' },
  { metric_key: 'mutual_aid_participation_team_members', value: 15, taken_at: '2026-02-21T00:00:00Z' },
  { metric_key: 'mutual_aid_participation_team_members', value: 10, taken_at: '2026-04-02T00:00:00Z' },
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
