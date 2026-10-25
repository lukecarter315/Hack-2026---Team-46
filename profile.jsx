import React, { createContext, useContext, useEffect, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Coffee, Pencil, Save, Sparkles, UserRound, Check } from 'lucide-react';
import './profile.css';
import { AvailabilityEditor, AvailabilitySummary } from './availability.jsx';
import { validateAvailability, CAMPUS_TIMEZONE } from './scheduling.js';
import clubCatalog from './club-catalog.json';
import { SearchAdd } from './discovery-controls.jsx';
import { LogOut } from 'lucide-react';
import { useStoredState } from './storage.js';
import { canonicalTerm, profileInterests } from './recommendations.js';
import { NetworkingPreferences } from './network-preferences.jsx';
import { createDemoProfile } from './demo-profile.js';

const ProfileContext = createContext(null);
const baseProfessionalChoices = ['Coding', 'Design', 'Engineering', 'Research', 'Business', 'Entrepreneurship', 'Marketing', 'Finance', 'Healthcare', 'Sustainability', 'Data science', 'Education', 'Writing', 'Side projects'];
const baseCasualChoices = ['Hiking', 'Photography', 'Coffee', 'Music', 'Art', 'Cooking', 'Climbing', 'Gaming', 'Board games', 'Sports', 'Fitness', 'Reading', 'Movies', 'Travel', 'Volunteering', 'Exploring'];

const casualCategories = new Set(['Gaming', 'International Affairs', 'Culture', 'Arts', 'Soccer', 'Skiing', 'Climbing', 'Cycling', 'Tennis', 'Badminton', 'Dance', 'Archery', 'Water Sports', 'Reading']);
const sourceInterests = (club, type) => [...(club[`${type}Interests`] || []), ...club.tags.filter(tag => !(club.professionalInterests || []).includes(tag) && !(club.casualInterests || []).includes(tag) && ((type === 'casual') === casualCategories.has(club.category)))];
const professionalChoices = [...new Set([...baseProfessionalChoices, ...clubCatalog.flatMap(club => sourceInterests(club, 'professional'))])].sort();
const casualChoices = [...new Set([...baseCasualChoices, ...clubCatalog.flatMap(club => sourceInterests(club, 'casual'))])].sort();
const interestOptions = [...new Set([...professionalChoices, ...casualChoices])].sort();
const communityOptions = ['Black community', 'Hispanic / Latino community', 'Colombian culture'];

export function getInitials(name) { return name?.trim().split(/\s+/).slice(0, 2).map(part => Array.from(part)[0]).join('').toUpperCase() || 'YO'; }

