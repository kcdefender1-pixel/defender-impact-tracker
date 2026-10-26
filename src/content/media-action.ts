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
    proof: [{ value: '10M+', label: 'views & impressions in 2026' }],
  },
  {
    id: 'orbit',
    ring: 'In our orbit',
    title: 'They follow, and they start trusting us',
    text: 'They follow, subscribe, and start getting their news from the Defender. A generation that tuned out of legacy media tunes in here, and stays.',
    chips: ['Follows', 'The newsletter', 'Shares', 'DMs'],
    proof: [{ value: '474K+', label: 'Instagram views on one walkout story' }],
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

export const FORK = {
  doors: ['A story on Instagram', 'An investigation', 'Liberation Now', 'The basketball tournament', 'Hip hop & culture'],
  orbit: 'In our orbit',
  orbitNote: '10M+ views & impressions in 2026',
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
    id: 'college',
    who: 'A college student',
    door: 'Reads a story on our Instagram',
    steps: [
      'Reads one of our stories on Instagram',
      'DMs the Defender that night',
      'Shows up to mutual aid orientation the next week',
      'Helps lead a People’s Free Store distribution',
    ],
  },
  {
    id: 'high-school',
    who: 'A high school student',
    door: 'Sees our walkout coverage',
    steps: [
      'Sees our coverage of students walking out against ICE',
      'Joins our training on how to organize at school',
      'Organizes a walkout with classmates',
      'Helps start a Black Student Union',
    ],
  },
  {
    id: 'community',
    who: 'A community member',
    door: 'Reads the food desert story',
    steps: [
      'Reads our story about the food desert at 31st & Prospect',
      'Picks up a Hamer bag and the Black farm guide inside',
      'Joins our mutual aid team',
      'Helps lead seeding and harvesting on the Black farms',
    ],
  },
  {
    id: 'organizer',
    who: 'An organizer',
    door: 'Already building a campaign',
    steps: [
      'Launches a campaign in their neighborhood',
      'Sees the Defender in the room when no other outlet shows up',
      'Our coverage brings new people to their next action',
      'Partners with the Defender as their campaign’s media arm',
    ],
  },
  {
    id: 'faith',
    who: 'A faith leader',
    door: 'Watches Black Theology & Black Power',
    steps: [
      'Watches our Black Theology & Black Power series on Liberation Now',
      'Brings the conversation to their congregation',
      'Connects with our partnerships team',
      'Their congregation shows up for mutual aid and the movement',
    ],
  },
  {
    id: 'unsure',
    who: 'Interested, not sure how to help',
    door: 'Has been following quietly',
    steps: [
      'Follows the Defender quietly for months',
      'Sees a post inviting people to a mutual aid orientation',
      'Comes once, just to see what it is',
      'Finds a home, and becomes a member',
    ],
  },
  {
    id: 'youth',
    who: 'Black youth',
    door: 'Comes out to the tournament',
    steps: [
      'Comes out to the Juneteenth basketball tournament',
      'Starts following our culture and hip hop content',
      'Sees young people like them at the center of our reporting',
      'Joins B-REAL Academy, our freedom school',
    ],
  },
];
