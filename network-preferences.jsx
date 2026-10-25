import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useProfile } from './profile.jsx';
import { isNetworkingOpen } from './network-invites.js';
import './network-invites.css';

export function NetworkingPreferences() {
  const { profile, saveProfile } = useProfile();
  const [error, setError] = useState('');
  const open = isNetworkingOpen(profile);
  function toggle() {
    if (!profile) return;
    try { saveProfile({ ...profile, networkingOpen: !open }); setError(''); }
    catch (error) { setError(error.message); }
  }
  return <section className={`networking-preferences ${open ? '' : 'networking-paused'}`} aria-label="Networking preferences">
    <div className="network-preference-icon"><Users size={21}/></div>
    <div className="network-preference-copy"><h2>Open to networking</h2><p>{open ? 'New connection invites are welcome. Turn this off whenever you need a break.' : 'Networking is paused. New invites are turned off; existing invites, connections, and chats stay available.'}</p><small>Demo setting · Saved in this browser. Live invite delivery isn’t connected yet.</small>{error && <p role="alert">{error}</p>}</div>
    <button type="button" role="switch" aria-label="Open to networking" aria-checked={open} disabled={!profile} className="networking-switch" onClick={toggle}><span/><strong>{open ? 'On' : 'Off'}</strong></button>
  </section>;
}
