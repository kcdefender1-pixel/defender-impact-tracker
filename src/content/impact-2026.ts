// The public 2026 impact story. This is an edited publication, not a database view:
// every line here is copy a funder or community member will read, so change it with care.
//
// Photos: any `image` can be a full URL or a file you drop into /public/photos
// (reference it as '/photos/your-file.jpg').

export type Pillar = 'narrative' | 'organizing' | 'material' | 'cultural' | 'institutional';
export type MilestoneKind = 'win' | 'investigation' | 'program' | 'recognition' | 'movement';

export interface Milestone {
  slug: string;
  date: string; // YYYY-MM-DD
  pillar: Pillar;
  kind: MilestoneKind;
  title: string;
  summary: string;
  outcome?: string; // "What changed"
  metric?: { value: string; label: string };
  link?: string;
  image?: string;
  imageAlt?: string;
  imageTop?: boolean; // anchor the crop to the top (for social graphics with text below the photo)
  featured?: boolean; // gets the glowing star treatment
  imagePortrait?: boolean; // small headshots render narrow and tall so they stay sharp
}

export interface Win {
  slug: string;
  date: string;
  dateLabel?: string; // shown instead of the date, e.g. for year-long totals
  pillar: Pillar;
  label: string; // e.g. "Accountability", "Policy", "Material"
  title: string;
  metric: { value: string; label: string };
  body: string[]; // full story shown when the card is opened
  outcome: string;
  partners?: string[];
  link?: string;
  image?: string;
  imageAlt?: string;
  imageTop?: boolean;
}

const CDN = 'https://d2yj79r0roqbdr.cloudfront.net/wp-content/uploads';

export const PILLARS: Record<Pillar, { label: string; short: string }> = {
  narrative: { label: 'Narrative Power', short: 'Narrative Power' },
  organizing: { label: 'Organizing Power', short: 'Organizing Power' },
  material: { label: 'Material Power', short: 'Material Power' },
  cultural: { label: 'Cultural Power', short: 'Cultural Power' },
  institutional: { label: 'Institutional Power', short: 'Institutional Power' },
};

export const KIND_LABEL: Record<MilestoneKind, string> = {
  win: 'Win',
  investigation: 'Investigation',
  program: 'Program',
  recognition: 'Recognition',
  movement: 'Movement',
};

// ─── The headline numbers ───────────────────────────────────────────────────

export const HEADLINE_STATS = [
  { value: '10M+', label: 'Views & impressions in 2026' },
  { value: '50+', label: 'Active members' },
  { value: '3,000+', label: 'Clothing & hygiene items given' },
  { value: '250+', label: 'Black families fed through Hamer' },
  { value: '4th', label: 'Freedom School cohort' },
];

// ─── The narrative ──────────────────────────────────────────────────────────

export const THESIS = {
  kicker: 'The Kansas City Defender · 2026 Impact',
  headline: 'Media that builds power.',
  dek: 'The Kansas City Defender is building a new model for Black media, fusing radical journalism, organizing, and mutual aid into one Black-led institution. We reach the young Black people the rest of the media lost, and we turn that reach into organized power, where readers become members, members become organizers, and organizers become the protagonists of the next story.',
};

export const NARRATIVE: string[] = [
  'Into the silence left by a collapsing local press pours a flood of misinformation and disinformation, aimed squarely at young Black people, a generation legacy media stopped speaking to long ago. Most of them have tuned out. They have not tuned out of us.',
  'The Defender stands in the lineage of the Black press, a tradition that turns 200 years old in 2027. From Freedom’s Journal in 1827 to the papers that carried the abolitionist, civil rights, and Black Power movements, every movement for our freedom has been catalyzed by a media arm willing to tell the truth. In an era of media consolidation, AI-generated synthetic content, authoritarian censorship, and outlets too fearful to tell the truth, we are telling it.',
  'We reach the people the rest of the press cannot. This year our work has drawn more than 10 million views and impressions across our platforms, averaging more than a million a month, and the vast majority of our audience is Black and young. They find us on their phones and on our YouTube show, and then they do what most media audiences never do. They show up, through a story, the People’s Free Store, a Hamer food box, our Freedom School, or a Juneteenth cookout, and 50+ active members now carry that work across the organization. The year that followed is on the record below.',
  'That is why the Defender matters to so many people at once. To young people, it is the first media that ever treated them as protagonists. To Black families, it is food and clothing given with dignity. To organizers and progressives, it is the media arm of a movement that is winning, and to voters it is The People’s Ballot. To Black businesses and entrepreneurs, it is a platform and a source of capital know-how. To the next generation of leaders, it is a school. And to journalism, at the very moment its old institutions are failing, it is proof of what comes next.',
];

export const PULL_QUOTE =
  'A Black abolitionist outlet in the middle of the country is doing some of the most important journalism in it.';

export const WHY_NOW = [
  {
    stat: '100+ years',
    text: 'The Kansas City Call, the city’s historic Black newspaper, missed print for the first time in its history this year.',
  },
  {
    stat: 'Mass layoffs',
    text: 'The Kansas City Star cut its newsroom again, leaving fewer reporters covering a growing metro.',
  },
  {
    stat: 'Tuned out',
    text: 'Young Black people are turning away from legacy media just as disinformation targets them hardest.',
  },
];

export const DOORS: {
  name: string;
  pillar: Pillar;
  what: string;
  proof: string;
  stats?: { value: string; label: string }[];
  link?: string;
  image?: string;
}[] = [
  {
    name: 'The Journalism',
    pillar: 'narrative',
    what: 'Investigations, Liberation Now, our flagship YouTube show, The People’s Ballot voter guide, and an international desk led by two-time Pulitzer finalist Jon Jeter.',
    proof: '10M+ views and impressions in 2026. Our reporting moved police, prosecutors, corporations, and federal agencies this year.',
    link: 'https://kansascitydefender.com/',
    image: `${CDN}/2026/03/31093825/9-DSCF2511-scaled.jpg`,
  },
  {
    name: 'The People’s Free Store',
    pillar: 'material',
    what: 'Our Free Clothing Program, run by an all-Black mutual aid team and set up like a department store owned by the people. No applications, no questions.',
    proof: '3,000+ clothing and hygiene items given to Black families in 2026, by a mutual aid team now about 30 members strong.',
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/peoples-free-store-kc-defender-clothing-hygiene-distribution/',
    image: `${CDN}/2026/04/27141634/158A3299.jpg`,
  },
  {
    name: 'The Hamer Free Food Program',
    pillar: 'material',
    what: 'Named for Fannie Lou Hamer and launched with Kansas City’s Black farms after Sun Fresh closed, it buys produce at market rate and delivers it free to Black families. Every bag carries literature we created featuring every Black farm, what they grow, when, and how to get food from them, building long-term networks and food sovereignty.',
    proof: 'The first network to unite the Black farms of Kansas City, and winner of LION Publishers’ 2026 Community Engagement Award.',
    stats: [
      { value: '250+', label: 'Black families fed within a mile of 31st & Prospect' },
      { value: '$7K', label: 'circulated into Black farms' },
      { value: '60', label: 'Community Food Leaders, mostly under 30' },
    ],
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/kcs-black-farms-unite-hamer-free-food-program/',
    image: '/photos/hamer-packing.jpg',
  },
  {
    name: 'The People’s Buyout',
    pillar: 'material',
    what: 'Every Black Feast Week, the Defender buys out a Black-owned restaurant and feeds Black single mothers and their families for free.',
    proof: '100 mothers and their families fed in October 2026.',
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/defender-peoples-programs/peoples-buyout-2026-black-feast-week/',
    image: `${CDN}/2026/10/01134303/KC-Black-Feast-Week-03-Mothers-Event6.jpg`,
  },
  {
    name: 'B-REAL Academy',
    pillar: 'organizing',
    what: 'Our Black abolitionist freedom school. Political education, leadership development, and radical imagination, led by Kansas City’s first Poet Laureate.',
    proof: 'Now in its fourth cohort. Students have ranged from age 10 to 81.',
    link: 'https://kansascitydefender.com/education/kansas-citys-black-abolitionist-freedom-school-is-working-and-it-just-graduated-a-new-class-of-organizers/',
    image: '/photos/breal-circle.jpg',
  },
  {
    name: 'The Book Club',
    pillar: 'organizing',
    what: 'A standing community of readers working through the Black radical tradition together, at home in Ms. Willa’s Books, Missouri’s oldest Black bookstore.',
    proof: 'Political education that keeps going between cohorts.',
    image: '/photos/book-club.jpg',
  },
  {
    name: 'The Culture',
    pillar: 'cultural',
    what: 'Kansas City’s biggest Juneteenth Cookout, built with Decarcerate KC, plus RADAR, our new culture magazine documenting the city’s artists and creators.',
    proof: '500+ neighbors at Harris Park this year, more than 1,000 across the last two, with dozens of Black vendors.',
    link: 'https://kansascitydefender.com/black-life-joy/juneteenth-cookout-kansas-city-or-we-did-juneteenth-kansas-city/',
    image: '/photos/juneteenth-basketball.jpg',
  },
  {
    name: 'Ms. Willa’s Books',
    pillar: 'institutional',
    what: 'Missouri’s oldest Black bookstore, saved from auction by the Defender and now our headquarters, home to our pantry, free store, book club, and freedom school classroom.',
    proof: 'A permanent Black institution and 10,000 volumes, kept in Black hands.',
    link: '#willas',
    image: `${CDN}/2026/07/22122112/KCD-Willas-3.jpg`,
  },
];

