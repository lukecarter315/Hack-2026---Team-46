// Content-based cold-start ranking. Uses profile information, not fabricated usage or popularity.
const aliasGroups = [
  ['Coding', 'Programming', 'Coding Skills', 'Software Development', 'Computer Programming'],
  ['Artificial Intelligence', 'AI'], ['Machine Learning', 'ML'], ['Data Science', 'Data science'],
  ['Climbing', 'Rock Climbing'], ['Gaming', 'Video Games'], ['Volunteering', 'Community Service', 'Service Projects'],
  ['Graphic Design', 'Visual Communication Design'], ['Startups', 'Startup'], ['Open Source', 'Open-Source Software'],
];
export function normalizeTerm(value = '') { return String(value).normalize('NFKC').toLowerCase().replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' '); }
const aliases = new Map(aliasGroups.flatMap(group => group.map(value => [normalizeTerm(value), normalizeTerm(group[0])])));
export function canonicalTerm(value) { const normalized = normalizeTerm(value); return aliases.get(normalized) || normalized; }
export function interestMatches(a, b) { return !!canonicalTerm(a) && canonicalTerm(a) === canonicalTerm(b); }
const topics = [
  ['software', ['coding', 'programming', 'software', 'computer science', 'computer engineering', 'cs', 'cse', 'information systems', 'linux', 'open source', 'embedded software', 'web development', 'coding projects', 'coding skills']],
  ['ai', ['artificial intelligence', 'machine learning', 'data science', 'ai', 'data analytics', 'analytics', 'decision science']],
  ['hardware', ['electrical', 'electronics', 'circuits', 'circuit', 'hardware', 'embedded systems', 'avionics', 'sensors', 'robotics', 'radio', 'power systems']],
  ['mechanical', ['mechanical', 'manufacturing', 'fabrication', 'automotive', 'cad', 'vehicle', 'vehicles', 'race cars', 'materials', 'prototyping', '3d printing']],
  ['engineering', ['engineering', 'engineers', 'robotics', 'hardware', 'aerospace', 'propulsion', 'civil', 'structural', 'chemical', 'industrial']],
  ['aerospace', ['aerospace', 'aviation', 'aircraft', 'aerodynamics', 'astronomy', 'spaceflight', 'rocketry', 'propulsion', 'flight']],
  ['finance', ['finance', 'financial', 'investing', 'investment', 'markets', 'equity', 'portfolio', 'budgeting', 'wealth', 'accounting', 'economics']],
  ['business', ['business', 'consulting', 'entrepreneurship', 'startups', 'product development', 'operations', 'supply chain', 'recruiting']],
  ['marketing', ['marketing', 'branding', 'advertising', 'campaign', 'market research', 'public relations']],
  ['design', ['design', 'art', 'arts', 'photography', 'visual', 'creative', 'digital art', 'storytelling', 'magazine', 'writing']],
  ['health', ['healthcare', 'health', 'nursing', 'medicine', 'medical', 'biomedical', 'prosthetics', 'assistive', 'biomaterials', 'accessibility']],
  ['environment', ['environmental', 'environment', 'sustainability', 'sustainable', 'renewable', 'solar', 'water systems', 'electric vehicles']],
  ['outdoors', ['hiking', 'climbing', 'outdoors', 'outdoor', 'skiing', 'snowboarding', 'cycling', 'mountain biking', 'exploring', 'trails']],
  ['sports', ['sports', 'sport', 'fitness', 'soccer', 'tennis', 'badminton', 'archery', 'water skiing', 'team training', 'racing']],
  ['music', ['music', 'performance', 'dance', 'dancing', 'ballroom', 'latin dance', 'concerts']],
  ['gaming', ['gaming', 'video games', 'game', 'games', 'esports', 'comics', 'comic books', 'pop culture']],
  ['community', ['community', 'social', 'friends', 'coffee', 'culture', 'cultural', 'food', 'cooking', 'conversation', 'mentorship']],
  ['education', ['education', 'teaching', 'mentorship', 'outreach', 'learning', 'tutoring', 'research talks']],
  ['service', ['service', 'volunteering', 'humanitarian', 'accessibility', 'international development', 'outreach']],
  ['research', ['research', 'science', 'experiments', 'research talks']],
];
export function topicsFor(value) {
  const text = ` ${normalizeTerm(value)} `;
  return topics.filter(([, words]) => words.some(word => text.includes(` ${word} `) || text.split(' ').some(token => token.length > 4 && token.startsWith(word) && word.length > 5))).map(([topic]) => topic);
}
function unique(values) { return [...new Map(values.filter(Boolean).map(value => [canonicalTerm(value), value])).values()]; }
function itemTags(item) { return unique([...(item.tags || item.interests || []), ...(item.categoryTags || [])]); }
// Community themes describe the supplied societies, never an inferred student identity.
const communityThemes = { 'osu-catalog-32': ['Black community'], 'osu-catalog-33': ['Hispanic / Latino community'], 'osu-catalog-37': ['Colombian culture'] };
export function profileInterests(profile) { return unique([...(profile?.professionalInterests || []), ...(profile?.casualInterests || []), ...(profile?.additionalInterests || [])]); }
function fieldTopics(item) { return new Set([...itemTags(item), ...(item.categoryTags || []), item.category, item.major].filter(Boolean).flatMap(topicsFor)); }
function overlap(a, b) { return a.filter(value => b.has(value)); }
function availabilityOverlap(mine = [], theirs = []) {
  const mins = time => { const [h,m] = String(time).split(':').map(Number); return h * 60 + m; };
  return mine.some(a => theirs.some(b => a.day === b.day && Math.max(mins(a.start), mins(b.start)) < Math.min(mins(a.end), mins(b.end))));
}
export function sharedInterests(item, interests = []) { return itemTags(item).filter(tag => interests.some(interest => interestMatches(tag, interest))); }
export function eligibleForDiscovery(item) { return !item.legacySample && (!item.status || item.status === 'approved') && (!item.owned || item.status === 'approved'); }

