import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Check, Clock3 } from 'lucide-react';
import { useProfile } from './profile.jsx';
import { AvailabilitySummary } from './availability.jsx';
import { addDays, campusNow, dateLabel, fitsAvailability, formatTime, minutes, windowsForDate } from './scheduling.js';
import './scheduling.css';

export function MeetingPicker({ person, meeting, onSuggest }) {
  const { profile } = useProfile();
  const today = campusNow().date;
  const [date, setDate] = useState(meeting?.date || addDays(today, 1));
  const [weekStart, setWeekStart] = useState(meeting?.date || today);
  const [time, setTime] = useState(meeting?.time || '14:00');
  const [duration, setDuration] = useState(meeting?.duration || 30);
  const [location, setLocation] = useState(meeting?.location || 'Campus café');
  const [error, setError] = useState('');
  const [outsideConsent, setOutsideConsent] = useState(false);
  const theirs = person.availability || [];
  const mine = profile?.availability || [];
  const daily = windowsForDate(theirs, date);
  const fitsThem = fitsAvailability(theirs, date, time, duration);
  const fitsMe = fitsAvailability(mine, date, time, duration);
  const outside = (theirs.length > 0 && !fitsThem) || (mine.length > 0 && !fitsMe);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  function changeDate(next) { if (!next) return; setDate(next); setOutsideConsent(false); setError(''); }
  function submit(event) {
    event.preventDefault();
    const now = campusNow();
    if (!date || !time || `${date}T${time}` <= `${now.date}T${now.time}`) { setError('Choose a date and time in the future.'); return; }
    if (minutes(time) + Number(duration) > 1440) { setError('This meeting crosses midnight. Choose an earlier start time.'); return; }
    if (!location.trim()) { setError('Add a public meeting place.'); return; }
    if (outside && !outsideConsent) { setError('Choose a time within availability, or confirm you want to suggest an alternative.'); return; }
    onSuggest({ date, time, duration: Number(duration), location: location.trim(), timeZone: 'America/New_York', outsideAvailability: outside }); setError('');
  }
  return <form className="meeting-planner" onSubmit={submit}><div className="meeting-planner-heading"><CalendarDays size={18}/><div><h3>Take it off the screen</h3><p>Pick any date and time. The other person confirms.</p></div></div><details className="person-availability" open><summary>{person.name.split(' ')[0]}’s weekly availability</summary><AvailabilitySummary windows={theirs}/><span className="availability-demo-label">Sample availability for this demo profile</span></details>
    <div className="calendar-strip-heading"><span>Choose a day</span><div><button type="button" aria-label="Previous 7 days" disabled={weekStart <= today} onClick={() => setWeekStart(previous => addDays(previous, -7) < today ? today : addDays(previous, -7))}><ChevronLeft size={16}/></button><button type="button" aria-label="Next 7 days" onClick={() => setWeekStart(previous => addDays(previous, 7))}><ChevronRight size={16}/></button></div></div><div className="calendar-strip">{days.map(day => { const dayDate = new Date(`${day}T12:00:00Z`); const hasAvailability = windowsForDate(theirs, day).length > 0; return <button type="button" key={day} className={`${date === day ? 'calendar-day selected-day' : 'calendar-day'}`} aria-label={dateLabel(day)} aria-pressed={date === day} onClick={() => changeDate(day)}><span>{dayDate.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' })}</span><strong>{dayDate.getUTCDate()}</strong><i className={hasAvailability ? 'has-availability' : ''}/></button>; })}</div><p className="calendar-legend"><i/>Shared availability · All times Eastern</p>
    <div className="meeting-fields"><label htmlFor={`meet-date-${person.id}`}>Date<input id={`meet-date-${person.id}`} type="date" required min={today} value={date} onInput={event => { changeDate(event.target.value); if (event.target.value) setWeekStart(event.target.value); }} onChange={event => { changeDate(event.target.value); if (event.target.value) setWeekStart(event.target.value); }}/></label><label htmlFor={`meet-time-${person.id}`}>Start time<input id={`meet-time-${person.id}`} type="time" required value={time} onInput={event => { setTime(event.target.value); setOutsideConsent(false); setError(''); }} onChange={event => { setTime(event.target.value); setOutsideConsent(false); setError(''); }}/></label><label htmlFor={`meet-duration-${person.id}`}>Duration<select id={`meet-duration-${person.id}`} value={duration} onChange={event => { setDuration(Number(event.target.value)); setOutsideConsent(false); }}>{[15,30,45,60,90,120].map(value => <option key={value} value={value}>{value} minutes</option>)}</select></label></div>
    <div className="selected-day-availability"><strong>{dateLabel(date)}</strong><p>{daily.length ? `${person.name.split(' ')[0]} is available ${daily.map(window => `${formatTime(window.start)}–${formatTime(window.end)}`).join(', ')}.` : 'No availability shared for this day. You can suggest an alternative.'}</p>{daily.length > 0 && <div className="available-starts">{daily.filter(window => minutes(window.end) - minutes(window.start) >= Number(duration)).map(window => <button type="button" key={window.id} onClick={() => { setTime(window.start); setOutsideConsent(false); setError(''); }}>Use {formatTime(window.start)}</button>)}</div>}
      {theirs.length > 0 && <span className={fitsThem ? 'availability-check fits' : 'availability-check'}><Check size={13}/>{fitsThem ? 'Fits their availability' : 'Outside their shared availability'}</span>}{mine.length > 0 && <span className={fitsMe ? 'availability-check fits' : 'availability-check'}><Clock3 size={13}/>{fitsMe ? 'Fits your availability' : 'Outside your saved availability'}</span>}
    </div>
    <label className="meeting-location" htmlFor={`meet-place-${person.id}`}>Public meeting place<input id={`meet-place-${person.id}`} required maxLength={120} value={location} onChange={event => setLocation(event.target.value)} placeholder="e.g. Ohio Union lounge"/></label>{outside && <label className="outside-consent"><input type="checkbox" checked={outsideConsent} onChange={event => { setOutsideConsent(event.target.checked); setError(''); }}/>Suggest this alternative even though it’s outside shared availability.</label>}{error && <p className="meeting-error" role="alert">{error}</p>}<button type="submit" className="primary suggest-meeting">{meeting ? 'Reschedule meetup' : 'Suggest meetup'}<CalendarDays size={15}/></button>{meeting && <p className="planner-saved" role="status">Suggestion sent: {dateLabel(meeting.date)}, {formatTime(meeting.time)} Eastern · Awaiting {person.name.split(' ')[0]}’s confirmation.</p>}<p className="meeting-disclaimer">Weekly availability is a preference, not a booking. Calendar sync isn’t connected.</p>
  </form>;
}

export function MeetingSummary({ meeting, name }) { return <div className="meeting-message"><CalendarDays size={20}/><div><strong>Meetup suggestion sent</strong><p>{dateLabel(meeting.date)} · {formatTime(meeting.time)} Eastern</p><p>{meeting.duration} minutes · {meeting.location}</p>{meeting.outsideAvailability && <span>Alternative time outside shared availability · </span>}<span>Awaiting confirmation from {name.split(' ')[0]}</span></div></div>; }
