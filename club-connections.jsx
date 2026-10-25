import React from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { connectionsInClub } from './club-connections.js';
import './club-connections.css';

export function ClubConnections({ club, connections, onMessage }) {
  const mutuals = connectionsInClub(club, connections);
  if (!mutuals.length) return null;
  const first = mutuals[0];
  const names = mutuals.length === 1 ? first.name : mutuals.length === 2 ? `${first.name} and ${mutuals[1].name}` : `${first.name} and ${mutuals.length - 1} others`;
  return <section className="club-connections" aria-label="Connections in this club">
    <div className="club-connection-avatars" aria-hidden="true">{mutuals.slice(0, 3).map(person => <span key={person.id} className={`avatar ${person.color}`}>{person.initials}</span>)}</div>
    <div className="club-connection-copy"><span><Users size={12}/>{mutuals.length} connection{mutuals.length === 1 ? '' : 's'} in this club</span><p><strong>{names}</strong> {mutuals.length === 1 ? 'is a member' : 'are members'}.</p>{mutuals.every(person => person.demo) && <small>Demo membership</small>}</div>
    {onMessage && <button type="button" className="text-button" onClick={() => onMessage(first)} aria-label={`Message ${first.name}`}><MessageCircle size={15}/>Say hello</button>}
  </section>;
}
