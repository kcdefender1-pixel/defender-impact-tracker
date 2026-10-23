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
  { value: '1–2M', label: 'Digital impressions a month' },
  { value: '50', label: 'Active members' },
  { value: '3,000+', label: 'Clothing & hygiene items given' },
  { value: '100', label: 'Black single mothers fed' },
  { value: '4th', label: 'Freedom School cohort' },
];

export const MORE_STATS = [
  { value: '500K+', label: 'Reached during the Platform Ventures ICE fight' },
  { value: '23', label: 'Organizations in the coalition against the World Cup Jail' },
  { value: '150+', label: 'Neighbors served in one afternoon at the People’s Free Store' },
  { value: '30', label: 'Members on our mutual aid team' },
  { value: '10', label: 'New Mutual Aid Leaders who emerged this year' },
  { value: '100+', label: 'Community volunteers our mutual aid team organizes' },
  { value: '$7K', label: 'Circulated into Black farms through Hamer' },
  { value: '40%+', label: 'Growth in active subscriptions' },
  { value: '337K+', label: 'Views on our Lincoln Prep walkout story' },
  { value: '100+', label: 'Signed up to defend neighbors from ICE through our coverage' },
  { value: '10+', label: 'School districts across Missouri and Kansas whose students we trained' },
];

// ─── The narrative ──────────────────────────────────────────────────────────

export const THESIS = {
  kicker: 'The Kansas City Defender · 2026 Impact',
  headline: 'Media that builds power.',
  dek: 'The Defender is a new model: radical journalism, organizing, and community care fused into one Black-led institution. We reach the young Black and brown people the rest of the media lost, and turn that reach into narrative change, civic participation, and organized power for the next generation.',
};

export const NARRATIVE: string[] = [
  'American media is going dark. This year The Kansas City Call, the Black newspaper that has served this city for more than a century, missed print for the first time in its history. The Kansas City Star cut its newsroom again. Into that silence pours a flood of misinformation and disinformation, aimed squarely at the young Black and brown people that legacy media stopped speaking to long ago. Most of them have tuned out. They have not tuned out of us.',
  'The Defender reaches the people the rest of the press cannot. This year we have averaged one to two million digital impressions a month across our platforms, and the vast majority of our audience is Black, brown, and young. They find us on their phones, in their feeds, on our YouTube show, in a voice that respects them and a politics that tells them the truth about the forces shaping their lives: the police budget, the ICE detention deal, the data center tax scheme, the nuclear weapons plant down the street. And then they do what most media audiences never do. They show up.',
  'That is the difference. Some people walk in through a story. Others come through the People’s Free Store, a Hamer Program food box from a Black farm, a seat in our Freedom School, the book club, or a Juneteenth cookout with five hundred of their neighbors. Every door leads to the same place: a community that feeds you, teaches you, and then asks you to help build something. Fifty active members now carry that work across the organization, and the people who come through our doors go on to join and lead organizations across the region.',
  'The results are on the record. Our reporting on students walking out against ICE sparked a wave of walkouts across Missouri, Kansas, and beyond, and we trained students from more than ten school districts in organizing, civic engagement, and their rights. A corporate ICE detention deal collapsed under public pressure we helped build. A police officer who had killed three people left KCPD within ten days of our investigation. We obtained the body camera footage the State of Missouri hid in the killing of nineteen-year-old Saveion McConnell, and nationally renowned civil rights attorney Ben Crump is now fighting for his family. When federal officials came to Kansas City to ask for consent to build the next American bomb, the room was packed. Our investigation into the first underground nuclear reactor in history drew international experts, and the company behind it is now being sued.',
  'This is why the Defender matters to so many people at once. To young people, it is the first media that ever treated them as protagonists. To Black families, it is food and clothing given with dignity. To organizers and progressives, it is the media arm of a movement that is winning. To voters, it is The People’s Ballot. To Black businesses and entrepreneurs, it is a platform and a source of capital know-how. To the next generation of leaders, it is a school. And to journalism, at the very moment its old institutions are failing, it is proof of what comes next.',
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
    text: 'Young Black and brown people are turning away from legacy media just as disinformation targets them hardest.',
  },
];