export const PARTNERS = [
  'KC Tenants',
  'Decarcerate KC',
  'Community Movement Builders',
  'Urban League of Greater Kansas City',
  'National Black United Front–KC',
  'Advocates for Immigrant Rights & Reconciliation',
  'KC Black Urban Growers',
  'Ivanhoe Neighborhood Association',
];

export const SPOTLIGHT = {
  kicker: 'Columbia Journalism School · April 2026',
  title: 'Selected by the Lipman Center for Journalism and Civil and Human Rights',
  text: 'One of five 2026 Arnold Grant recipients nationwide for reporting on race and the U.S. criminal justice system, alongside Pulitzer Prize winner Mississippi Today and CalMatters.',
  quote: 'journalism’s power to serve the public and provide a check on power',
  quoteBy: 'Prof. Kat Chow, grant selection committee, on the 2026 projects',
  href: 'https://journalism.columbia.edu/news/2026-lipman-center-arnold-grants',
};

export const RECOGNITION = [
  { who: 'Institute for Nonprofit News', what: 'Khadijah Bland, our Director of Development & Revenue, named National Emerging Leader of the Year', date: 'July 2026' },
  { who: 'Reynolds Journalism Institute', what: 'Featured the Defender as a model for Black independent media', date: 'March 2026' },
  { who: 'Vera Institute of Justice', what: 'Cited our ICE reporting in a national policy brief', date: 'March 2026' },
  { who: 'Pivot Fund', what: 'Spotlighted the Defender in its national roundup of grantees', date: 'April 2026' },
  { who: 'LION Publishers', what: '2026 Community Engagement Award, for the Hamer Free Food Program', date: 'September 2026' },
  { who: 'Lab for Journalism Funding', what: 'Selected for the Local Media Association’s 2026 national cohort', date: 'August 2026' },
  { who: 'CUNY Newmark Graduate School of Journalism', what: 'Spotlighted our dual-power model in Spotlight on Community Media', date: 'September 2026' },
  { who: 'One Million Experiments', what: 'Highlighted B-REAL Academy among abolitionist institutions', date: 'October 2026' },
  { who: 'Ta-Nehisi Coates, Vanity Fair', what: 'Cited our reporting on racism in Mizzou’s Turning Point chapter in “Charlie Kirk, Redeemed”', date: 'September 2025' },
  { who: 'Rime Buddhist Center & Interfaith Council of KC', what: 'Bodhisattva Award for compassion, service, and justice', date: '2025' },
  { who: 'National Black United Front', what: 'Charles Miller Black Liberation Award', date: '2025' },
];

// ─── Willa's Books x Defender Liberation Hub ────────────────────────────────

export const WILLAS = {
  kicker: 'Willa’s Books x Defender Liberation Hub',
  headline: 'We saved Missouri’s oldest Black bookstore. Now it is our home.',
  dek: 'The house in “one house, many doors” is real. It is Ms. Willa’s.',
  shelf: ['Frederick Douglass', 'W.E.B. Du Bois', 'Paul Laurence Dunbar', 'Langston Hughes'],
  shelfNote: 'Inside: 10,000 volumes, including some of the earliest books written by Black people in the United States after slavery.',
  steps: [
    { title: 'A week from auction', text: 'Ms. Willa’s entire collection, 10,000 volumes of Black history and literature, was a week away from being auctioned off.' },
    { title: 'We saved the store', text: 'The Defender raised the money to cover a full year of her rent, then helped Ms. Willa retire with dignity.' },
    { title: 'Every book, by hand', text: 'Defender organizers cataloged the entire 10,000-volume collection.' },
    { title: 'Our home', text: '2026 is our first full year running it as our headquarters, home to the pantry, the mutual aid room, the book club, and the freedom school classroom.' },
    { title: 'Next: a Liberation Hub', text: 'In 2027, Willa’s becomes a year-round Liberation Hub, open to the community every day.' },
  ],
  image: '/photos/ms-willa.jpg',
  imageAlt: 'Ms. Willa in her bookstore',
};

// ─── B-REAL for young Black men ────────────────────────────────────────────

export const BROTHERS = {
  kicker: 'B-REAL Academy · Launching at the end of 2026',
  headline: 'Our brothers are not a problem to be managed.',
  teaser: 'A new B-REAL Academy cohort built exclusively for justice-impacted Black men between 16 and 24.',
  image: '/photos/young-black-men-1.jpg',
  imageAlt: 'Young Black men talking between games at the Juneteenth basketball tournament',
  storyImage: '/photos/young-black-men-2.jpg',
  storyImageAlt: 'Young Black men gathered at the Juneteenth basketball tournament',
  paragraphs: [
    'Kansas City spends more on its police department than on every public school in the city combined, and the young Black men that money is aimed at know it. By sixteen many of them have been stopped, cuffed, searched, and jailed. By twenty-four many have done time, been shot at, or buried a friend, and the only institutions that reliably show up for them are the ones built to cage them. The local news finishes the job. It learns their names from a booking photo and never prints them again.',
    'The Defender exists partly to end that, and we start by refusing the lie that these young men are a problem to be managed. They are our brothers, our cousins, our former classmates, and some of them are us.',
    'Beginning at the end of 2026, a new cohort of B-REAL Academy will work exclusively with Black men between 16 and 24 who have been locked up, surveilled, and written off, most of them with no one in their corner. Political education, radical imagination, and real mental health care, in one room, from Black people who have walked the same blocks and in some cases sat in the same cells.',
    'The same institution that investigates KCPD’s budget and the World Cup Jail is the one that opens the door. We cover these young men as protagonists and we give them a place to become the authors of their own freedom, and that is the narrative shift no reporting alone can accomplish.',
  ],
  leaders: [
    { name: 'Curtis Wright', role: 'Strategic Partnerships Lead', note: 'Spent years in violence intervention before he came to the Defender.' },
    { name: 'Melissa Ferrer-Civil', role: 'Director, B-REAL Academy', note: 'Kansas City’s first Poet Laureate.' },
    { name: 'Jeff Dayton', role: 'Therapist', note: 'His entire practice is young Black men the system has already touched.' },
  ],
  closer: 'A young man the city knows as a case number walks out of Ms. Willa’s as an organizer.',
};

// ─── Why give: every dollar, every pillar ──────────────────────────────────

export const GIVE = {
  kicker: 'For funders and supporters',
  headline: 'Every dollar. Every pillar.',
  center: 'Every dollar',
  dek: 'Most funding buys one outcome. Fund a newsroom and you get stories. Fund a food program and you get meals. Support the Defender and the same dollar does all of it at once, because our journalism, mutual aid, organizing, and culture run as one system.',
  exampleLabel: 'One program, five outcomes',
  example: 'The Hamer Program',
  exampleNote: 'Launched with Kansas City’s Black farms after the last grocery store near 31st & Prospect closed.',
  outcomes: [
    { pillar: 'narrative' as const, value: '1st', label: 'unified network of Kansas City’s Black farmers, told through our reporting and farm guide' },
    { pillar: 'material' as const, value: '250+', label: 'Black families fed within a mile of 31st & Prospect' },
    { pillar: 'organizing' as const, value: '60', label: 'Community Food Leaders trained, mostly Black residents under 30' },
    { pillar: 'cultural' as const, tag: 'Black Economic Power', value: '$7K', label: 'circulated directly into Black-owned farms' },
    { pillar: 'institutional' as const, value: 'LION', label: 'LION’s 2026 Community Engagement Award, plus a new contracted revenue stream' },
  ],
  compare: [
    {
      title: 'Siloed funding',
      points: [
        'A newsroom reports on the food desert',
        'A food program hands out boxes',
        'An organizing group recruits leaders',
        'Three grants, three budgets, three audiences',
      ],
    },
    {
      title: 'The Defender',
      points: [
        'Our story names the crisis and points to action',
        'Readers become the organizers who deliver the food',
        'The program becomes the next story and the next member',
        'One system, with impact that compounds',
      ],
    },
  ],
  closer: 'Every dollar given to the Defender is amplified by more than 10 million views and impressions a year and a membership that turns attention into action.',
};

