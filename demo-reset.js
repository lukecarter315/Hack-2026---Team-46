export const DEMO_RESET_EVENT = 'bc-demo-history-changed';
export const DEMO_BACKUP_KEY = 'bc-demo-history-backup-v1';
export const emptyDemoHistory = {
  'cg-network-connections-v1': [],
  'cg-network-pending-v1': [],
  'cg-network-received-v1': [],
  'cg-network-messages-v1': {},
  'cg-network-meetings-v1': {},
  'cg-clubs-saved-v1': [],
  'cg-clubs-messages-v1': {},
  'cg-clubs-threads-v1': [],
  'cg-projects-saved-v1': [],
  'cg-projects-messages-v1': {},
  'cg-projects-threads-v1': [],
  'cg-recommendation-feedback-v1': [],
};

export function resetDemoHistory(storage) {
  const previous = Object.fromEntries(Object.keys(emptyDemoHistory).map(key => [key, storage.getItem(key)]));
  storage.setItem(DEMO_BACKUP_KEY, JSON.stringify(previous));
  for (const [key, value] of Object.entries(emptyDemoHistory)) storage.setItem(key, JSON.stringify(value));
}

export function restoreDemoHistory(storage) {
  const previous = JSON.parse(storage.getItem(DEMO_BACKUP_KEY) || 'null');
  if (!previous) return;
  for (const key of Object.keys(emptyDemoHistory)) {
    if (previous[key] == null) storage.removeItem(key);
    else storage.setItem(key, previous[key]);
  }
  storage.removeItem(DEMO_BACKUP_KEY);
}