// How the pieces fit: the path someone takes through the Defender
export const PATHWAY = [
  { step: 'Reach', text: 'A story finds a young person on their feed, in a voice that respects them.' },
  { step: 'Trust', text: 'We tell the truth when no one else will, and the record proves it.' },
  { step: 'Care', text: 'They come to the Free Store, a Hamer box, a Buyout, a cookout.' },
  { step: 'Train', text: 'Freedom School and the book club turn questions into political education.' },
  { step: 'Lead', text: 'They join the Defender and the movement, and start bringing others in.' },
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
    proof: '1–2 million digital impressions a month. Our reporting moved police, prosecutors, corporations, and federal agencies this year.',
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
    what: 'Named for Fannie Lou Hamer. Launched with Kansas City’s Black farms after Sun Fresh closed, it buys produce at market rate and delivers it free to Black elders and families.',
    proof: 'The first network to unite the Black farms of Kansas City, and winner of LION Publishers’ 2026 Community Engagement Award.',
    stats: [
      { value: '$7K', label: 'circulated into Black farms' },
      { value: '60', label: 'Community Food Leaders, mostly under 30' },
      { value: '51', label: 'bags of produce to seniors in one day' },
    ],
    link: 'https://kansascitydefender.com/mutual-aid-community-programs/kcs-black-farms-unite-hamer-free-food-program/',
    image: '/photos/hamer-food-box.jpg',
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
    image: `${CDN}/2026/06/11224001/b-real-cohort-3-scaled.jpg`,
  },
  {
    name: 'The Book Club',
    pillar: 'organizing',
    what: 'A standing community of readers working through the Black radical tradition together, at home in Ms. Willa’s Books, Missouri’s oldest Black bookstore.',
    proof: 'Political education that keeps going between cohorts.',
    image: '/photos/breal-week-2.jpg',
  },
  {
    name: 'The Culture',
    pillar: 'cultural',
    what: 'Kansas City’s biggest Juneteenth Cookout, built with Decarcerate KC, plus RADAR, our new culture magazine documenting the city’s artists and creators.',
    proof: '500+ neighbors at Harris Park this year, more than 1,000 across the last two, with dozens of Black vendors.',
    link: 'https://kansascitydefender.com/black-life-joy/juneteenth-cookout-kansas-city-or-we-did-juneteenth-kansas-city/',
    image: `${CDN}/2026/06/22134927/158A1563-scaled.jpg`,
  },
  {
    name: 'Ms. Willa’s Books',
    pillar: 'institutional',
    what: 'Missouri’s oldest Black bookstore, saved from auction by the Defender and now our headquarters: home to our pantry, free store, book club, and freedom school classroom.',
    proof: 'A permanent Black institution and 10,000 volumes, kept in Black hands.',
    link: '#willas',
    image: `${CDN}/2026/07/22122112/KCD-Willas-3.jpg`,
  },
];

