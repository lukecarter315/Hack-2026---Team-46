import { useEffect, useState } from 'react';
import { DEMO_RESET_EVENT } from './demo-reset.js';
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => { try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; } catch { return initial; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Keep this session usable when storage is unavailable. */ } }, [key, value]);
  useEffect(() => {
    const sync = event => {
      if (event.type === 'storage' && event.key !== key) return;
      try { const saved = localStorage.getItem(key); setValue(saved ? JSON.parse(saved) : initial); } catch {}
    };
    window.addEventListener('storage', sync);
    window.addEventListener(DEMO_RESET_EVENT, sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener(DEMO_RESET_EVENT, sync); };
  }, [key]);
  return [value, setValue];
}