// ─── In their words ─────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    quote: 'This is the best day ever, this is better than Christmas!',
    who: 'A young Black kid arriving at the Juneteenth Cookout',
  },
  {
    quote: 'I just wanna say before y’all start, that I am grateful. Thank you for setting this up.',
    who: 'A neighbor waiting in line at the People’s Free Store, 31st & Prospect',
  },
  {
    quote: 'It feels like a department store.',
    who: 'A community member at the People’s Free Store',
  },
  {
    quote: 'We are so deeply grateful for y’all.',
    who: 'A Black elder receiving a Hamer Program delivery',
  },
];

// ─── The team ───────────────────────────────────────────────────────────────

export const TEAM: { name: string; role: string; note?: string; photo?: string }[] = [
  { name: 'Ryan Sorrell', photo: '/photos/team/ryan.jpg', role: 'Founder & Executive Editor', note: 'Founded the Defender in 2021 out of the uprisings with a single rented camera and built it into a home for Black power. Leads the investigations that moved the state this year, from Kansas City’s nuclear weapons plant to the first underground reactor in history.' },
  { name: 'Khadijah Bland', photo: '/photos/team/khadijah.jpg', role: 'Director of Development & Revenue', note: 'Turned a scrappy, movement-born outlet into an institution with real operations and a future. INN’s 2026 National Emerging Leader of the Year, she grew active subscriptions 40%+ in her first year and launched our first capital campaign.' },
  { name: 'Mili Mansaray', photo: '/photos/team/mili.jpg', role: 'Senior Editor & Director of Radical Media Initiatives', note: 'Co-leads our editorial strategy and edits the journalism that holds power to account. She co-leads our award-winning investigations into missing Black women and reports on housing.' },
  { name: 'Vaughan Harrison', photo: '/photos/team/vaughan.jpg', role: 'Senior Investigative Reporter & Resident Photographer', note: 'Co-leads our award-winning investigations into missing Black women, refusing to let this city forget their names, and documents the movement from behind the lens.' },
  { name: 'Melissa Ferrer-Civil', photo: '/photos/team/melissa.jpg', role: 'Director, B-REAL Academy', note: 'Kansas City’s first Poet Laureate. She built B-REAL Academy from the ground up into a nationally award-winning freedom school, and has shared its model on panels with international abolitionist leaders. She leads our political education and trainings and facilitates our biggest gatherings.' },
  { name: 'Jon Jeter', photo: '/photos/team/jon.jpg', role: 'First International Correspondent', note: 'Two-time Pulitzer Prize finalist and former Washington Post bureau chief. From Nairobi, he exposes the plunder of Africa through The Plunder Papers and connects Kansas City to the global Black struggle.' },
  { name: 'Joshua Taylor', photo: '/photos/team/joshua.jpg', role: 'Senior Culture Lead', note: 'Our earliest member. A music A&R, producer, content strategist, social advocate, and entrepreneur all in one person, with his ear closer to Kansas City’s culture than anyone. He touches nearly every part of the Defender.' },
  { name: 'Tiffany Watts', photo: '/photos/team/tiffany.jpg', role: 'Reporter on Black Economic Justice & Social Media Lead', note: 'Leads our Black business coverage and runs the Defender’s social media, with deep relationships across Kansas City’s Black entrepreneurs. She helps turn coverage into events that move dollars into Black businesses.' },
  { name: 'Jylon Hollinshed', photo: '/photos/team/jylon.jpg', role: 'Arts & Culture Lead', note: 'Joined the Defender while still in high school and built our Arts & Culture department from scratch. They now lead it, from the Book Club and Juneteenth organizing to RADAR.' },
  { name: 'Curtis Wright', photo: '/photos/team/curtis.jpg', role: 'Strategic Partnerships Lead', note: 'Deeply rooted with Kansas City’s faith leaders and organizers, with years in violence intervention. He leads our partnership work and co-leads our new B-REAL cohort for justice-impacted young Black men.' },
  { name: 'Nina Kerrs', photo: '/photos/team/nina.jpg', role: 'Site Manager & Willa’s Campaign Lead', note: 'Joined the Defender at 19. She led the campaign that saved Ms. Willa’s, runs our home there, and co-leads the strategy and organizing of our mutual aid team and its new leaders.' },
  { name: 'Carmon Smith', role: 'Mutual Aid Co-Lead', note: 'Co-leads the strategy and organizing of our 30-member mutual aid team and its new leaders. She led the kids’ clothing drive and wash day and helped design the system that made our Free Store run grab-and-go.' },
  { name: 'Brittany Vesey', role: 'Mutual Aid Co-Lead', note: 'Co-leads the strategy and organizing of our 30-member mutual aid team and its new leaders. She led the Hamer distribution to seniors at Palestine Commons and helped design the system that made our Free Store run grab-and-go.' },
];

export const TEAM_THANKS =
  'And to our 50+ members, the 30-strong mutual aid team and its 10 new leaders, and the 100+ community members who sort the clothes, pack the boxes, run the trainings, and tell the stories: this is your work.';

// ─── With gratitude ─────────────────────────────────────────────────────────

export const FUNDERS = [
  'Pivot Fund',
  'Ewing Marion Kauffman Foundation',
  'Health Forward Foundation',
  'Press Forward',
  'Racial Equity in Journalism Fund',
  'KC People’s Fund',
  'Shumaker Family Foundation',
];

export const FUNDERS_THANKS =
  'And to every Defender who gives monthly or one time. Small-dollar support from our community is the foundation everything else stands on.';

// ─── What's next ────────────────────────────────────────────────────────────

export const NEXT = {
  headline: 'Where we go in 2027',
  lead: 'Journalism first.',
  dek: '2027 marks 200 years of the Black press. We will honor it by growing from Kansas City’s essential Black newsroom into the Black newsroom of the Midwest, with reporting that starts on Prospect Avenue and reaches the world.',
  reach: [
    { scope: 'Kansas City', title: 'Own the city’s front page', text: 'Daily short-form video news on the platforms young Kansas City actually uses, growing our reach well beyond the 10M+ views and impressions of 2026.' },
    { scope: 'Missouri & the region', title: 'Build a statewide desk', text: 'Follow the power to Jefferson City and across Missouri and Kansas: the statehouse, the ballot fights, the prisons, and the small towns industry targets because it thinks no one is watching.' },
    { scope: 'National', title: 'Set the national agenda', text: 'Own the beats nobody else will, from AI surveillance and nuclear weapons to ICE and police accountability, and partner with national outlets to carry our investigations across the country.' },
    { scope: 'International', title: 'Take it global', text: 'Grow our international desk across the African diaspora and take Liberation Now international, connecting Kansas City’s fights to the global struggle for Black liberation.' },
  ],
  mediums: ['Investigations', 'Liberation Now on YouTube', 'Daily short-form video', 'The newsletter', 'Live town halls & events'],
  policy: {
    title: 'Turn reporting into policy',
    text: 'Our journalism already changes policy. Our investigation into missing Black women led to the reinstatement of Kansas City’s previously disbanded missing persons task force, and then to a statewide missing persons task force. In 2027 we push every major investigation toward the same result: a policy that changes, a practice that ends, an official who answers.',
  },
  powerHeadline: 'And the power we build around it',
  goals: [
    { title: 'A youth organizing & leadership pipeline', text: 'Train young people as organizers, leaders, and change makers in their communities and the world, including our new B-REAL cohort for young Black men, so every young person who finds us has a path to lead.' },
    { title: 'Willa’s as a year-round Liberation Hub', text: 'The free store, pantry, book club, and freedom school under one roof, open to the community all year.' },
    { title: 'Scale our mutual aid programs', text: 'More families clothed and fed, more Black farms paid, and more Mutual Aid Leaders organizing alongside them.' },
    { title: 'Grow Black economic power', text: 'Since 2021 we have partnered with 50+ Black-owned businesses and organizations, covering them and putting them in front of our audience. In 2027 we build that into a Black economy network with a public directory, year-round coverage, Black Feast Week, direct lines to capital through partners like KC G.I.F.T., and an advertising co-op that pools buying power so Black businesses can reach our audience at rates they can afford, so more Black dollars circulate in Black Kansas City.' },
  ],
  ways: [
    { label: 'Donate', text: 'Become a monthly Defender or give once.', href: 'https://kansascitydefender.com/support-us/' },
    { label: 'Join & organize', text: 'Become a member. Sort, pack, deliver, teach, organize.', href: 'https://kansascitydefender.com/join/' },
    { label: 'Become a funder or partner', text: 'Fund the model. Let’s talk.', href: 'https://kansascitydefender.com/contact-us/' },
  ],
};