export const WHO_FOR = [
  { who: 'Youth', why: 'The first media that speaks to them as protagonists, and a school that makes them leaders.' },
  { who: 'Black & brown families', why: 'Food, clothing, and care, given with dignity and without paperwork.' },
  { who: 'Organizers & progressives', why: 'The media arm of a movement that is winning real fights.' },
  { who: 'Black businesses', why: 'Black Feast Week, the Buyout, and our Black Economic Power column with KC G.I.F.T. put dollars and know-how into Black-owned businesses.' },
  { who: 'Voters', why: 'The People’s Ballot explains every measure and race in plain language, online and in print.' },
  { who: 'People of faith', why: 'Liberation Now’s Black Theology & Black Power series brings the Black church tradition back into the fight for liberation.' },
  { who: 'The next generation of leaders', why: 'Freedom School graduates go on to found organizations and teach.' },
  { who: 'Journalism itself', why: 'A working model of community-owned media while the old institutions collapse.' },
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
    { title: 'We raised the rent', text: 'The Defender raised the money to pay her rent for a full year, then helped Ms. Willa retire with dignity.' },
    { title: 'Every book, by hand', text: 'Defender organizers cataloged the entire 10,000-volume collection.' },
    { title: 'Our home', text: '2026 is our first full year running it as our headquarters: the pantry, the mutual aid room, the book club, and the freedom school classroom.' },
    { title: 'Next: a Liberation Hub', text: 'In 2027, Willa’s becomes a year-round Liberation Hub, open to the community every day.' },
  ],
  image: `${CDN}/2026/07/22122112/KCD-Willas-3.jpg`,
  imageAlt: 'The Defender team in front of Willa’s Books & Vinyl',
  credit: 'Led by Nina Kerrs, Site Manager & Willa’s Campaign Lead',
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

export const TEAM: { name: string; role: string; note?: string }[] = [
  { name: 'Ryan Sorrell', role: 'Founder & Executive Editor', note: 'Led the year’s biggest investigations, from Kansas City’s nuclear weapons plant to the first underground reactor.' },
  { name: 'Khadijah Bland', role: 'Director of Development & Revenue', note: 'INN’s 2026 National Emerging Leader of the Year. Grew active subscriptions 40%+ and launched our first capital campaign.' },
  { name: 'Melissa Ferrer-Civil', role: 'Director, B-REAL Academy', note: 'Kansas City’s first Poet Laureate. Led the freedom school through its largest, youngest class and into Cohort 4.' },
  { name: 'Jon Jeter', role: 'International Correspondent', note: 'Two-time Pulitzer Prize finalist. Launched The Plunder Papers from Nairobi.' },
  { name: 'Nina Kerrs', role: 'Site Manager & Willa’s Campaign Lead', note: 'Led the campaign to save Ms. Willa’s and runs our home base there.' },
  { name: 'Carmon Smith', role: 'Mutual Aid Co-Lead', note: 'Led the kids’ clothing drive and wash day, and helped design our Sort Day system.' },
  { name: 'Brittany Vesey', role: 'Mutual Aid Co-Lead', note: 'Led the Hamer distribution to seniors at Palestine Commons, and helped design our Sort Day system.' },
  { name: 'Vaughan Harrison', role: 'Senior Investigative Reporter' },
  { name: 'Tiffany Watts', role: 'Reporter on Black Economic Justice' },
  { name: 'Jylon Hollinshed', role: 'Arts & Culture Lead' },
  { name: 'Joshua Taylor', role: 'Senior Culture Lead' },
  { name: 'Curtis Wright', role: 'Strategic Partnerships Lead' },
];