export function rankRecommendations(input, { profile = null, interests = [], feedback = [], kind = 'clubs' } = {}) {
  const items = input.filter(item => eligibleForDiscovery(item) && (kind !== 'people' || item.networkingOpen !== false));
  const explicit = unique([...interests, ...profileInterests(profile), ...(kind === 'clubs' ? profile?.communityInterests || [] : [])]);
  const majorTopics = new Set(topicsFor(profile?.major || ''));
  // Generic 'research/science' alone is too broad to infer someone's field.
  if (majorTopics.size > 1) majorTopics.delete('research');
  const recent = feedback.slice(-20);
  const learned = unique(recent.flatMap(event => event.tags || []));
  const hasSignals = explicit.length > 0 || majorTopics.size > 0 || learned.length > 0;
  const scored = items.map(item => {
    const tags = unique([...itemTags(item), ...(kind === 'clubs' ? communityThemes[item.id] || [] : [])]);
    const shared = tags.filter(tag => explicit.some(interest => interestMatches(tag, interest)));
    const itemTopics = fieldTopics(item);
    const related = explicit.filter(interest => !shared.some(tag => interestMatches(tag, interest)) && topicsFor(interest).some(topic => itemTopics.has(topic)));
    const sameMajor = !!profile?.major && canonicalTerm(profile.major) === canonicalTerm(item.major);
    const majorMatch = overlap([...majorTopics], itemTopics);
    const learnedMatches = sharedInterests(item, learned).filter(tag => !shared.some(match => interestMatches(match, tag)));
    const sameTime = kind === 'people' && availabilityOverlap(profile?.availability, item.availability);
    // Actual overlap always wins. Other signals only break equal-count ties.
    const tieScore = (sameMajor ? 23 : majorMatch.length ? 13 + Math.min(2, majorMatch.length - 1) * 2 : 0) + Math.min(12, related.length * 3) + Math.min(6, learnedMatches.length * 2) + (sameTime && (shared.length || majorMatch.length) ? 2 : 0) + (shared.length ? shared.length / Math.max(tags.length, 1) * 3 : 0);
    const score = shared.length * 1000 + tieScore;
    const reasons = [];
    if (shared.length) reasons.push({ type: 'shared', text: `${shared.length} of your ${explicit.length} selected interests match: ${shared.slice(0,4).join(', ')}${shared.length > 4 ? ` +${shared.length - 4} more` : ''}.` });
    if (sameMajor) reasons.push({ type: 'major', text: `You both study ${profile.major}.` });
    else if (majorMatch.length) reasons.push({ type: 'major', text: `Connected to your major: ${profile.major}.` });
    if (related.length && reasons.length < 2) reasons.push({ type: 'related', text: `Related to your interest in ${related.slice(0,2).join(' and ')}.` });
    if (learnedMatches.length && reasons.length < 2) reasons.push({ type: 'activity', text: `You showed interest in: ${learnedMatches.slice(0,2).join(', ')}.` });
    if (sameTime && reasons.length < 3 && score > 0) reasons.push({ type: 'availability', text: 'Your shared weekly availability overlaps.' });
    if (!reasons.length) reasons.push({ type: 'explore', text: hasSignals ? 'A different direction to explore. Add more interests for closer matches.' : 'An exploratory starting point. Choose a few interests to personalize your suggestions.' });
    return { ...item, shared, recommendation: { score, reasons: reasons.slice(0,3), personalized: score > 0, directMatches: shared.length, selectedCount: explicit.length, mode: hasSignals ? 'personalized' : 'explore' } };
  });
  scored.sort((a,b) => b.recommendation.directMatches - a.recommendation.directMatches || b.recommendation.score - a.recommendation.score || String(a.id).localeCompare(String(b.id), 'en', { numeric: true }));
  if (hasSignals) return scored;
  // With no history or profile, interleave fields instead of pretending the list is personalized.
  const groups = new Map();
  for (const item of scored) { const topic = topicsFor(item.category || item.major || itemTags(item).join(' '))[0] || 'general'; if (!groups.has(topic)) groups.set(topic, []); groups.get(topic).push(item); }
  const result = [];
  while (result.length < scored.length) for (const group of groups.values()) if (group.length) result.push(group.shift());
  return result;
}
