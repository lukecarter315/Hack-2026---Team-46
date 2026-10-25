import React from 'react';
import { Check, X, Users } from 'lucide-react';
import { sharedInterests } from './recommendations.js';
import './network-invites.css';

export function ReceivedInvites({ invites, interests, onAccept, onDecline }) {
  return <section className="received-invites" aria-label="Received connection invites"><div className="invite-section-heading"><div><h2>Received invites <span>{invites.length}</span></h2><p>You choose who gets to connect. Accept an invite to open a conversation.</p></div><Users size={24}/></div>
    {invites.length ? <div className="received-invite-list">{invites.map(invite => {
      const person = invite.person;
      const shared = sharedInterests(person, interests);
      return <article className="received-invite-card" key={invite.id}><div className="invite-person"><span className={`avatar ${person.color}`}>{person.initials}</span><div><h3>{person.name}</h3><p>{person.major} · {person.year}</p><small>{person.demo ? 'Demo invitation' : 'Wants to connect with you'}</small></div></div>{invite.note && <blockquote>{invite.note}</blockquote>}{shared.length > 0 && <div className="interest-tags" aria-label="Shared interests">{shared.map(tag => <span className="interest shared" key={tag}>✳ {tag}</span>)}</div>}<details><summary>View profile</summary><p>{person.bio}</p><div className="interest-tags">{person.interests.map(tag => <span className="interest" key={tag}>{tag}</span>)}</div></details><div className="received-invite-actions"><button className="primary" onClick={() => onAccept(invite.id)}><Check size={16}/>Accept invite</button><button className="outline-button" onClick={() => onDecline(invite.id)}><X size={16}/>Decline</button></div></article>;
    })}</div> : <p className="no-received-invites">No pending invites. New connection requests will appear here when networking is on.</p>}
  </section>;
}
