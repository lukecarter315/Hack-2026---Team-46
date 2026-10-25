export const CAMPUS_TIMEZONE = 'America/New_York';
export const WEEK_DAYS = [
  { day: 1, label: 'Monday' }, { day: 2, label: 'Tuesday' }, { day: 3, label: 'Wednesday' },
  { day: 4, label: 'Thursday' }, { day: 5, label: 'Friday' }, { day: 6, label: 'Saturday' }, { day: 0, label: 'Sunday' },
];
export function minutes(time) { const [hours, mins] = time.split(':').map(Number); return hours * 60 + mins; }
export function validTime(time) { return typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time); }
export function validateAvailability(windows) {
  if (!Array.isArray(windows)) return 'Please add valid availability.';
  for (const window of windows) {
    if (!Number.isInteger(window.day) || window.day < 0 || window.day > 6 || !validTime(window.start) || !validTime(window.end)) return 'Choose a start and end time for each availability window.';
    if (minutes(window.end) <= minutes(window.start)) return 'Availability must end after it starts. Split overnight availability across two days.';
  }
  for (const { day, label } of WEEK_DAYS) {
    const sorted = windows.filter(window => window.day === day).sort((a,b) => minutes(a.start) - minutes(b.start));
    for (let i = 1; i < sorted.length; i++) if (minutes(sorted[i].start) < minutes(sorted[i-1].end)) return `${label} has overlapping availability. Please combine or adjust those windows.`;
  }
  return '';
}
export function formatTime(time) { const [hour, min] = time.split(':').map(Number); return `${hour % 12 || 12}:${String(min).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`; }
export function campusNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: CAMPUS_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
export function addDays(date, amount) { const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + amount); return next.toISOString().slice(0,10); }
export function dateLabel(date) { return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); }
export function windowsForDate(windows, date) { const day = new Date(`${date}T12:00:00Z`).getUTCDay(); return (windows || []).filter(window => window.day === day).sort((a,b) => a.start.localeCompare(b.start)); }
export function fitsAvailability(windows, date, time, duration) {
  if (!validTime(time)) return false;
  const start = minutes(time), end = start + Number(duration);
  return windowsForDate(windows, date).some(window => start >= minutes(window.start) && end <= minutes(window.end));
}
export const demoAvailability = {
  1: [{ id: 'p-mon', day: 1, start: '14:00', end: '18:00' }, { id: 'p-wed', day: 3, start: '10:00', end: '12:00' }, { id: 'p-sat', day: 6, start: '11:00', end: '16:00' }],
  2: [{ id: 'j-tue', day: 2, start: '13:00', end: '17:00' }, { id: 'j-thu', day: 4, start: '15:00', end: '19:00' }],
  3: [{ id: 's-mon', day: 1, start: '12:00', end: '16:00' }, { id: 's-fri', day: 5, start: '10:00', end: '15:00' }],
  4: [{ id: 'e-wed', day: 3, start: '16:00', end: '19:00' }, { id: 'e-sun', day: 0, start: '10:00', end: '15:00' }],
  5: [{ id: 'a-mon', day: 1, start: '14:00', end: '18:00' }, { id: 'a-wed', day: 3, start: '10:00', end: '12:00' }],
  6: [{ id: 's-tue', day: 2, start: '13:00', end: '17:00' }, { id: 's-sat', day: 6, start: '12:00', end: '16:00' }],
  7: [{ id: 'n-mon', day: 1, start: '15:00', end: '18:00' }, { id: 'n-thu', day: 4, start: '10:00', end: '13:00' }],
  8: [{ id: 'ab-wed', day: 3, start: '13:00', end: '17:00' }, { id: 'ab-fri', day: 5, start: '11:00', end: '14:00' }],
  9: [{ id: 'c-mon', day: 1, start: '14:00', end: '17:00' }, { id: 'c-sat', day: 6, start: '10:00', end: '13:00' }],
  10: [{ id: 'r-tue', day: 2, start: '14:00', end: '18:00' }, { id: 'r-fri', day: 5, start: '12:00', end: '16:00' }],
  11: [{ id: 'm-mon', day: 1, start: '13:00', end: '17:00' }, { id: 'm-wed', day: 3, start: '11:00', end: '14:00' }],
  12: [{ id: 'd-thu', day: 4, start: '15:00', end: '19:00' }, { id: 'd-sun', day: 0, start: '12:00', end: '16:00' }],
};