// ─── Impact areas: how the work maps to the outcomes partners care about ───

export const IMPACT_AREAS_INTRO =
  'We measure our impact through five pillars of power: Narrative, Organizing, Material, Cultural, and Institutional.';

export const IMPACT_AREAS: {
  id: string;
  name: string;
  pillar: Pillar;
  speaksTo: string[]; // the outcome language partners and funders use
  claim: string;
  proof: string[];
}[] = [
  {
    id: 'narrative',
    name: 'Narrative Power',
    pillar: 'narrative',
    speaksTo: ['Narrative change'],
    claim: 'We change what Kansas City believes is true, and who gets to say it.',
    proof: [
      '10M+ views and impressions across our platforms in 2026, averaging more than a million a month, from an audience that is mostly Black and young.',
      'Our missing Black women investigation led to the reinstatement of Kansas City’s disbanded missing persons task force, and to a new statewide missing persons task force.',
      'Our walkout coverage alone drew more than 1.2 million views on Instagram, and the movement our reporting carried crossed state lines.',
      'Liberation Now, our YouTube show, brings candidates, scholars, and ministers to a generation that tuned out of legacy media.',
      'Investigations into nuclear weapons, data center tax schemes, police killings, and the World Cup Jail reframed what the city debates.',
      'Ta-Nehisi Coates cited our reporting in Vanity Fair, and the Vera Institute, Reynolds Journalism Institute, CUNY, and Pivot Fund all pointed to our work as a national model.',
    ],
  },
  {
    id: 'organizing',
    name: 'Organizing Power',
    pillar: 'organizing',
    speaksTo: ['Civic engagement', 'Organizing & power building'],
    claim: 'We build organizers, and we help Kansas City’s movements grow.',
    proof: [
      'We are part of the city’s organizing infrastructure. As the people’s press on the ground, we are who KC Tenants, Decarcerate KC, the Community Defense Team, Advocates for Immigrants Rights and Reconciliation (AIRR), and others call first, trust, and turn to when the record needs setting straight. We deploy our platform to cover their fights, and every story carries a call to action to join them.',
      'More than 100 people signed up for Community Defense Trainings and the Rapid Response Network through one of our dispatches.',
      'The media arm for the 23-organization coalition fighting Kansas City’s World Cup Jail.',
      'Students from more than 10 school districts trained in organizing, civic engagement, and know your rights, plus the Student Action Network we pulled together across 10+ schools.',
      'B-REAL Academy, our abolitionist freedom school, is in its fourth cohort.',
      '10 new Mutual Aid Leaders emerged this year to strategize and organize, from a 30-member mutual aid team that organizes 100+ community members into our programs.',
      '50+ active members carrying the work across the organization, and a packed federal hearing on nuclear weapons.',
      'The People’s Ballot, Missouri’s most comprehensive plain-language election guide, online and in print, for the August primary and November general.',
    ],
  },
  {
    id: 'material',
    name: 'Material Power',
    pillar: 'material',
    speaksTo: ['Mutual aid', 'Food access', 'Black economic power'],
    claim: 'We meet our people’s needs, with dignity and without paperwork.',
    proof: [
      '3,000+ clothing and hygiene items given to Black families this year through the People’s Free Store.',
      'The People’s Buyout fed 100 Black single mothers and their families, spending at a Black-owned restaurant to do it.',
      'The Hamer Program has delivered free produce to 250+ Black families within a mile of 31st & Prospect, with literature that maps every Black farm and how to get food from them.',
      '400 pounds of kids’ clothing washed by hand for a single distribution.',
      'A permanent mutual aid room and pantry at Ms. Willa’s Books.',
    ],
  },
  {
    id: 'cultural',
    name: 'Cultural Power',
    pillar: 'cultural',
    speaksTo: ['Arts & culture', 'Black entrepreneurship'],
    claim: 'We build the culture, and the Black economy, that liberation needs.',
    proof: [
      'Black Feast Week, in its third year, drives customers to Black-owned restaurants across Kansas City.',
      'Since 2021, 50+ Black-owned businesses and organizations partnered with, covered, and put in front of our audience.',
      'Black Economic Power, our column with KC G.I.F.T., opened with CEO Brandon Calloway on how Black entrepreneurs win funding.',
      'Dozens of Black vendors and 500+ neighbors at the Juneteenth Cookout, where RADAR honored its first class of Kansas City creators.',
      'Liberation Now’s Black Theology & Black Power series, with Dr. J. Kameron Carter and Minister Andrew Hairston.',
      'A Black Panther film screening that sold out in 48 hours.',
    ],
  },
  {
    id: 'institutional',
    name: 'Institutional Power',
    pillar: 'institutional',
    speaksTo: ['Sustainability', 'Organizational capacity'],
    claim: 'We are building an institution that lasts.',
    proof: [
      'Active subscriptions grew 40%+ in 2025, our Development Director’s first year, alongside new revenue from events and Black business partnerships and our first capital campaign.',
      'Khadijah Bland, our Director of Development & Revenue, named INN’s National Emerging Leader of the Year.',
      'An international desk led by two-time Pulitzer finalist Jon Jeter.',
      'Ms. Willa’s Books, Missouri’s oldest Black bookstore, saved from auction. Our organizers cataloged all 10,000 volumes, and 2026 is our first full year running it as our headquarters.',
      'LION Publishers’ 2026 Community Engagement Award, five years of operation, and a seat in the 2026 national Lab for Journalism Funding cohort.',
    ],
  },
];

// ─── The year, in order ─────────────────────────────────────────────────────

