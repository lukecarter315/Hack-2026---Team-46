import React from 'react';
import { Plus, X, Clock3 } from 'lucide-react';
import { WEEK_DAYS, formatTime } from './scheduling.js';

export function AvailabilityEditor({ value, onChange }) {
  function add(day) { const existing = value.filter(window => window.day === day); onChange([...value, { id: crypto.randomUUID(), day, start: existing.length ? '17:00' : '09:00', end: existing.length ? '18:00' : '17:00' }]); }
  function update(id, field, time) { onChange(value.map(window => window.id === id ? { ...window, [field]: time } : window)); }
  return <div className="availability-editor">{WEEK_DAYS.map(({ day, label }) => {
    const windows = value.filter(window => window.day === day);
    return <div className="availability-day" key={day}><label className="availability-toggle"><input type="checkbox" aria-label={`Available on ${label}`} checked={!!windows.length} onChange={event => event.target.checked ? add(day) : onChange(value.filter(window => window.day !== day))}/><span>{label}</span></label><div className="availability-windows">{windows.length ? windows.map((window, index) => <div className="availability-window" key={window.id}><input type="time" aria-label={`${label} start time ${index + 1}`} required value={window.start} onInput={event => update(window.id, 'start', event.target.value)} onChange={event => update(window.id, 'start', event.target.value)}/><span>to</span><input type="time" aria-label={`${label} end time ${index + 1}`} required value={window.end} onInput={event => update(window.id, 'end', event.target.value)} onChange={event => update(window.id, 'end', event.target.value)}/><button type="button" className="remove-window" aria-label={`Remove ${label} time ${index + 1}`} onClick={() => onChange(value.filter(item => item.id !== window.id))}><X size={14}/></button></div>) : <span className="day-unavailable">Not available</span>}{windows.length > 0 && <button type="button" className="add-window" aria-label={`Add another ${label} time`} onClick={() => add(day)}><Plus size={13}/>Add time</button>}</div></div>;
  })}</div>;
}

export function AvailabilitySummary({ windows = [], emptyText = 'No availability shared yet.' }) {
  return windows.length ? <div className="availability-summary">{WEEK_DAYS.map(({ day, label }) => { const matching = windows.filter(window => window.day === day).sort((a,b) => a.start.localeCompare(b.start)); return matching.length > 0 && <div key={day}><strong>{label}</strong><span>{matching.map(window => `${formatTime(window.start)}–${formatTime(window.end)}`).join(', ')}</span></div>; })}<p><Clock3 size={12}/>Eastern Time · Repeats weekly</p></div> : <p className="availability-empty">{emptyText}</p>;
}
