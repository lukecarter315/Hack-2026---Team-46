import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, Users, Sparkles, MapPin, X, Check, MessageCircle, CalendarDays, SlidersHorizontal, Send, Compass, Leaf, Bookmark, Clock3 } from 'lucide-react';
import './styles.css';
import { Home, Community } from './community.jsx';
import { FolderHeart, Sprout } from 'lucide-react';
import './ohio-state.css';
import './scarlet.css';
import { ProfileProvider, ProfilePage, useProfile, getInitials, SignedOutScreen } from './profile.jsx';
import { UserRound } from 'lucide-react';
import './finishing-touches.css';
import { MeetingPicker, MeetingSummary } from './meeting-picker.jsx';
import { demoAvailability } from './scheduling.js';
import { demoStudents as students } from './demo-students.js';
import { rankRecommendations, sharedInterests, interestMatches } from './recommendations.js';
import { RecommendationIntro, RecommendationReason } from './recommendation-ui.jsx';
import { useStoredState } from './storage.js';
import './round-improvements.css';
import './polish.css';
import { seedClubDemoConnections } from './club-connections.js';
import { BuckeyeNut } from './buckeye-nut.jsx';
import { NetworkingPreferences } from './network-preferences.jsx';
import { ReceivedInvites } from './received-invites.jsx';
import { isNetworkingOpen, RECEIVED_INVITES_KEY, seedReceivedDemoInvite, acceptIncomingInvite } from './network-invites.js';
import { DEMO_RESET_EVENT } from './demo-reset.js';



