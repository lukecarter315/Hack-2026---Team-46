// Requested demo connections. Membership is explicit and stays with the club ID,
// even when recommendations, filters or search change the card order.
export const clubDemoConnections = [
  {
    id: 13, name: 'Ian Shang', initials: 'IS', major: 'Mechanical Engineering', year: 'Second year', color: 'sage',
    headline: 'Good designs start with a great team.',
    bio: 'Demo student interested in CAD, vehicle design, and hands-on engineering projects.',
    interests: ['CAD', 'Mechanical Design', 'Manufacturing', 'Coffee'],
    looking: 'Engineering teammates and people to build with', activity: 'Let’s grab coffee and talk about what we’re building.',
    emoji: '⚙️', mutual: true, demo: true, clubIds: ['osu-catalog-19'],
    availability: [{ day: 1, start: '15:00', end: '18:00' }, { day: 3, start: '14:00', end: '17:00' }],
  },
  {
    id: 14, name: 'Zain Merchant', initials: 'ZM', major: 'Mechanical Engineering', year: 'Second year', color: 'lavender',
    headline: 'Build it. Test it. Make it better.',
    bio: 'Demo student interested in off-road vehicles, CAD, and collaborative engineering challenges.',
    interests: ['CAD', 'Engineering', 'Prototyping', 'Off-road vehicle design'],
    looking: 'Hands-on projects and new STEM friends', activity: 'Let’s meet up and swap project ideas.',
    emoji: '🔧', mutual: true, demo: true, clubIds: ['osu-catalog-18'],
    availability: [{ day: 5, start: '13:00', end: '16:00' }, { day: 6, start: '10:00', end: '14:00' }],
  },
];

export function connectionsInClub(club, connections = []) {
  return [...new Map(connections.filter(person => person.clubIds?.includes(club.id)).map(person => [person.id, person])).values()];
}

export function seedClubDemoConnections(storage) {
  const marker = 'bc-club-connections-demo-v1';
  if (storage.getItem(marker)) return;
  const previous = JSON.parse(storage.getItem('cg-network-connections-v1') || '[]');
  const merged = new Map(previous.map(person => [person.id, person]));
  for (const person of clubDemoConnections) merged.set(person.id, person);
  storage.setItem('cg-network-connections-v1', JSON.stringify([...merged.values()]));
  storage.setItem(marker, 'true');
  return true;
}
