// The Media-Action Thesis: how the Defender turns readers into organizers.
// Shared content for the visual experiments on /lab.

export const NAME_OPTIONS = [
  {
    group: 'For the whole idea',
    names: [
      { name: 'The Media-Action Thesis', note: 'A conviction, proven by the record.' },
      { name: 'The Organizing Press', note: 'A new category. Not a newspaper with programs, a press that organizes.' },
      { name: 'Media That Moves People', note: 'Plain, and lands with any funder.' },
    ],
  },
  {
    group: 'For the journey',
    names: [
      { name: 'Orbit to Organizer', note: 'From following us to building with us.' },
      { name: 'From Feed to Field', note: 'From scrolling to showing up.' },
      { name: 'Every story has a door to the street', note: 'Each piece points somewhere you can act.' },
    ],
  },
  {
    group: 'For the synergy',
    names: [
      { name: 'The Liberation Loop', note: 'Journalism, mutual aid, and culture feeding each other.' },
      { name: 'Culture Is a Front Door', note: 'The tournament and the cookout bring people in too.' },
      { name: 'Truth, Home, Gravity', note: 'Journalism tells the truth, mutual aid gives a home, culture pulls people close.' },
    ],
  },
];

export const ORBIT_STAGES = [
  {
    id: 'doors',
    ring: 'Many doors',
    title: 'People find us in a lot of ways',
    text: 'Most first meet us through the news: a story on Instagram, an investigation, Liberation Now on YouTube, or The People’s Ballot. Others come through culture, like the Juneteenth basketball tournament or the hip hop and culture content we publish, or through a Free Store distribution in their neighborhood.',
    chips: ['A story on Instagram', 'An investigation', 'Liberation Now', 'The People’s Ballot', 'The basketball tournament', 'Hip hop & culture', 'The Free Store'],
    proof: [{ value: '1M+', label: 'digital impressions a month' }],
  },
  {
    id: 'orbit',
    ring: 'In our orbit',
    title: 'They follow, and they start trusting us',
    text: 'They follow, subscribe, and start getting their news from the Defender. A generation that tuned out of legacy media tunes in here, and stays.',
    chips: ['Follows', 'The newsletter', 'Shares', 'DMs'],
    proof: [{ value: '337K+', label: 'views on one walkout story' }],
  },
  {
    id: 'action',
    ring: 'Called to act',
    title: 'Then a story asks them to move, and they do',
    text: 'When we publish a story with an action attached, readers become participants. They walk out of school, show up to the protest, fill the hearing room, vote with The People’s Ballot, and join the community defense network against ICE. No other media platform in our region does this, or is built to.',
    chips: ['A school walkout', 'A protest', 'A packed hearing', 'The ballot', 'Community defense'],
    proof: [
      { value: '10+', label: 'school districts trained to organize' },
      { value: '100+', label: 'signed up for community defense through one dispatch' },
    ],
  },
  {
    id: 'organized',
    ring: 'Organized',
    title: 'Some build the movement. Many build with us.',
    text: 'Some join the organizations we stand with. Many join the Defender itself, most often through our mutual aid team, and grow into organizers and leaders who make the next story happen.',
    chips: ['Mutual aid orientation', 'Members', 'Organizers', 'Leaders'],
    proof: [
      { value: '50+', label: 'active members' },
      { value: '10', label: 'new Mutual Aid Leaders this year' },
      { value: '10', label: 'Black Student Unions formed from our coverage' },
    ],
  },
];

export const LOOP_NODES = [
  {
    id: 'journalism',
    name: 'Journalism',
    role: 'Tells the truth, and where to act',
    stat: '1M+ impressions a month',
    pillar: 'narrative' as const,
  },
  {
    id: 'mutual-aid',
    name: 'Mutual Aid',
    role: 'Gives people a home and a role',
    stat: '30-member team, 10 new leaders',
    pillar: 'material' as const,
  },
  {
    id: 'culture',
    name: 'Arts & Culture',
    role: 'Pulls people close',
    stat: '500+ at the Juneteenth Cookout',
    pillar: 'cultural' as const,
  },
];

export const LOOP_FLOWS = [
  { from: 'Journalism', to: 'Mutual Aid', text: 'A story about the food desert at 31st & Prospect becomes a seat at mutual aid orientation.' },
  { from: 'Mutual Aid', to: 'Arts & Culture', text: 'Our organizers build the cookout, the Book Club, and the tournament that bring the next people in.' },
  { from: 'Arts & Culture', to: 'Journalism', text: 'The tournament crowd and the cookout crowd start following our reporting, and the loop turns again.' },
];

export const FORK = {
  doors: ['A story on Instagram', 'An investigation', 'Liberation Now', 'The basketball tournament', 'Hip hop & culture'],
  orbit: 'In our orbit',
  orbitNote: '1M+ impressions a month',
  act: 'Called to act',
  actNote: 'A story with an action attached',
  movement: {
    title: 'Into the movement',
    items: ['School walkouts', 'Protests and packed hearings', 'Voting with The People’s Ballot', 'Community defense against ICE', 'Our partner organizations'],
  },
  defender: {
    title: 'Into the Defender',
    steps: ['Mutual aid orientation', 'Member', 'Organizer', 'Leader'],
  },
};

// Composite paths drawn from real Defender programs and stories
export const DOOR_PATHS = [
  {
    id: 'student',
    who: 'A UMKC student',
    door: 'Reads a story on our Instagram',
    steps: [
      'Reads one of our stories on Instagram',
      'DMs the Defender that night',
      'Shows up to mutual aid orientation the next week',
      'Helps lead a People’s Free Store distribution',
    ],
  },
  {
    id: 'high-schooler',
    who: 'A high schooler',
    door: 'Sees our walkout coverage',
    steps: [
      'Sees our coverage of students walking out against ICE',
      'Joins our training on how to organize at school',
      'Organizes a walkout with classmates',
      'Helps start a Black Student Union',
    ],
  },
  {
    id: 'neighbor',
    who: 'A neighbor near 31st & Prospect',
    door: 'Reads the food desert story',
    steps: [
      'Reads our story about the food desert at 31st & Prospect',
      'Picks up a Hamer bag and the farm guide inside',
      'Joins our mutual aid team',
      'Helps lead seeding and harvesting on the Black farms',
    ],
  },
  {
    id: 'hooper',
    who: 'A young brother at the tournament',
    door: 'Plays in the Juneteenth tournament',
    steps: [
      'Plays in the Juneteenth basketball tournament',
      'Starts following our culture and hip hop content',
      'Reads our reporting on Saveion McConnell',
      'Joins the new B-REAL cohort for justice-impacted young Black men',
    ],
  },
  {
    id: 'reader',
    who: 'A longtime reader',
    door: 'Reads the nuclear weapons investigation',
    steps: [
      'Reads our investigation into the nuclear weapons capital of the world',
      'Learns the federal government is asking for public input',
      'Shows up to the public engagement session',
      'Helps pack the room',
    ],
  },
];