function App() {
  const { profile, interests: myInterests, isSignedOut, feedback, recordConnection } = useProfile();
  const initials = getInitials(profile?.name);
  const networkingOpen = isNetworkingOpen(profile);
  const withShared = person => ({ ...person, availability: person.availability || demoAvailability[person.id] || [], shared: sharedInterests(person, myInterests) });
  const [page, setPage] = useState('home');
  const [postingRequest, setPostingRequest] = useState(null);
  const startPost = kind => { setPage(kind); setPostingRequest({ kind, id: crypto.randomUUID() }); };
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState('All students');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [connections, setConnections] = useStoredState('cg-network-connections-v1', []);
  const [pending, setPending] = useStoredState('cg-network-pending-v1', []);
  const [received, setReceived] = useStoredState(RECEIVED_INVITES_KEY, []);
  const receivedInvites = received.filter(invite => !connections.some(person => person.id === invite.person.id));
  const [modal, setModal] = useState(null);
  const [selectedPerson, setSelected] = useState(null);
  const selected = selectedPerson ? withShared(selectedPerson) : null;
  const icebreaker = selected ? selected.shared.length ? `Hey ${selected.name.split(' ')[0]}! I noticed we both like ${selected.shared[0].toLowerCase()}. ${selected.activity}` : `Hey ${selected.name.split(' ')[0]}! I'd love to meet more people on campus. ${selected.activity}` : '';
  const [messages, setMessages] = useStoredState('cg-network-messages-v1', {});
  const [draft, setDraft] = useState('');
  const [meetings, setMeetings] = useStoredState('cg-network-meetings-v1', {});
  const [notice, setNotice] = useState('');
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 3800); return () => clearTimeout(timer); } }, [notice]);
  useEffect(() => { const onKey = e => { if (e.key === 'Escape') setModal(previous => previous === 'schedule' ? 'chat' : null); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  const available = rankRecommendations(students.map(withShared), { profile, interests: myInterests, feedback, kind: 'people' }).filter(s => (filter === 'All students' || s.year === 'First year') && !connections.some(c => c.id === s.id) && !pending.includes(s.id) && !receivedInvites.some(invite => invite.person.id === s.id));
  const student = available[index];
  useEffect(() => { setIndex(0); }, [profile, myInterests.join('|')]);
  const goDiscover = () => { setPage('discover'); setIndex(0); };
  useEffect(() => { const reset = () => { setIndex(0); setFilter('All students'); setModal(null); setSelected(null); setDraft(''); setPage('home'); }; window.addEventListener(DEMO_RESET_EVENT, reset); return () => window.removeEventListener(DEMO_RESET_EVENT, reset); }, []);
  function connect() {
    if (!networkingOpen || !student || student.networkingOpen === false) return;
    recordConnection(student, 'people');
    if (student.mutual) { setConnections(previous => [...previous, student]); setSelected(student); setModal('match'); }
    else { setPending(previous => [...previous, student.id]); setNotice(`Interest sent to ${student.name.split(' ')[0]}. A chat opens if they connect too.`); }
    setIndex(0);
  }
  function acceptInvite(inviteId) {
    const next = acceptIncomingInvite(received, connections, inviteId);
    if (!next.person) return;
    setConnections(next.connections); setReceived(next.invites);
    setPending(previous => previous.filter(id => id !== next.person.id));
    recordConnection(next.person, 'people'); setSelected(next.person); setModal('match');
  }
  function declineInvite(inviteId) { setReceived(previous => previous.filter(invite => invite.id !== inviteId)); setNotice('Invite declined.'); }
  function sendMessage(e) {
    e.preventDefault(); if (!draft.trim()) return;
    setMessages(previous => ({ ...previous, [selected.id]: [...(previous[selected.id] || []), draft.trim()] })); setDraft('');
  }
  function openChat(person) { setSelected(person); setDraft(''); setModal('chat'); }

  if (isSignedOut) return <SignedOutScreen/>;
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage('home')} aria-label="Buckeye Connect home"><span className="brand-icon"><BuckeyeNut/></span><span>buckeye<br/>connect<span className="brand-dot">.</span></span></button>
      <div className="campus-label"><span className="online-dot"/> OHIO STATE · COLUMBUS</div>
      <nav aria-label="Main navigation">
        <button className={page === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('home')}><Compass size={19}/> Home</button>
        <button className={page === 'projects' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('projects')}><FolderHeart size={19}/> Projects</button>
        <button className={page === 'clubs' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('clubs')}><Sprout size={19}/> Clubs</button>
        <button className={page === 'discover' ? 'nav-item active' : 'nav-item'} onClick={goDiscover}><Users size={19}/> Network <span className="small-dot"/></button>
        <button className={page === 'connections' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('connections')}><MessageCircle size={19}/> Connections <span className="nav-count">{connections.length}</span>{receivedInvites.length > 0 && <span className="nav-invite-count">{receivedInvites.length} new</span>}</button>
      </nav>
      <div className="sidebar-note"><span className="note-spark">✳</span><h3>Buckeyes belong<br/>together.</h3><p>A shared interest today.<br/>A familiar face on the Oval tomorrow.</p><div className="little-line"/></div>
      <button className="my-profile" onClick={() => setPage('profile')}><div className="avatar me">{initials}</div><div className="sidebar-profile-copy"><strong>{profile?.name || 'Create profile'}</strong><span>{profile?.major || 'Make it yours'}</span></div><span className="profile-status"/></button>
    </aside>

    <main>
      <header className="topbar"><span>Buckeye Connect <span className="topbar-separator">/</span> <strong>Ohio State</strong></span><div className="top-right"><span className="campus-top-label">BUILT FOR BUCKEYES</span><span className="demo-label">DEMO</span>{receivedInvites.length > 0 && <button className="header-invites-button" onClick={() => setPage('connections')}><Users size={14}/>Invites ({receivedInvites.length})</button>}<button className="header-profile-button" onClick={() => setPage('profile')}>{profile ? <><span className="avatar me small">{initials}</span><span>My profile</span></> : <><UserRound size={15}/><span>Create profile</span></>}</button></div></header>
      <div className="main-content">
        {page === 'profile' && <ProfilePage key={profile?.email || profile?.name || 'new'} onExplore={goDiscover}/>}
        {page === 'home' && <Home onNavigate={destination => destination === 'discover' ? goDiscover() : setPage(destination)} onPost={startPost} onCreateProfile={() => setPage('profile')}/>}
        <div hidden={page !== 'projects'}><Community kind="projects" active={page === 'projects'} createRequest={postingRequest?.kind === 'projects' ? postingRequest.id : null}/></div>
        <div hidden={page !== 'clubs'}><Community kind="clubs" connections={connections} onOpenConnection={openChat} active={page === 'clubs'} createRequest={postingRequest?.kind === 'clubs' ? postingRequest.id : null}/></div>

        {page === 'discover' && <>
          <div className="page-heading"><div><div className="eyebrow"><span/> FIND YOUR BUCKEYE COMMUNITY</div><h1>Meet your people<span className="green-period">.</span></h1><p>A familiar interest. A fresh perspective. Your next campus connection.</p></div><button className="outline-button network-messages-button" onClick={() => setPage('connections')}><MessageCircle size={17}/>Messages & invites ({receivedInvites.length})</button></div>
          <NetworkingPreferences/><RecommendationIntro kind="people" onEditProfile={() => setPage('profile')}/><div className="discovery-layout"><section className="discovery-main" aria-label="Student discovery"><div className="discovery-toolbar"><div className="section-label"><span className="online-dot"/> CURATED FOR YOU</div><button className={filtersOpen ? 'filter-button selected' : 'filter-button'} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><SlidersHorizontal size={15}/> Filters {filter !== 'All students' && <span className="small-dot"/>}</button></div>
            {filtersOpen && <div className="filters"><span>Show me</span>{['All students', 'First year'].map(f => <button key={f} className={filter === f ? 'chip chosen' : 'chip'} onClick={() => { setFilter(f); setIndex(0); }}>{f === 'First year' ? 'Newer students' : f}</button>)}</div>}
            {student ? <article className="student-card" key={student.id}><div className={`profile-cover ${student.color}`}><div className="cover-line line-one"/><div className="cover-line line-two"/><span className="cover-quote">a new face,<br/><em>a little possibility.</em></span><span className="cover-emoji" aria-hidden="true">{student.emoji}</span><span className="campus-badge"><MapPin size={12}/> On your campus</span><div className={`profile-avatar ${student.color}`}>{student.initials}<span className="avatar-flower">✳</span></div></div><div className="profile-content"><div className="name-row"><div><h2>{student.name}</h2><p>{student.major} <span>·</span> {student.year}</p></div><span className="interest-count"><Sparkles size={14}/>{student.shared.length} in common</span></div><h3 className="profile-headline">“{student.headline}”</h3><p className="bio">{student.bio}</p><div className="interest-tags">{student.interests.map(interest => <span className={myInterests.some(mine => interestMatches(mine, interest)) ? 'interest shared' : 'interest'} key={interest}>{myInterests.some(mine => interestMatches(mine, interest)) && <span>✳</span>}{interest}</span>)}</div><RecommendationReason item={student} kind="people"/><div className="looking-for"><span>HOPING TO FIND</span><p><Users size={16}/>{student.looking}</p></div></div><div className="card-footer"><span><span className="tiny-spark">✳</span> Shared interests are just the beginning.</span><Bookmark size={17}/></div></article> : <div className="empty-state"><span className="empty-icon">✳</span><h2>You’ve looked around!</h2><p>{connections.length ? 'Your new connections are waiting. Start a conversation or take another look at the profiles you passed.' : 'Try another filter or take another look at the profiles you passed.'}</p><button className="primary" onClick={() => { setIndex(0); setFilter('All students'); }}>Look again <ArrowRight size={16}/></button></div>}
            {student && <div className="decision-bar"><button className="pass-button" onClick={() => setIndex(index + 1)}><X size={20}/>Pass for now</button><button className="primary connect-button" disabled={!networkingOpen} onClick={connect}>{networkingOpen ? 'Let’s connect' : 'Networking paused'} <ArrowUpRight size={19}/></button></div>}
            <p className="discovery-caption">{student ? `${Math.max(available.length - index, 0)} demo profiles left to discover · Go at your own pace.` : 'Small steps count. A hello is a great start.'}</p>
          </section><aside className="discovery-aside"><div className="why-card"><div className="round-icon"><Sparkles size={21}/></div><h3>Something in common.</h3><p>These students share things you’re into. Because the best icebreaker is something you already love.</p><div className="divider"/><span className="section-label">YOUR INTERESTS</span><div className="my-tags">{myInterests.map(i => <span key={i}>{i}</span>)}</div><span className="demo-footnote">{profile ? 'From your profile · Edit anytime' : 'Choose interests above or create your profile'}</span></div><div className="meetup-card"><span className="handwritten">online → on campus</span><h3>Make room for<br/>a real hello.</h3><p>Once you both connect, suggest a coffee, a study break, or a walk around campus.</p><div className="meetup-bottom"><span>Good company is closer than you think.</span><ArrowUpRight size={26}/></div></div><p className="privacy-note"><Check size={14}/> Chat opens only when you both connect.</p></aside></div>
        </>}

        {page === 'connections' && <><div className="page-heading"><div><div className="eyebrow"><span/> FROM A MATCH TO A HELLO</div><h1>Your connections<span className="green-period">.</span></h1><p>Manage new invites and pick up conversations with your connections.</p></div></div><NetworkingPreferences/><ReceivedInvites invites={receivedInvites} interests={myInterests} onAccept={acceptInvite} onDecline={declineInvite}/><h2 className="your-established-connections">Your connections ({connections.length})</h2>{connections.length ? <div className="connection-grid">{connections.map(withShared).map(person => <button className="connection-card" key={person.id} onClick={() => openChat(person)}><div className={`avatar ${person.color}`}>{person.initials}</div><h2>{person.name}</h2><p>{person.major}</p><div className="interest-tags">{person.shared.map(i => <span className="interest shared" key={i}>{i}</span>)}</div><span className="connection-link">Open conversation <ArrowUpRight size={18}/></span></button>)}</div> : <div className="empty-state"><Users size={36}/><h2>Your next hello starts here.</h2><p>Discover students and connect over something you both love.</p><button className="primary" onClick={goDiscover}>Meet students <ArrowUpRight size={18}/></button></div>}{pending.length > 0 && <p className="pending-note">{pending.length} connection request{pending.length !== 1 ? 's' : ''} awaiting mutual interest.</p>}</>}
        <footer className="page-footer"><span>Buckeye Connect · An independent student project at Ohio State.</span><span>Stay curious. Go Bucks. <Leaf size={13}/></span></footer>
      </div>
    </main>
    {notice && <div className="toast" role="status"><Check size={19}/>{notice}</div>}
    {modal && selected && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setModal(modal === 'schedule' ? 'chat' : null); }}><section className={`modal ${modal === 'chat' ? 'chat-modal' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><button autoFocus className="close-modal" aria-label="Close dialog" onClick={() => setModal(modal === 'schedule' ? 'chat' : null)}><X size={22}/></button>{modal === 'match' ? <div className="match-content"><div className="match-avatars"><div className="avatar me">{initials}</div><span>✳</span><div className={`avatar ${selected.color}`}>{selected.initials}</div></div><div className="eyebrow">A NEW BUCKEYE CONNECTION</div><h2 id="modal-title">The feeling is mutual.</h2><p>You and {selected.name.split(' ')[0]} both want to connect.<br/>{selected.shared.length ? 'Start with something you share.' : 'Start with a little curiosity.'}</p><div className="interest-tags">{selected.shared.map(i => <span key={i} className="interest shared">✳ {i}</span>)}</div><button className="primary" onClick={() => openChat(selected)}>Say hello <MessageCircle size={18}/></button><button className="text-button" onClick={() => setModal(null)}>Keep discovering</button><small>Demo: this profile has simulated mutual interest.</small></div> : modal === 'schedule' ? <><div className="schedule-dialog-header"><h2 id="modal-title">Plan a meetup with {selected.name.split(' ')[0]}</h2><button className="text-button" onClick={() => setModal('chat')}><ArrowLeft size={15}/>Back to conversation</button></div><MeetingPicker key={selected.id} person={selected} meeting={meetings[selected.id]} onSuggest={suggestion => { setMeetings(previous => ({ ...previous, [selected.id]: suggestion })); setModal('chat'); }}/></> : <><div className="chat-header"><div className={`avatar ${selected.color}`}>{selected.initials}</div><div><h2 id="modal-title">{selected.name}</h2><p className={selected.shared.length ? 'shared-trait-line' : ''}>{selected.shared.length ? `You both like ${selected.shared.join(', ')}` : 'A new campus connection'}</p></div></div><div className="chat-body"><div className="chat-intro"><Sparkles size={17}/><span>You connected! A shared interest is a great place to start.</span></div><div className="icebreaker"><span>NEED AN ICEBREAKER?</span><p>“{icebreaker}”</p><button className="text-button" onClick={() => setDraft(icebreaker)}>Use this message <ArrowRight size={14}/></button></div>{(messages[selected.id] || []).map((message, i) => <div className="message" key={i}>{message}</div>)}{meetings[selected.id] && <MeetingSummary meeting={meetings[selected.id]} name={selected.name}/>}</div><button className="primary open-meeting-planner" onClick={() => setModal('schedule')}><CalendarDays size={17}/>{meetings[selected.id] ? 'Reschedule meetup' : 'Suggest a meetup'}</button><form className="message-form" onSubmit={sendMessage}><input aria-label="Message" value={draft} onChange={e => setDraft(e.target.value)} placeholder={`Say hello to ${selected.name.split(' ')[0]}…`}/><button className="send-button" disabled={!draft.trim()} aria-label="Send message"><Send size={18}/></button></form><p className="chat-demo-note">Demo conversation · Messages and suggestions save on this browser.</p></>}</section></div>}
  </div>;
}

try { const seededConnections = seedClubDemoConnections(localStorage); const seededInvite = seedReceivedDemoInvite(localStorage); if (seededConnections || seededInvite) window.dispatchEvent(new Event(DEMO_RESET_EVENT)); } catch { /* Storage may be unavailable in a private browser. */ }

createRoot(document.getElementById('root')).render(<ProfileProvider><App/></ProfileProvider>);
