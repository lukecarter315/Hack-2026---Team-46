import { interestMatches } from './recommendations.js';
export function normalizeLink(value, kind = 'website') {
  if (!value?.trim()) return '';
  const input = value.trim();
  const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(input) ? input : `https://${input}`);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) throw new Error('Use a valid http or https website address.');
  if (kind === 'linkedin' && url.hostname !== 'linkedin.com' && !url.hostname.endsWith('.linkedin.com')) throw new Error('Use the owner’s LinkedIn profile URL, for example https://www.linkedin.com/in/your-name.');
  return url.href;
}
export function safeLink(value, kind) { try { return normalizeLink(value, kind); } catch { return ''; } }
export function sameInterest(a, b) { return interestMatches(a, b); }