export function ProfileProvider({ children }) {
  const [starterInterests, setStarterInterests] = useStoredState('cg-starter-interests-v1', []);
  const [feedback, setFeedback] = useStoredState('cg-recommendation-feedback-v1', []);
  const [isSignedOut, setSignedOut] = useState(() => { try { return localStorage.getItem('cg-signed-out') === 'true'; } catch { return false; } });
  const [profile, setProfile] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cg-profile-v1') || 'null');
      if (!stored) { const demo = createDemoProfile(); localStorage.setItem('cg-profile-v1', JSON.stringify(demo)); return demo; }
      return stored && typeof stored.name === 'string' && typeof stored.major === 'string' && typeof stored.bio === 'string' && Array.isArray(stored.professionalInterests) && Array.isArray(stored.casualInterests) && [...stored.professionalInterests, ...stored.casualInterests].every(item => typeof item === 'string') ? { ...stored, email: typeof stored.email === 'string' ? stored.email : '', availability: Array.isArray(stored.availability) && !validateAvailability(stored.availability) ? stored.availability.map((window, index) => ({ ...window, id: window.id || `saved-${index}` })) : [], timeZone: CAMPUS_TIMEZONE, additionalInterests: (Array.isArray(stored.additionalInterests) ? stored.additionalInterests : Array.isArray(stored.interestedClubs) ? stored.interestedClubs : []).filter(value => typeof value === 'string'), ethnicity: typeof stored.ethnicity === 'string' ? stored.ethnicity : '', communityInterests: Array.isArray(stored.communityInterests) ? stored.communityInterests.filter(value => typeof value === 'string') : [] } : null;
    } catch { return null; }
  });
  useEffect(() => { const handleStorage = event => { if (event.key === 'cg-signed-out') setSignedOut(event.newValue === 'true'); if (event.key === 'cg-profile-v1' && event.newValue) { try { const next = JSON.parse(event.newValue); if (next && Array.isArray(next.professionalInterests) && Array.isArray(next.casualInterests)) setProfile(next); } catch {} } }; window.addEventListener('storage', handleStorage); return () => window.removeEventListener('storage', handleStorage); }, []);
  function saveProfile(next) {
    // Save before changing UI state so a storage failure leaves the form intact.
    try { localStorage.setItem('cg-profile-v1', JSON.stringify(next)); }
    catch { throw new Error('Your browser couldn’t save this profile. Please allow local storage and try again.'); }
    setProfile(next); setSignedOut(false);
    try { localStorage.removeItem('cg-signed-out'); } catch {}
  }
  function loadDemoProfile() {
    if (profile && !profile.demo) { try { localStorage.setItem('cg-profile-before-demo-v1', JSON.stringify(profile)); } catch {} }
    saveProfile(createDemoProfile());
  }
  function signOut() { setSignedOut(true); try { localStorage.setItem('cg-signed-out', 'true'); } catch {} }
  function resumeProfile() { setSignedOut(false); try { localStorage.removeItem('cg-signed-out'); } catch {} }
  function recordConnection(item, kind) {
    if (!item) return;
    const entry = { itemId: item.id, kind, tags: item.tags || item.interests || [], at: new Date().toISOString() };
    setFeedback(previous => [...previous.filter(event => !(event.itemId === entry.itemId && event.kind === kind)), entry].slice(-30));
  }
  const interests = [...new Map((profile ? profileInterests(profile) : starterInterests).map(value => [canonicalTerm(value), value])).values()];
  return <ProfileContext.Provider value={{ profile, saveProfile, loadDemoProfile, interests, signOut, resumeProfile, isSignedOut, starterInterests, setStarterInterests, feedback, recordConnection }}>{children}</ProfileContext.Provider>;
}

export function useProfile() { return useContext(ProfileContext); }