export const MILESTONES: Milestone[] = [
  {
    slug: 'kc-detention-ban',
    date: '2026-01-15',
    pillar: 'narrative',
    kind: 'win',
    title: 'Kansas City passes a five-year ban on mass detention facilities',
    summary: 'As Homeland Security eyed Kansas City for a 7,500-bed ICE detention center, we led the on-the-ground coverage in the weeks before the vote, reporting on Advocates for Immigrants Rights and Reconciliation (AIRR), Decarcerate KC, and the other organizations fighting it. Then the City Council passed a five-year moratorium on non-municipal detention facilities.',
    outcome: 'No permits for new non-municipal detention facilities in Kansas City through 2031. The ban was a real win, but it did not stop ICE from trying to turn the Platform Ventures warehouse into a detention center weeks later.',
    metric: { value: '489K+', label: 'views on Instagram alone' },
    link: 'https://kansascitydefender.com/national/immigration/kc-bans-mass-detention-facilities/',
    image: '/photos/kc-detention-ban.jpg',
    imageAlt: 'Defender post announcing Kansas City’s five-year ban on mass detention facilities',
    imageTop: true,
  },
  {
    slug: 'bishop-ward-walkout',
    date: '2026-01-20',
    pillar: 'narrative',
    kind: 'movement',
    title: 'Student uprising: 100+ Bishop Ward students walk out against ICE',
    summary: 'We broke the story as students at Bishop Ward High School in Kansas City, Kansas walked out of class. Within ten minutes, Wyandotte High School students joined them.',
    outcome: 'The first spark in a wave of student walkouts across Missouri and Kansas.',
    metric: { value: '340K+', label: 'views on Instagram alone' },
    image: '/photos/bishop-ward-walkout.jpg',
    imageTop: true,
    imageAlt: 'Bishop Ward High School students walk out against ICE, flags raised',
  },
  {
    slug: 'student-training',
    date: '2026-01-28',
    pillar: 'organizing',
    kind: 'program',
    title: 'Dozens of students asked how to organize. We trained them.',
    summary: 'Our Mass Organizing Training taught high school students how to organize walkouts and build core teams, know their rights at school, make demands, stay safe, talk to media, and learn from the history of nonviolent resistance and student movements.',
    outcome: 'Students from more than 10 school districts across Missouri and Kansas trained in organizing and civic engagement this year.',
    metric: { value: '10+', label: 'school districts' },
    image: '/photos/organizing-training.jpg',
    imageTop: true,
    imageAlt: 'Flyer for the Defender’s Mass Organizing Training for high school students',
  },
  {
    slug: 'strike-day',
    date: '2026-01-30',
    pillar: 'narrative',
    kind: 'movement',
    title: 'The Defender leads the call on Strike Day',
    summary: 'As Kansas City joined the national general strike against ICE, the Defender carried the call to action across our channels.',
    metric: { value: '145K+', label: 'views on Instagram alone' },
  },
  {
    slug: 'lincoln-prep-walkout',
    date: '2026-02-03',
    pillar: 'narrative',
    kind: 'movement',
    title: '“Suspend me if you want”: Lincoln Prep middle schoolers walk out anyway',
    summary: 'Threatened with suspension and blocked at the doors, middle schoolers in KCMO walked out against ICE and the detention camps planned for Kansas City. Parents showed up to stand with them. We were the only outlet to cover it.',
    outcome: 'The story reached 474,000+ views on Instagram alone and led to the Student Action Network, a coalition of students from 10+ schools the Defender pulled together to organize walkouts, protests, and strikes.',
    metric: { value: '474K+', label: 'views on Instagram alone' },
    image: '/photos/lincoln-prep-walkout.jpg',
    imageTop: true,
    imageAlt: 'Lincoln Prep middle school students walk out against ICE',
  },
  {
    slug: 'jon-jeter',
    date: '2026-02-02',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'Two-time Pulitzer finalist Jon Jeter becomes our first International Correspondent',
    summary: 'The former Washington Post bureau chief launched The Plunder Papers from Nairobi, an investigative series on why Africa remains poor seven decades after colonialism.',
    outcome: 'A Kansas City outlet now has a foreign desk.',
    link: 'https://kansascitydefender.com/author/jonjeter/',
    image: '/photos/jon-jeter.jpg',
    imageAlt: 'Jon Jeter',
    imagePortrait: true,
  },
  {
    slug: 'kcpd-budget',
    date: '2026-02-05',
    pillar: 'narrative',
    kind: 'investigation',
    title: 'KCPD claimed a budget crisis after receiving $1.2 billion since 2022. We showed who it was protecting.',
    summary: 'Our investigation exposed the department’s spending and an officer who had killed three people and remained on patrol.',
    metric: { value: '2,000+', label: 'shares' },
    link: 'https://kansascitydefender.com/justice/kcpd-holds-taxpayers-hostage-while-shielding-a-killer-in-blue/',
    image: `${CDN}/2026/02/05161714/kcpdblaynenewton.png`,
  },
  {
    slug: 'panther-screening',
    date: '2026-02-08',
    pillar: 'cultural',
    kind: 'program',
    title: 'Our Black Panther film screening sells out in 48 hours',
    summary: 'For Black History Month, the Defender hosted a screening on the Black Panther Party, followed by a community discussion.',
    metric: { value: '48 hrs', label: 'to sell out' },
  },
  {
    slug: 'indiana-walkout',
    date: '2026-02-11',
    pillar: 'narrative',
    kind: 'movement',
    title: 'Our coverage crosses state lines: Indiana students organize their own walkout',
    summary: 'After seeing our reporting on Kansas City students, Black and Latino students in Indiana organized a walkout of their own, then reached out to the Defender to tell their story.',
    outcome: 'The movement our reporting carried crossed state lines.',
    metric: { value: '466K+', label: 'views on Instagram alone' },
    image: '/photos/indiana-walkout.jpg',
    imageTop: true,
    imageAlt: 'Indiana students protest ICE after hearing about Kansas City students',
  },
  {
    slug: 'platform-ventures',
    date: '2026-02-12',
    pillar: 'narrative',
    kind: 'win',
    title: 'Platform Ventures backs down from selling a warehouse to ICE',
    summary: 'After weeks of protest, the student walkouts we covered, and organizing across the region, the Kansas City firm dropped its plan to sell a south KC warehouse for use as an ICE detention center. The city’s new moratorium had not stopped the attempt. People power did.',
    outcome: 'No ICE detention center at the site.',
    metric: { value: '500K+', label: 'people reached' },
    link: 'https://kansascitydefender.com/justice/platform-ventures-backs-down/',
    image: '/photos/platform-ventures-cancelled.jpg',
    imageAlt: 'The Platform Ventures warehouse, stamped cancelled',
  },
  {
    slug: 'breal-cohort-3',
    date: '2026-02-13',
    pillar: 'organizing',
    kind: 'program',
    title: 'Freedom School Cohort 3 opens with our most applications yet',
    summary: 'B-REAL Academy’s third cohort drew more applicants than ever and filled with high school students from Hogan Prep, Lincoln Prep, and beyond.',
    metric: { value: '40', label: 'students' },
    image: '/photos/breal-cohort-3.jpg',
    imageAlt: 'B-REAL Academy Cohort 3 in front of Willa’s Books & Vinyl',
  },
  {
    slug: 'kids-clothing',
    date: '2026-02-21',
    pillar: 'material',
    kind: 'program',
    title: 'From a drive to 400 pounds washed by hand to families clothed',
    summary: 'Our mutual aid team held a kids’ and baby clothing and hygiene drive at Ms. Willa’s on January 31, washed roughly 400 pounds of children’s clothing at the laundromat on February 11, and distributed it to Black families on February 21.',
    metric: { value: '400 lbs', label: 'of kids’ clothing washed' },
    image: '/photos/clothing-wash-day.jpg',
    imageAlt: 'The Defender mutual aid team washing kids’ clothing at a laundromat',
  },
  {
    slug: 'blayne-newton',
    date: '2026-02-23',
    pillar: 'narrative',
    kind: 'win',
    title: 'Officer Blayne Newton leaves KCPD within ten days of our exposé',
    summary: 'The officer at the center of our investigation resigned with a $50,000 separation package.',
    outcome: 'An officer who had killed three people is off the street.',
    metric: { value: '10', label: 'days to resignation' },
  },
  {
    slug: 'breal-week-2',
    date: '2026-03-09',
    pillar: 'organizing',
    kind: 'program',
    title: 'High schoolers design “the school that doesn’t yet exist”',
    summary: 'In B-REAL Academy’s Radical Imagination session, high school students led the room in designing a liberated Black freedom school: farm-to-table lunches from Black farms, trauma-informed classrooms, a mobile school, and lessons on revolutionary figures.',
    image: '/photos/breal-week-2.jpg',
    imageAlt: 'B-REAL Academy students present their design for a freedom school',
  },
  {
    slug: 'vera',
    date: '2026-03-03',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'The Vera Institute of Justice cites our ICE reporting',
    summary: 'Our coverage of ICE in Kansas City informed a national policy brief.',
  },
  {
    slug: 'rji',
    date: '2026-03-16',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'The Reynolds Journalism Institute names the Defender a model for Black independent media',
    summary: 'The University of Missouri institute featured our model of movement journalism.',
    link: 'https://rjionline.org/news/kansas-city-defender/',
  },
  {
    slug: 'world-cup-jail',
    date: '2026-03-28',
    pillar: 'narrative',
    kind: 'movement',
    title: 'We traced Kansas City’s new jail to the builder of Guantanamo Bay',
    summary: 'Our investigation revealed that the company that built Guantanamo Bay is building Kansas City’s new $25 million jail. When 23 organizations launched a campaign to stop it, we were the only outlet in the room.',
    metric: { value: '$25M', label: 'jail contract' },
    link: 'https://kansascitydefender.com/kansas-city/23-organizations-launch-campaign-to-stop-kcs-world-cup-jail-before-it-opens/',
    image: `${CDN}/2026/03/31093825/9-DSCF2511-scaled.jpg`,
    imageAlt: 'Students and neighbors rally at Van Brunt Park against the World Cup Jail',
  },
  {
    slug: 'pivot-fund',
    date: '2026-04-01',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'Pivot Fund spotlights the Defender nationally',
    summary: 'Pivot Fund featured the Defender in its national roundup of grantees driving change.',
    link: 'https://pivotfund.org/grantees/kansas-city-defender/',
  },
  {
    slug: 'sort-day',
    date: '2026-04-01',
    pillar: 'material',
    kind: 'program',
    title: 'Ten comrades build a system for the Free Clothing Program',
    summary: 'At Sort Day, our mutual aid team split into three coordinated teams and built dedicated, sorted storage for every season, so distributions that once took hours of digging now run as grab-and-go.',
    outcome: 'Faster, more frequent clothing distributions for the community.',
    metric: { value: '10', label: 'comrades' },
    image: '/photos/sort-day.jpg',
    imageAlt: 'Mutual aid organizers sorting clothing into storage units',
  },
  {
    slug: 'lipman',
    date: '2026-04-15',
    pillar: 'institutional',
    kind: 'recognition',
    featured: true,
    title: 'Columbia Journalism School’s Lipman Center selects the Defender',
    summary: 'The Ira A. Lipman Center for Journalism and Civil and Human Rights named the Defender one of five 2026 Arnold Grant recipients nationwide, for reporting on race and the criminal justice system, alongside Pulitzer Prize winner Mississippi Today and CalMatters.',
    outcome: 'Our reporters join Columbia Journalism School’s community of fellows.',
    link: 'https://journalism.columbia.edu/news/2026-lipman-center-arnold-grants',
  },
  {
    slug: 'liberation-now',
    date: '2026-04-16',
    pillar: 'narrative',
    kind: 'program',
    title: 'Liberation Now launches: our flagship YouTube show',
    summary: 'The Midwest’s first radical Black video news show debuted with an interview with Black congressional candidate Hartzell Gray, built for the screens where young people actually are.',
    link: 'https://kansascitydefender.com/videos/liberation-now-debut-hartzell-gray-interview/',
    image: '/photos/liberation-now-hartzell-gray.jpg',
    imageAlt: 'Liberation Now: Who is Hartzell Gray and why are you running?',
  },
  {
    slug: 'free-store-prospect',
    date: '2026-04-25',
    pillar: 'material',
    kind: 'program',
    title: 'The People’s Free Store comes to 31st & Prospect',
    summary: 'Families lined up two and a half hours early. Our mutual aid team set up a free department store with clothing, hygiene products, and political education.',
    metric: { value: '150+', label: 'neighbors served' },
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/peoples-free-store-kc-defender-clothing-hygiene-distribution/',
    image: `${CDN}/2026/04/27141634/158A3299.jpg`,
    imageAlt: 'The People’s Free Store at 31st and Prospect',
  },
  {
    slug: 'nuclear-capital',
    date: '2026-05-07',
    pillar: 'narrative',
    kind: 'win',
    title: 'We revealed Kansas City as the nuclear weapons capital of the world',
    summary: 'Our investigation showed how Kansas City builds most of the non-nuclear parts of every American nuclear weapon, and is now constructing parts for the newest American bomb, ahead of the federal public engagement session on plutonium pits.',
    outcome: 'The room was completely packed, and many attendees said publicly that our story is what brought them.',
    link: 'https://kansascitydefender.com/global-briefing/kansas-city-inside-americas-nuclear-weapons-capital-as-it-builds-the-newest-american-bomb/',
    image: `${CDN}/2026/05/06193943/Nuclear.png`,
  },
  {
    slug: 'say-his-name',
    date: '2026-06-10',
    pillar: 'narrative',
    kind: 'investigation',
    title: 'Say His Name: Saveion',
    summary: 'We reported the killing of nineteen-year-old Saveion McConnell by a Lafayette County deputy, when the state was releasing nothing, and stood with his mother as she called for justice.',
    link: 'https://kansascitydefender.com/justice/saveion-mcconnell-lafayette-county-deputy/',
    image: '/photos/saveion-justice-and-faith.jpg',
    imageAlt: 'A young woman holds a “Justice and Faith” sign with Saveion McConnell’s photo',
    imageTop: true,
  },
  {
    slug: 'breal-graduation',
    date: '2026-06-12',
    pillar: 'organizing',
    kind: 'program',
    title: 'Freedom School graduates its largest and youngest class',
    summary: 'Cohort 3 graduated around a fire on Sankara Farm, twenty-seven acres of Black-owned land.',
    metric: { value: '10 → 81', label: 'age range' },
    link: 'https://kansascitydefender.com/education/kansas-citys-black-abolitionist-freedom-school-is-working-and-it-just-graduated-a-new-class-of-organizers/',
    image: `${CDN}/2026/06/11224001/b-real-cohort-3-scaled.jpg`,
    imageAlt: 'B-REAL Academy Cohort 3 graduates gathered on Sankara Farm',
  },
  {
    slug: 'north-lawn',
    date: '2026-06-12',
    pillar: 'narrative',
    kind: 'movement',
    title: 'North Lawn tenants win it all, and we tell the story',
    summary: 'After three years of organizing with KC Tenants, the North Lawn Tenant Union won frozen rents, erased debt, and a path to ownership. We covered every step.',
    link: 'https://kansascitydefender.com/housing/north-lawn-tenant-union-wins-agreement-levovitz/',
  },
  {
    slug: 'juneteenth',
    date: '2026-06-19',
    pillar: 'cultural',
    kind: 'program',
    title: 'Kansas City’s biggest Juneteenth Cookout',
    summary: 'Built with Decarcerate KC at Harris Park: dozens of Black vendors, a basketball tournament, the first RADAR class of creators honored, and a moment of silence with Saveion McConnell’s family.',
    outcome: 'More than 1,000 neighbors across the last two Juneteenth Cookouts.',
    metric: { value: '500+', label: 'neighbors' },
    link: 'https://kansascitydefender.com/black-life-joy/juneteenth-cookout-kansas-city-or-we-did-juneteenth-kansas-city/',
    image: `${CDN}/2026/06/22134927/158A1563-scaled.jpg`,
    imageAlt: 'The Juneteenth Cookout at Harris Park',
  },
  {
    slug: 'ice-world-cup',
    date: '2026-07-01',
    pillar: 'narrative',
    kind: 'movement',
    title: 'While the world watched the World Cup, we reported the ICE raids',
    summary: 'Our Siege Report dispatch on ICE’s abduction campaign reached more than 100,000 views across web, newsletter, and Instagram, naming a pattern local news ignored, and pointed readers to community defense.',
    outcome: 'More than 100 people signed up for Community Defense Trainings and the Rapid Response Network through our coverage.',
    metric: { value: '100+', label: 'signed up to defend neighbors' },
    link: 'https://kansascitydefender.com/justice/fascism-watch/ice-hunts-kansas-city-world-cup/',
  },
  {
    slug: 'back-to-school',
    date: '2026-07-18',
    pillar: 'material',
    kind: 'program',
    title: 'Feeding and clothing Black students for the new school year',
    summary: 'The Back-to-School People’s Distribution returned on Troost: kids’ clothing and hygiene items, sorted by our all-Black mutual aid team into a free, retail-quality store. No applications, no questions.',
    outcome: 'Black students started the year clothed and cared for, for free.',
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/back-to-school-peoples-distribution-kansas-city-2026/',
  },
  {
    slug: 'inn-emerging-leader',
    date: '2026-07-20',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'Khadijah Bland named INN’s National Emerging Leader of the Year',
    summary: 'The Institute for Nonprofit News honored our Director of Development & Revenue for replacing ad hoc fundraising with structured systems, sustainable forecasting, and long-term revenue planning.',
    outcome: 'In her first year in the role, active subscriptions grew more than 40%, alongside new revenue from events and Black business partnerships and the Defender’s first capital campaign.',
    metric: { value: '40%+', label: 'subscription growth in her first year' },
    image: '/photos/inn-emerging-leader.jpg',
    imageAlt: 'Khadijah Bland, INN 2026 Emerging Leader of the Year',
    imageTop: true,
  },
  {
    slug: 'five-years',
    date: '2026-07-22',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'Five years of the Defender',
    summary: 'Born from the 2020 uprisings in July 2021, the Defender marked five years of building media, care, and political education for Black Kansas City. The national media newsletter The Front Page celebrated the milestone and our abolitionist work.',
    link: 'https://kansascitydefender.com/editorial/five-years-of-movement-the-defender-is-still-becoming/',
    image: `${CDN}/2026/07/22122112/KCD-Willas-3.jpg`,
    imageAlt: 'The Defender at Ms. Willa’s Books',
  },
  {
    slug: 'peoples-ballot',
    date: '2026-07-31',
    pillar: 'organizing',
    kind: 'program',
    title: 'The People’s Ballot: Missouri’s most comprehensive radical election guide',
    summary: 'Every amendment, race, and dollar in plain language, online and in print, for the August primary and the November general. We take positions on measures and publish the record on candidates, never endorsements.',
    link: 'https://kansascitydefender.com/politics/americas-most-important-election-the-peoples-ballot-is-here/',
  },
  {
    slug: 'data-center',
    date: '2026-08-06',
    pillar: 'narrative',
    kind: 'win',
    title: 'Kansas City rejects a downtown data center, and we expose the tax scheme behind it',
    summary: 'We obtained the deed showing a Miami fund had promised never to demolish a 126-year-old building, then asked to demolish it for a 20-story data center.',
    outcome: 'The Plan Commission voted no. A leading scholar called it the first documented case of a data center used in a syndicated easement scheme.',
    link: 'https://kansascitydefender.com/technology-ai/kansas-city-data-center-tax-scheme/',
    image: `${CDN}/2026/08/06120942/data-center.webp`,
  },
  {
    slug: 'trans-prisoners',
    date: '2026-08-11',
    pillar: 'narrative',
    kind: 'investigation',
    title: 'Missouri cut off care for trans people in its prisons. We reported from inside.',
    summary: 'Da’Shae Breeze wrote to us from a solitary confinement cell after the state ended her hormone therapy with one sentence in a budget bill, alongside Jessica Hicklin, who won the federal ruling Missouri just defied.',
    outcome: 'The people Missouri caged told their own story, in their own words.',
    link: 'https://kansascitydefender.com/aboltion/abolition/missouri-forced-detransition-trans-prisoners/',
  },
  {
    slug: 'kcata',
    date: '2026-08-25',
    pillar: 'narrative',
    kind: 'investigation',
    title: 'KCATA signed a secret deal to harvest bus riders’ faces',
    summary: 'We obtained the auto-renewing contract giving a private company rights to riders’ faces, video, and voices, with no policy to protect the data.',
    link: 'https://kansascitydefender.com/technology-ai/kcata-facial-recognition-contract/',
    image: '/photos/kcata-facial-recognition.jpg',
    imageAlt: 'A face mapped by facial recognition software',
  },
  {
    slug: 'ljf-cohort',
    date: '2026-08-28',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'Selected for the 2026 national cohort of the Lab for Journalism Funding',
    summary: 'The Defender joined the Local Media Association’s national Lab for Journalism Funding cohort, building the revenue base for the next five years.',
  },
  {
    slug: 'hamer-seniors',
    date: '2026-08-29',
    pillar: 'material',
    kind: 'program',
    title: 'Hamer delivers Black-grown produce to seniors at Palestine Commons',
    summary: 'In the Hamer Program’s second distribution of the year, 25 organizers packed and handed out 51 bags of potatoes, tomatoes, onions, peppers, and herbs grown by local Black farmers to seniors near the old Sun Fresh.',
    outcome: 'Seniors asked for it to keep going, and so did our organizers.',
    metric: { value: '51', label: 'bags of produce' },
    image: '/photos/hamer-seniors.jpg',
    imageAlt: 'A Defender organizer packing peppers into Hamer Food Box bags',
  },
  {
    slug: 'kc-gift',
    date: '2026-09-01',
    pillar: 'narrative',
    kind: 'program',
    title: 'Black Economic Power: a new column with KC G.I.F.T.',
    summary: 'We launched our business and economics column with a letter from Brandon Calloway, CEO of KC G.I.F.T., who has judged 300+ pitches and helped move more than $2 million into Black-owned businesses, on exactly what funders need to see.',
    outcome: 'Practical capital know-how, put directly into the hands of Black entrepreneurs.',
    link: 'https://kansascitydefender.com/black-business/a-letter-to-black-owned-businesses-kc-gift/',
    image: `${CDN}/2026/09/01105456/471632860_1824740625007151_4208511322977631161_n.jpg`,
  },
  {
    slug: 'nuclear-guinea-pigs',
    date: '2026-09-08',
    pillar: 'narrative',
    kind: 'win',
    title: 'NUCLEAR GUINEA PIGS: the first underground nuclear reactor in history',
    summary: 'We investigated a plan to drill a nuclear reactor a mile beneath Parsons, Kansas, through its drinking water, to power AI data centers.',
    outcome: 'International experts took up the story, and the company is now being sued.',
    link: 'https://kansascitydefender.com/justice/investigation/nuclear-guinea-pigs-parsons-kansas/',
    image: `${CDN}/2026/09/08175509/parsons4-1024x683.png`,
  },
  {
    slug: 'saveion-bodycam',
    date: '2026-09-18',
    pillar: 'narrative',
    kind: 'win',
    title: 'We obtain the bodycam footage Missouri hid in Saveion McConnell’s killing',
    summary: 'Two days after the prosecutor declined charges, we published the footage and the prosecutor’s own memo. Both contradict what the state told the public.',
    outcome: 'Civil rights attorney Ben Crump is fighting for Saveion’s family.',
    link: 'https://kansascitydefender.com/justice/saveion-mcconnell-bodycam-video/',
    image: '/photos/saveion-bodycam.jpg',
    imageAlt: 'A frame from the body camera footage of the night Saveion McConnell was killed',
  },
  {
    slug: 'cuny-spotlight',
    date: '2026-09-22',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'CUNY’s Newmark J-School spotlights our dual-power model',
    summary: 'The Craig Newmark Graduate School of Journalism featured the Defender in its Spotlight on Community Media, describing a newsroom that runs alongside permanent community institutions, in the tradition of the Black Panther Party.',
  },
  {
    slug: 'black-theology',
    date: '2026-09-23',
    pillar: 'cultural',
    kind: 'program',
    title: 'Black Theology & Black Power on Liberation Now',
    summary: 'Many young Black people have already walked out of church. Our new series asks whether the God of the Black church is a God of empire or of revolution, with world-leading scholar Dr. J. Kameron Carter of Washington University and Black socialist minister Andrew Hairston on the future of spirituality.',
    outcome: 'In a city shaped by the Black church, a new generation gets a faith conversation that speaks to its politics.',
    link: 'https://kansascitydefender.com/videos/liberation-now-show/whiteness-is-a-religion-j-kameron-carter/',
    image: '/photos/liberation-now-hairston.jpg',
    imageAlt: 'Liberation Now: Jesus Was a Socialist, featuring Minister Andrew Hairston',
  },
  {
    slug: 'lion-award',
    date: '2026-09-09',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'LION Publishers’ 2026 Community Engagement Award goes to the Defender',
    summary: 'LION honored the Hamer Free Food Program in its national Sustainability Awards. The judges called it “a quick and nimble model for solutions-focused community engagement.”',
    outcome: '$7,000 circulated into Black farms, led by 60 Community Food Leaders, mostly Black residents under 30.',
    image: '/photos/hamer-magazines.jpg',
    imageAlt: 'The Defender’s Hamer Program literature',
  },
  {
    slug: 'peoples-buyout',
    date: '2026-10-07',
    pillar: 'material',
    kind: 'win',
    title: 'The People’s Buyout feeds 100 Black single mothers',
    summary: 'Black Feast Week opened for its third year with the Defender fully funding dinner for 100 Black single mothers and their families at Daiquiri District.',
    metric: { value: '100', label: 'mothers & families fed' },
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/defender-peoples-programs/peoples-buyout-2026-black-feast-week/',
    image: `${CDN}/2026/10/01134303/KC-Black-Feast-Week-03-Mothers-Event6.jpg`,
    imageAlt: 'Black Feast Week’s People’s Buyout',
  },
  {
    slug: 'breal-cohort-4',
    date: '2026-10-15',
    pillar: 'organizing',
    kind: 'program',
    title: 'Freedom School Cohort 4 is underway',
    summary: 'B-REAL Academy enters its fourth cohort, alongside the Defender Book Club’s ongoing political education.',
  },
  {
    slug: 'one-million-experiments',
    date: '2026-10-15',
    pillar: 'institutional',
    kind: 'recognition',
    title: 'One Million Experiments highlights B-REAL Academy',
    summary: 'The project co-founded by Mariame Kaba to document abolitionist institutions featured the Defender and our freedom school.',
  },
  {
    slug: 'mutual-aid-room',
    date: '2026-10-18',
    pillar: 'material',
    kind: 'program',
    title: 'The mutual aid room at Ms. Willa’s, rebuilt',
    summary: 'Over several weeks, our mutual aid committee turned a backroom piled with donations into an organized free store of coats, shoes, clothing, and pantry goods.',
    image: '/photos/mutual-aid-room.jpg',
    imageAlt: 'The organized mutual aid room at Ms. Willa’s Books',
  },
  {
    slug: 'november-ballot',
    date: '2026-10-22',
    pillar: 'organizing',
    kind: 'program',
    title: 'The People’s Ballot returns for November',
    summary: 'A plain-language guide to every measure and race on Kansas City’s November 3 ballot, from Prop A to COMBAT, with an election day countdown and the files on every race.',
    link: 'https://kansascitydefender.com/politics/peoples-ballot-november-2026-voter-guide/',
    image: '/photos/peoples-ballot.jpg',
    imageAlt: 'The People’s Ballot November voter guide',
  },
];