export const TEAM_THANKS =
  'And to our 50 members, the 30-strong mutual aid team and its 10 new leaders, and the 100+ community volunteers who sort the clothes, pack the boxes, run the trainings, and tell the stories: this is your work.';

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
  dek: 'In 2027 the Defender grows from Kansas City’s essential Black newsroom into the Black newsroom of the Midwest, with reporting that starts on Prospect Avenue and reaches the world.',
  reach: [
    { scope: 'Kansas City', title: 'Own the city’s front page', text: 'Daily short-form video news on the platforms young Kansas City actually uses, a student newsroom reporting from inside their own schools, and print in the people’s hands through Hamer boxes, Willa’s, and the streets.' },
    { scope: 'Missouri & the region', title: 'Build a statewide desk', text: 'Follow the power to Jefferson City and across Missouri and Kansas: the statehouse, the ballot fights, the prisons, and the small towns industry targets because it thinks no one is watching.' },
    { scope: 'National', title: 'Set the national agenda', text: 'Own the beats nobody else will, from AI surveillance and nuclear weapons to ICE and police accountability, and partner with national outlets to carry our investigations across the country.' },
    { scope: 'International', title: 'Take it global', text: 'Grow our international desk across the African diaspora and take Liberation Now international, connecting Kansas City’s fights to the global struggle for Black liberation.' },
  ],
  mediums: ['Investigations', 'Liberation Now on YouTube', 'Daily short-form video', 'RADAR & print editions', 'The newsletter', 'Live town halls & events'],
  powerHeadline: 'And the power we build around it',
  goals: [
    { title: 'A youth organizing & leadership pipeline', text: 'Grow the Student Action Network and B-REAL Academy, and train young people in journalism and media careers, so every young person who finds us has a path to lead.' },
    { title: 'Willa’s as a year-round Liberation Hub', text: 'The free store, pantry, book club, and freedom school under one roof, open to the community all year.' },
    { title: 'Scale our mutual aid programs', text: 'More families clothed and fed, more Black farms paid, and more Mutual Aid Leaders organizing alongside them.' },
    { title: 'Grow Black Feast Week', text: 'A diner passport and a public directory of Kansas City’s Black businesses, so visibility reaches founders at every stage.' },
  ],
  ways: [
    { label: 'Donate', text: 'Become a monthly Defender or give once.', href: 'https://kansascitydefender.com/support-us/' },
    { label: 'Volunteer & join', text: 'Sort, pack, deliver, teach, organize.', href: 'https://kansascitydefender.com/join/' },
    { label: 'Become a funder or partner', text: 'Invest in the model. Let’s talk.', href: 'https://kansascitydefender.com/contact-us/' },
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
      '1–2 million digital impressions a month, from an audience that is mostly Black, brown, and young.',
      'Our Lincoln Prep walkout story alone reached 337,000+ views, and the movement our reporting carried crossed state lines.',
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
    claim: 'We turn readers into participants, and participants into organizers.',
    proof: [
      'The People’s Ballot: Missouri’s most comprehensive plain-language election guide, online and in print, for the August primary and November general.',
      'Students from more than 10 school districts trained in organizing, civic engagement, and know your rights, and the Student Action Network we pulled together: students from 10+ schools.',
      'The media arm for the 23-organization coalition fighting Kansas City’s World Cup Jail.',
      'B-REAL Academy, our abolitionist freedom school, is in its fourth cohort.',
      '10 new Mutual Aid Leaders emerged this year to strategize and organize, from a 30-member mutual aid team that mobilizes 100+ community volunteers.',
      '50 active members carrying the work across the organization, plus a packed federal hearing on nuclear weapons and 100+ community defense sign-ups through our coverage.',
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
      'The Hamer Program buys from Black farms at market rate and delivers the produce free to Black elders and families.',
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
      'Active subscriptions up 40%+, new revenue from events and Black business partnerships, and our first capital campaign.',
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
    slug: 'bishop-ward-walkout',
    date: '2026-01-20',
    pillar: 'narrative',
    kind: 'movement',
    title: 'Student uprising: 100+ Bishop Ward students walk out against ICE',
    summary: 'We broke the story as students at Bishop Ward High School in Kansas City, Kansas walked out of class. Within ten minutes, Wyandotte High School students joined them.',
    outcome: 'The first spark in a wave of student walkouts across Missouri and Kansas.',
    metric: { value: '15K+', label: 'likes on one post' },
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
    metric: { value: '15K', label: 'reached in a day' },
  },
  {
    slug: 'lincoln-prep-walkout',
    date: '2026-02-03',
    pillar: 'narrative',
    kind: 'movement',
    title: '“Suspend me if you want”: Lincoln Prep middle schoolers walk out anyway',
    summary: 'Threatened with suspension and blocked at the doors, middle schoolers in KCMO walked out against ICE and the detention camps planned for Kansas City. Parents showed up to stand with them. We were the only outlet to cover it.',
    outcome: 'The story reached 337,000+ views and led to the Student Action Network, a coalition of students from 10+ schools the Defender pulled together to organize walkouts, protests, and strikes.',
    metric: { value: '337K+', label: 'views' },
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
    metric: { value: '22K+', label: 'likes' },
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
    summary: 'After weeks of protest, the student walkouts we covered, and organizing across the region, the Kansas City firm dropped its plan to sell a south KC warehouse for use as an ICE detention center.',
    outcome: 'No ICE detention center at the site.',
    metric: { value: '500K+', label: 'people reached' },
    link: 'https://kansascitydefender.com/justice/platform-ventures-backs-down/',
  },
  {
    slug: 'breal-cohort-3',
    date: '2026-02-13',
    pillar: 'organizing',
    kind: 'program',
    title: 'Freedom School Cohort 3 opens: 60 applied for 40 seats',
    summary: 'B-REAL Academy’s third cohort filled with many high school students from Hogan Prep, Lincoln Prep, and beyond.',
    metric: { value: '40', label: 'students' },
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
    imageAlt: 'Mutual aid volunteers sorting clothing into storage units',
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
    title: 'Kansas City learns it builds America’s nuclear weapons, and fills the room',
    summary: 'Our investigation into the Kansas City National Security Campus, where most non-nuclear components of every American nuclear weapon are made, ran ahead of the federal hearing on plutonium pit production.',
    outcome: 'A completely packed public engagement session.',
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
    outcome: 'Active subscriptions up more than 40%, new revenue from events and Black business partnerships, and the Defender’s first capital campaign.',
    metric: { value: '40%+', label: 'growth in active subscriptions' },
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
    summary: 'In the Hamer Program’s second distribution of the year, 25 volunteers packed and handed out 51 bags of potatoes, tomatoes, onions, peppers, and herbs grown by local Black farmers to seniors near the old Sun Fresh.',
    outcome: 'Seniors asked for it to keep going, and so did the volunteers.',
    metric: { value: '51', label: 'bags of produce' },
    image: '/photos/hamer-seniors.jpg',
    imageAlt: 'A Defender volunteer packing peppers into Hamer Food Box bags',
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
      'On January 20, more than 100 students at Bishop Ward High School in Kansas City, Kansas walked out against ICE, and Wyandotte High School students joined within minutes. The Defender broke the story. Two weeks later, Lincoln Prep middle schoolers in KCMO walked out despite suspension threats. We were the only outlet there, and the story reached more than 337,000 views.',
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
    title: 'A packed room on America’s nuclear weapons',
    metric: { value: '80%', label: 'of non-nuclear bomb components made in KC' },
    body: [
      'For seventy-seven years, Kansas City has built most of the non-nuclear components in every American nuclear weapon, and most residents do not know it. Black workers like Maurice Copeland handled carcinogens there for decades without being told.',
      'Our investigation ran ahead of the federal government’s visit to Kansas City to ask whether the city consents to building the newest American bomb, including plutonium pit production.',
    ],
    outcome: 'When officials came to Kansas City for the public engagement session, the room was completely packed.',
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
      'B-REAL Academy is the region’s only abolitionist freedom school. Cohort 3 drew 60 applicants for 40 seats, more than half of them high school students.',
      'They graduated around a fire on Sankara Farm, twenty-seven acres of Black-owned land. Students have ranged in age from 10 to 81. Cohort 4 is now underway.',
    ],
    outcome: 'A growing class of young organizers trained in political education and leadership.',
    link: 'https://kansascitydefender.com/education/kansas-citys-black-abolitionist-freedom-school-is-working-and-it-just-graduated-a-new-class-of-organizers/',
    image: `${CDN}/2026/06/11224001/b-real-cohort-3-scaled.jpg`,
  },
];
