import { createDemoProfile } from './demo-profile.js';

export const RECEIVED_INVITES_KEY = 'cg-network-received-v1';
const INVITE_SEED_KEY = 'bc-susheel-invite-demo-v1';
export const susheelDemoPerson = {
  id: 15, name: 'Susheel Vadrevu', initials: 'SV', major: 'Mechanical Engineering',
  year: 'Second year', color: 'peach', demo: true, mutual: true,
  headline: 'A good idea is even better with a teammate.',
  bio: 'Demo student interested in robotics, CAD, and hands-on engineering. Looking to meet other STEM students and find a project to build together.',
  interests: ['CAD', 'Robotics', '3D Printing', 'Prototyping', 'Coffee'],
  looking: 'Engineering friends and hands-on project teammates',
  activity: 'Let’s grab coffee and talk about a project idea.',
  emoji: '⚙️', networkingOpen: true,
  availability: [{ day: 3, start: '14:00', end: '17:00' }, { day: 6, start: '10:00', end: '13:00' }],
};

export function isNetworkingOpen(profile) { return profile?.networkingOpen !== false; }

export function addIncomingInvite({ profile, invites, connections, sender, note = '' }) {
  // Every incoming invite must pass the recipient's preference, even if a UI
  // button was bypassed. Duplicate and already-connected requests are ignored.
  if (!isNetworkingOpen(profile) || sender.networkingOpen === false || connections.some(person => person.id === sender.id) || invites.some(invite => invite.person.id === sender.id)) return invites;
  return [...invites, { id: `invite-${sender.id}`, person: sender, note }];
}

export function acceptIncomingInvite(invites, connections, inviteId) {
  const invite = invites.find(item => item.id === inviteId);
  if (!invite) return { invites, connections, person: null };
  return {
    invites: invites.filter(item => item.person.id !== invite.person.id),
    connections: connections.some(person => person.id === invite.person.id) ? connections : [...connections, invite.person],
    person: invite.person,
  };
}

export function seedReceivedDemoInvite(storage) {
  if (storage.getItem(INVITE_SEED_KEY)) return;
  const profile = JSON.parse(storage.getItem('cg-profile-v1') || 'null') || createDemoProfile();
  if (!isNetworkingOpen(profile)) return;
  const invites = JSON.parse(storage.getItem(RECEIVED_INVITES_KEY) || '[]');
  const connections = JSON.parse(storage.getItem('cg-network-connections-v1') || '[]');
  const next = addIncomingInvite({ profile, invites, connections, sender: susheelDemoPerson, note: 'Hi! I noticed we’re both into hands-on engineering. Want to grab coffee and swap project ideas?' });
  storage.setItem(RECEIVED_INVITES_KEY, JSON.stringify(next));
  storage.setItem(INVITE_SEED_KEY, 'true');
  return true;
}