// ─── The Victory Board: wins you can open ───────────────────────────────────

export const WINS: Win[] = [
  {
    slug: 'student-movement',
    date: '2026-01-20',
    pillar: 'organizing',
    label: 'Organizing',
    title: 'Our reporting sparked a wave of student walkouts against ICE',
    metric: { value: '10+', label: 'school districts trained' },
    body: [
      'On January 20, more than 100 students at Bishop Ward High School in Kansas City, Kansas walked out against ICE, and Wyandotte High School students joined within minutes. The Defender broke the story. Two weeks later, Lincoln Prep middle schoolers in KCMO walked out despite suspension threats. We were the only outlet there, and the story drew more than 474,000 views on Instagram alone.',
      'Then it spread. Students in Indiana saw our reporting, organized their own walkout, and reached out to the Defender to tell their story. Dozens of students asked us how to organize, so we trained them: walkouts, core teams, know your rights, safety, demands, and the history of nonviolent resistance and student movements.',
    ],
    outcome: 'The Student Action Network, a coalition of students from 10+ schools that the Defender pulled together, plus students from more than 10 school districts trained in organizing and civic engagement. A youth movement that helped stop an ICE detention center.',
    partners: ['Student organizers across MO and KS'],
    image: '/photos/bishop-ward-walkout.jpg',
    imageTop: true,
  },
  {
    slug: 'platform-ventures',
    date: '2026-02-12',
    pillar: 'narrative',
    label: 'Policy',
    title: 'Platform Ventures backs down from its ICE detention sale',
    metric: { value: '500K+', label: 'people reached' },
    body: [
      'Platform Ventures, a Kansas City investment firm, planned to sell a massive south Kansas City warehouse to the federal government for use as an ICE detention center.',
      'Thousands of community members and movement organizations across Missouri and Kansas organized against it, with mass protests, student walkouts, business shutdowns, and a national general strike. The Defender was the movement’s media arm, carrying its demands to more than half a million people.',
      'On February 12, Platform Ventures announced it was not moving forward with the sale.',
    ],
    outcome: 'No ICE detention center at the site. The win belongs to the movement, and the Defender gave it voice and reach.',
    partners: ['Decarcerate KC', 'Student organizers', 'Coalition partners across MO and KS'],
    link: 'https://kansascitydefender.com/justice/platform-ventures-backs-down/',
    image: '/photos/platform-ventures-cancelled.jpg',
  },
  {
    slug: 'blayne-newton',
    date: '2026-02-23',
    pillar: 'narrative',
    label: 'Accountability',
    title: 'A police officer who killed three people leaves KCPD',
    metric: { value: '10', label: 'days to resignation' },
    body: [
      'Our investigation revealed that KCPD had received $1.2 billion since 2022 while claiming it could not afford basic services, and that an officer who had killed three people remained on patrol.',
      'Less than ten days after publication, Officer Blayne Newton resigned and accepted a $50,000 separation package.',
    ],
    outcome: 'The officer is no longer policing Kansas City. The story was shared more than 2,000 times.',
    link: 'https://kansascitydefender.com/justice/kcpd-holds-taxpayers-hostage-while-shielding-a-killer-in-blue/',
    image: `${CDN}/2026/02/05161714/kcpdblaynenewton.png`,
  },
  {
    slug: 'nuclear-capital',
    date: '2026-05-07',
    pillar: 'narrative',
    label: 'Mobilization',
    title: 'Kansas City, the nuclear weapons capital of the world, packs the room',
    metric: { value: '80%', label: 'of non-nuclear bomb components made in KC' },
    body: [
      'For seventy-seven years, Kansas City has built most of the non-nuclear components in every American nuclear weapon, and most residents do not know it. Black workers like Maurice Copeland handled carcinogens there for decades without being told.',
      'Our investigation named Kansas City as the nuclear weapons capital of the world, now constructing parts for the newest American bomb, and ran ahead of the federal government’s public engagement session on plutonium pits.',
    ],
    outcome: 'The room was completely packed, and many attendees said publicly that our story is what brought them.',
    link: 'https://kansascitydefender.com/global-briefing/kansas-city-inside-americas-nuclear-weapons-capital-as-it-builds-the-newest-american-bomb/',
    image: `${CDN}/2026/05/06193943/Nuclear.png`,
  },
  {
    slug: 'data-center',
    date: '2026-08-06',
    pillar: 'narrative',
    label: 'Accountability',
    title: 'Kansas City killed the data center. We exposed the tax scheme.',
    metric: { value: '1st', label: 'documented case of its kind' },
    body: [
      'A Miami fund bought a 126-year-old downtown building, recorded a preservation easement promising it could never be demolished, then asked Kansas City for permission to demolish it and build a 20-story data center.',
      'The Defender obtained the deed and securities filings. One of the nation’s foremost authorities on conservation easement law reviewed them and called it what it appears to be: a syndicated conservation easement transaction.',
    ],
    outcome: 'The Plan Commission denied the project, and the scholar described our reporting as the first documented case of a data center being used in an easement scheme.',
    link: 'https://kansascitydefender.com/technology-ai/kansas-city-data-center-tax-scheme/',
    image: `${CDN}/2026/08/06120942/data-center.webp`,
  },
  {
    slug: 'nuclear-guinea-pigs',
    date: '2026-09-08',
    pillar: 'narrative',
    label: 'Accountability',
    title: 'The first underground nuclear reactor, and the lawsuit that followed',
    metric: { value: '1 mile', label: 'beneath Parsons, Kansas' },
    body: [
      'A California company plans to drill the first nuclear reactor in history a mile underground beneath Parsons, Kansas, through the town’s aquifer, to power AI data centers. One in five Parsons residents lives in poverty.',
      'Our investigation showed how the safety rules that would have stopped it were rewritten in Washington and the environmental review was erased, and we told the story through the families who live less than two miles away.',
    ],
    outcome: 'International experts have taken up the story, and the company is now being sued.',
    link: 'https://kansascitydefender.com/justice/investigation/nuclear-guinea-pigs-parsons-kansas/',
    image: `${CDN}/2026/09/08175509/parsons4-1024x683.png`,
  },
  {
    slug: 'saveion-bodycam',
    date: '2026-09-18',
    pillar: 'narrative',
    label: 'Accountability',
    title: 'The footage Missouri hid in the killing of Saveion McConnell',
    metric: { value: '4.5', label: 'months the state withheld it' },
    body: [
      'Saveion McConnell was nineteen, a Lee’s Summit North graduate, accused of no crime, when a Lafayette County deputy struck him with a patrol car and shot him.',
      'The Defender reported his killing from the start. Two days after the prosecutor declined to file charges, we published the body camera footage and the prosecutor’s own memo. Both contradict what the state had told the public.',
    ],
    outcome: 'Nationally renowned civil rights attorney Ben Crump is fighting for Saveion’s family, and the community is demanding the case be reopened.',
    link: 'https://kansascitydefender.com/justice/saveion-mcconnell-bodycam-video/',
    image: '/photos/saveion-bodycam.jpg',
    imageAlt: 'A frame from the body camera footage of the night Saveion McConnell was killed',
  },
  {
    slug: 'free-store',
    date: '2026-10-31',
    dateLabel: 'All year',
    pillar: 'material',
    label: 'Material',
    title: '3,000+ clothing and hygiene items, given with dignity',
    metric: { value: '3,000+', label: 'items to Black families' },
    body: [
      'The Defender’s Free Clothing Program, in the lineage of the Black Panther Party’s survival programs, runs like a department store owned by the people. No applications, no questions, nothing to pay.',
      'At 31st and Prospect in April, families lined up two and a half hours before the doors opened, and more than 150 neighbors left with clothing and hygiene products. The program returned in July so Black students could start school clothed.',
    ],
    outcome: 'More than 3,000 clothing and hygiene items in the hands of Black families this year.',
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/peoples-free-store-kc-defender-clothing-hygiene-distribution/',
    image: `${CDN}/2026/04/27141634/158A3299.jpg`,
  },
  {
    slug: 'peoples-buyout',
    date: '2026-10-07',
    pillar: 'material',
    label: 'Material',
    title: '100 Black single mothers fed at the People’s Buyout',
    metric: { value: '100', label: 'mothers & families' },
    body: [
      'Black Feast Week opened its third year the way it always does: with the Defender buying out a Black-owned restaurant so Black single mothers can sit down with their families without a bill coming.',
      'Every one of the 100 meals at Daiquiri District was covered, with support from Kansas City Central Bank.',
    ],
    outcome: 'A night of community for 100 families, and dollars into a Black-owned business.',
    partners: ['Daiquiri District', 'Kansas City Central Bank'],
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/defender-peoples-programs/peoples-buyout-2026-black-feast-week/',
    image: `${CDN}/2026/10/01134303/KC-Black-Feast-Week-03-Mothers-Event6.jpg`,
  },
  {
    slug: 'freedom-school',
    date: '2026-06-12',
    pillar: 'organizing',
    label: 'Leadership',
    title: 'Freedom School graduates its largest and youngest class',
    metric: { value: '4', label: 'cohorts and counting' },
    body: [
      'B-REAL Academy is the region’s only abolitionist freedom school. Cohort 3 drew our most applications yet, and more than half of its students were in high school.',
      'They graduated around a fire on Sankara Farm, twenty-seven acres of Black-owned land. Students have ranged in age from 10 to 81. Cohort 4 is now underway.',
    ],
    outcome: 'A growing class of young organizers trained in political education and leadership.',
    link: 'https://kansascitydefender.com/education/kansas-citys-black-abolitionist-freedom-school-is-working-and-it-just-graduated-a-new-class-of-organizers/',
    image: `${CDN}/2026/06/11224001/b-real-cohort-3-scaled.jpg`,
  },
];