export function ProfilePage({ onExplore }) {
  const { profile, saveProfile, loadDemoProfile, signOut, starterInterests } = useProfile();
  const [editing, setEditing] = useState(!profile);
  const [name, setName] = useState(profile?.name || '');
  const [major, setMajor] = useState(profile?.major || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [availability, setAvailability] = useState(profile?.availability || []);
  const [professional, setProfessional] = useState(profile?.professionalInterests || starterInterests.filter(value => professionalChoices.includes(value)));
  const [casual, setCasual] = useState(profile?.casualInterests || starterInterests.filter(value => !professionalChoices.includes(value)));
  const [additionalInterests, setAdditionalInterests] = useState(profile?.additionalInterests || []);
  const [ethnicity, setEthnicity] = useState(profile?.ethnicity || '');
  const [communityInterests, setCommunityInterests] = useState(profile?.communityInterests || []);
  const [interestQuery, setInterestQuery] = useState('');
  const [customType, setCustomType] = useState('casual');
  const [error, setError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const preview = editing ? { name, major, bio, email, availability, professionalInterests: professional, casualInterests: casual, additionalInterests } : profile;
  const count = profileInterests({ professionalInterests: professional, casualInterests: casual, additionalInterests }).length;
  function toggle(value, setter) { setter(previous => previous.includes(value) ? previous.filter(item => item !== value) : [...previous, value]); setError(''); }
  function addCustomInterest() {
    const clean = interestQuery.trim(); if (!clean) return;
    if ([...professional, ...casual].some(value => value.toLowerCase() === clean.toLowerCase())) { setInterestQuery(''); return; }
    const canonical = [...professionalChoices, ...casualChoices].find(value => value.toLowerCase() === clean.toLowerCase()) || clean;
    (customType === 'professional' ? setProfessional : setCasual)(previous => [...previous, canonical]); setInterestQuery(''); setError('');
  }
  function submit(event) {
    event.preventDefault();
    if (!name.trim() || !major.trim()) { setError('Please add your name and college major.'); return; }
    if (!/^[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+edu$/i.test(email.trim())) { setError('Enter a valid college email ending in .edu (for example, name@osu.edu).'); return; }
    const availabilityError = validateAvailability(availability);
    if (availabilityError) { setError(availabilityError); return; }
    if (!count) { setError('Choose or type at least one interest.'); return; }
    try {
      saveProfile({ name: name.trim(), major: major.trim(), bio: bio.trim(), year: profile?.year, networkingOpen: profile?.networkingOpen !== false, demo: profile?.demo && name.trim() === 'Jonathan Vuppu', additionalInterests, ethnicity: ethnicity.trim(), communityInterests, email: email.trim(), availability, timeZone: CAMPUS_TIMEZONE, professionalInterests: professional, casualInterests: casual });
      setEditing(false); setError(''); setSavedNotice(true); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (saveError) { setError(saveError.message); }
  }
  function cancel() { setName(profile.name); setMajor(profile.major); setBio(profile.bio); setEmail(profile.email || ''); setAvailability(profile.availability || []); setProfessional(profile.professionalInterests); setCasual(profile.casualInterests); setAdditionalInterests(profile.additionalInterests || []); setEthnicity(profile.ethnicity || ''); setCommunityInterests(profile.communityInterests || []); setError(''); setEditing(false); }
  function beginEdit() { setName(profile.name); setMajor(profile.major); setBio(profile.bio); setEmail(profile.email || ''); setAvailability(profile.availability || []); setProfessional(profile.professionalInterests); setCasual(profile.casualInterests); setAdditionalInterests(profile.additionalInterests || []); setEthnicity(profile.ethnicity || ''); setCommunityInterests(profile.communityInterests || []); setSavedNotice(false); setEditing(true); }
  return <>
    <div className="page-heading"><div><div className="eyebrow"><span/> A LITTLE ABOUT YOU. A LOT TO CONNECT OVER.</div><h1>{editing ? profile ? 'Make it more you' : 'Create your profile' : 'Your Buckeye profile'}<span className="green-period">.</span></h1><p>{editing ? 'Tell campus who you are and what sparks your curiosity.' : 'Your interests help you discover people, projects, and clubs.'}</p></div><UserRound className="profile-heading-icon" size={49}/></div>
    {savedNotice && <div className="profile-save-notice" role="status"><Check size={18}/>Profile saved. Discovery now uses your interests.</div>}
    <div className="profile-layout">
      {editing ? <form className="profile-form" onSubmit={submit}>
        <section className="profile-form-section"><span className="section-label">01 / THE INTRODUCTION</span><h2>Start with the basics.</h2><div className="profile-basics"><label htmlFor="profile-name">Your name <span>Required</span><input id="profile-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} required maxLength={80} placeholder="What should we call you?"/></label><label htmlFor="profile-major">College major <span>Required</span><input id="profile-major" value={major} onChange={event => setMajor(event.target.value)} required maxLength={120} placeholder="e.g. Computer Science or Undecided"/></label></div></section>
        <NetworkingPreferences/><section className="profile-form-section profile-email-section"><label htmlFor="profile-email">College .edu email <span>Required · Private</span><input id="profile-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="name@osu.edu" aria-describedby="profile-email-help"/></label><p id="profile-email-help">Use an address ending in .edu. Saved privately in this browser; email verification isn’t connected yet.</p></section>
        <section className="profile-form-section"><span className="section-label">02 / YOUR INTERESTS</span><h2>What are you into?</h2><p>Select as many as you like. Choose at least one across either group.</p><div className="interest-search-controls"><label htmlFor="interest-search">Search or add your own interest<input id="interest-search" value={interestQuery} maxLength={100} onChange={event => setInterestQuery(event.target.value)} placeholder="Try robotics, consulting, skiing, or something new" onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addCustomInterest(); } }}/></label><div className="custom-interest-actions"><select aria-label="Custom interest type" value={customType} onChange={event => setCustomType(event.target.value)}><option value="casual">Casual interest</option><option value="professional">Professional interest</option></select><button className="outline-button" type="button" disabled={!interestQuery.trim()} onClick={addCustomInterest}>Add interest</button></div><p>Search {professionalChoices.length + casualChoices.length} options, or add your own. Selected interests stay below.</p></div><fieldset className="profile-interest-group"><legend><BriefcaseBusiness size={17}/> Professional interests</legend><p>Things you want to learn, build, or pursue.</p><div className="profile-interest-options">{[...new Set([...professionalChoices, ...professional])].filter(interest => !interestQuery || interest.toLowerCase().includes(interestQuery.trim().toLowerCase())).slice(0, interestQuery ? 35 : 18).map(interest => <InterestChoice key={interest} interest={interest} checked={professional.includes(interest)} onChange={() => toggle(interest, setProfessional)}/>)}</div></fieldset><fieldset className="profile-interest-group"><legend><Coffee size={17}/> Casual interests</legend><p>The things that make your free time feel like you.</p><div className="profile-interest-options">{[...new Set([...casualChoices, ...casual])].filter(interest => !interestQuery || interest.toLowerCase().includes(interestQuery.trim().toLowerCase())).slice(0, interestQuery ? 35 : 18).map(interest => <InterestChoice key={interest} interest={interest} checked={casual.includes(interest)} onChange={() => toggle(interest, setCasual)}/>)}</div></fieldset><div className="profile-all-selected">{[...new Set([...professional, ...casual])].map(interest => <button type="button" key={interest} aria-label={`Remove interest ${interest}`} onClick={() => { setProfessional(values => values.filter(value => value !== interest)); setCasual(values => values.filter(value => value !== interest)); }}>{interest} ×</button>)}</div><SearchAdd label="Interests" placeholder="Type any interest, or choose a suggestion" options={interestOptions} values={additionalInterests} onChange={setAdditionalInterests}/><p className="club-interest-note">Your own words are welcome. Press Enter to add an interest. Each distinct interest counts once when finding matches.</p><p className="selected-count" aria-live="polite">{count} interest{count === 1 ? '' : 's'} selected</p></section>
        <section className="profile-form-section"><h2>Background & communities</h2><label htmlFor="profile-ethnicity">Ethnicity <span>Optional · Private</span><input id="profile-ethnicity" value={ethnicity} onChange={event => setEthnicity(event.target.value)} maxLength={120} placeholder="Describe your background in your own words"/></label><p>You can leave this blank. Your ethnicity is saved privately in this browser and does not automatically change recommendations.</p><SearchAdd label="Cultural communities you’d like to explore" placeholder="Choose a community or type your own" options={communityOptions} values={communityInterests} onChange={setCommunityInterests}/><p>These optional choices help suggest cultural societies in Clubs. They are open interests, not membership requirements, and do not affect Network or Projects.</p></section>
        <section className="profile-form-section"><span className="section-label">03 / A LITTLE PERSONALITY</span><h2>Say a little more.</h2><label htmlFor="profile-bio">Bio <span>Optional</span><textarea id="profile-bio" rows={4} maxLength={500} value={bio} onChange={event => setBio(event.target.value)} placeholder="What do you love? What would you like to try? Give someone a reason to say hello." aria-describedby="bio-counter"/></label><p className="bio-counter" id="bio-counter">{bio.length}/500 characters</p></section>
        <section className="profile-form-section"><span className="section-label">04 / MAKE TIME TO CONNECT</span><h2>When are you usually free?</h2><p>Optional. Choose weekly windows when you’re open to meeting. Add multiple times per day. All times are Eastern (Ohio State).</p><AvailabilityEditor value={availability} onChange={next => { setAvailability(next); setError(''); }}/><p className="availability-editor-note">Only these availability windows will be shown to a connection, not your full calendar. You can change them anytime.</p></section>
        {error && <p className="profile-form-error" role="alert">{error}</p>}<div className="profile-form-actions"><button className="primary" type="submit"><Save size={17}/>{profile ? 'Save changes' : 'Create profile'}</button>{profile && <><button className="outline-button" type="button" onClick={cancel}>Cancel</button><button className="sign-out-button" type="button" onClick={signOut}><LogOut size={15}/>Sign out</button></>}</div><p className="profile-storage-note">Saved on this browser. Your profile isn’t shared with other students yet.</p>
      </form> : <section className="profile-summary-panel"><div className="round-icon"><Sparkles size={23}/></div><h2>Nice to meet you, {profile.name.split(/\s+/)[0]}.</h2><p>Your profile is ready. We’ll highlight shared interests in Network and bring relevant projects and clubs closer to you.</p><NetworkingPreferences/><div className="profile-summary-actions"><button className="primary" onClick={onExplore}>Explore Network <ArrowUpRight size={17}/></button><button className="outline-button" onClick={beginEdit}><Pencil size={15}/>Edit profile</button><button className="text-button" onClick={() => { loadDemoProfile(); setEditing(false); }}>Load Jonathan demo</button></div><div className="profile-summary-email"><strong>Your college email</strong><p>{profile.email || 'Add your .edu email in Edit profile'}</p><small>{profile.demo ? 'Demo address · Not a real student email' : 'Private · Not verified'}</small></div><div className="profile-summary-availability"><h3>Interests</h3><div className="interest-tags">{profileInterests(profile).map(name => <span className="interest" key={name}>{name}</span>)}</div>{!profileInterests(profile).length && <p className="availability-empty">Add interests in Edit profile, using suggestions or your own words.</p>}</div><div className="profile-summary-availability"><h3>Your weekly availability</h3><AvailabilitySummary windows={profile.availability || []}/></div><button type="button" className="sign-out-button" onClick={signOut}><LogOut size={16}/>Sign out</button><div className="profile-summary-tip"><BriefcaseBusiness size={18}/><p>Interests change. You can come back and update your profile anytime.</p></div><p className="profile-storage-note">Saved on this browser. Your profile isn’t shared with other students yet.</p></section>}
      <aside className="profile-preview"><span className="profile-preview-label">{editing ? 'YOUR PROFILE · LIVE PREVIEW' : 'YOUR PROFILE'}</span><article className="own-profile-card"><div className="own-profile-cover"><span>BUILT FOR BUCKEYES</span><span aria-hidden="true">✳</span></div><div className="own-profile-content"><div className="own-profile-avatar">{getInitials(preview.name)}</div><h2>{preview.name.trim() || 'Your name'}</h2><p className="own-profile-major">{preview.major.trim() || 'Your college major'}</p>{preview.bio.trim() ? <p className="own-profile-bio">{preview.bio}</p> : <p className="own-profile-placeholder">A little about you goes a long way.</p>}<PreviewInterests label="PROFESSIONAL" values={preview.professionalInterests}/><PreviewInterests label="CASUAL" values={preview.casualInterests}/><PreviewInterests label="INTERESTS" values={preview.additionalInterests || []}/>{!profileInterests(preview).length && <p className="own-profile-placeholder">Your interests will appear here.</p>}</div></article><p className="profile-preview-hint"><Sparkles size={15}/>Shared interests are just the beginning.</p></aside>
    </div>
  </>;
}

function InterestChoice({ interest, checked, onChange }) { return <label className={`profile-interest-choice ${checked ? 'is-checked' : ''}`}><input type="checkbox" checked={checked} onChange={onChange}/><span>{checked && <Check size={13}/>} {interest}</span></label>; }
function PreviewInterests({ label, values }) { return values.length > 0 && <div className="own-profile-interests"><span>{label}</span><div className="interest-tags">{values.map(value => <span key={value} className="interest shared">{value}</span>)}</div></div>; }

export function SignedOutScreen() { const { resumeProfile } = useProfile(); return <div className="signed-out-screen"><section><LogOut size={35}/><h1>You’re signed out.</h1><p>Your saved profile and conversations stay on this browser. They’re hidden until you resume this local demo.</p><button className="primary" onClick={resumeProfile}>Resume saved profile <ArrowUpRight size={17}/></button><small>This prototype uses local profiles, not authenticated accounts.</small></section></div>; }
