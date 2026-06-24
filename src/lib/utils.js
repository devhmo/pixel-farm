import { PIXEL_INTERVAL, IP_APIS } from './constants';

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateId(prefix = 'acc') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function getAccountTimeLeftMs(account) {
  if (!account) return Infinity;
  const currentPixels = Number(account.currentPixels) || 0;
  const capacity = Number(account.capacity) || 0;
  if (capacity <= 0) return Infinity;
  if (currentPixels >= capacity) return 0;
  const remainingPixels = capacity - currentPixels;
  const startTime = account.startTime || Date.now();
  const timeSinceLastPixel = (Date.now() - startTime) % PIXEL_INTERVAL;
  return (remainingPixels * PIXEL_INTERVAL) - timeSinceLastPixel;
}

export function getItemTimeLeftMs(item) {
  if (item.type === 'account') return getAccountTimeLeftMs(item);
  if (item.type === 'folder') {
    const accounts = item.accounts || [];
    if (accounts.length === 0) return Infinity;
    return Math.min(...accounts.map(acc => getAccountTimeLeftMs(acc)));
  }
  return Infinity;
}

export function getNextCompletingAccount(accounts) {
  if (!accounts || accounts.length === 0) return null;
  let nextUp = null;
  let minTime = Infinity;
  for (const acc of accounts) {
    const cp = Number(acc.currentPixels) || 0;
    const cap = Number(acc.capacity) || 0;
    if (cap > 0 && cp >= cap) continue;
    const timeLeft = getAccountTimeLeftMs(acc);
    if (timeLeft < minTime) { minTime = timeLeft; nextUp = acc; }
  }
  return nextUp;
}

export function formatTimeLeft(ms) {
  if (ms <= 0) return 'Done';
  if (ms === Infinity) return 'N/A';
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  const pad = (num) => num.toString().padStart(2, '0');
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatFinishTime(date, lang = 'en') {
  if (!date) return '';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + 7);
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'ru' ? 'ru-RU' : lang === 'pt-br' ? 'pt-BR' : 'en-US';
  const timeFormat = { hour: 'numeric', minute: 'numeric', hour12: lang !== 'ru' };

  if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
    return date.toLocaleTimeString(locale, timeFormat);
  }
  if (date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()) {
    const labels = { ar: 'غداً', ru: 'Завтра', 'pt-br': 'Amanhã', en: 'Tomorrow' };
    return `${labels[lang] || 'Tomorrow'}, ${date.toLocaleTimeString(locale, timeFormat)}`;
  }
  if (date > tomorrow && date < endOfWeek) {
    return `${date.toLocaleDateString(locale, { weekday: 'long' })}, ${date.toLocaleTimeString(locale, timeFormat)}`;
  }
  return `${date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString(locale, timeFormat)}`;
}

export function formatCompletedTime(timestamp, lang = 'en') {
  if (!timestamp) return '';
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'ru' ? 'ru-RU' : lang === 'pt-br' ? 'pt-BR' : 'en-US';
  return new Date(timestamp).toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', hour12: lang !== 'ru' });
}

export function calculateStats(items) {
  let totalPixels = 0;
  let totalCapacity = 0;
  let totalExactProgress = 0;

  items.forEach(item => {
    if (item.type === 'account') {
      const cp = Number(item.currentPixels) || 0;
      const cap = Number(item.capacity) || 0;
      totalPixels += cp;
      totalCapacity += cap;
      if (cp < cap && cap > 0) {
        const startTime = item.startTime || Date.now();
        const timeSinceLastPixel = (Date.now() - startTime) % PIXEL_INTERVAL;
        const progressWithinPixel = timeSinceLastPixel / PIXEL_INTERVAL;
        totalExactProgress += (cp + progressWithinPixel);
      } else {
        totalExactProgress += cap;
      }
    } else if (item.type === 'folder' && item.accounts) {
      const folderStats = calculateStats(item.accounts);
      totalPixels += folderStats.totalPixels;
      totalCapacity += folderStats.totalCapacity;
      totalExactProgress += folderStats.totalExactProgress;
    }
  });
  return { totalPixels, totalCapacity, totalExactProgress };
}

export function getAllAccounts(masterItems) {
  const accounts = [];
  masterItems.forEach(item => {
    if (item.type === 'account') {
      accounts.push(item);
    } else if (item.type === 'folder' && item.accounts) {
      item.accounts.forEach(acc => accounts.push(acc));
    }
  });
  return accounts;
}

export function findItem(masterItems, itemId) {
  for (const item of masterItems) {
    if (item.id === itemId) return item;
    if (item.type === 'folder' && item.accounts) {
      const account = item.accounts.find(acc => acc.id === itemId);
      if (account) return account;
    }
  }
  return null;
}

export function findParentFolder(masterItems, accountId) {
  for (const item of masterItems) {
    if (item.type === 'folder' && item.accounts && item.accounts.some(acc => acc.id === accountId)) {
      return item;
    }
  }
  return null;
}

export function migrateItem(item) {
  if (!item.createdAt) item.createdAt = Date.now();
  if (item.resetCount === undefined) item.resetCount = 0;

  if (item.type === 'account') {
    if (item.currentPixels === undefined || item.currentPixels === null || isNaN(item.currentPixels)) item.currentPixels = 0;
    if (item.capacity === undefined || item.capacity === null || isNaN(item.capacity) || item.capacity <= 0) item.capacity = 1000;
    if (!item.name || typeof item.name !== 'string') item.name = 'Unnamed Account';
    if (!item.color) item.color = 'blue';
    if (item.uid === undefined || item.uid === null) item.uid = '';
    if (!item.cardBg) item.cardBg = 'default';
    if (!item.progressStyle) item.progressStyle = 'default';
    if (item.note === undefined || item.note === null) item.note = '';
    if (item.browser === undefined || item.browser === null) item.browser = '';
    if (!item.ipHistory) item.ipHistory = [];
    if (item.notificationSent === undefined) item.notificationSent = false;
    if (item.completionTime === undefined) item.completionTime = null;
    if (item.currentPixels < item.capacity && !item.startTime) {
      item.startTime = Date.now() - (item.currentPixels * PIXEL_INTERVAL);
    }
    if (item.currentPixels >= item.capacity) {
      item.notificationSent = true;
      if (!item.completionTime) {
        item.completionTime = item.startTime ? item.startTime + (item.capacity * PIXEL_INTERVAL) : Date.now();
      }
    }
  }

  if (item.type === 'folder') {
    if (!item.name || typeof item.name !== 'string') item.name = 'Unnamed Folder';
    if (!item.accounts) item.accounts = [];
    item.accounts.forEach(acc => migrateItem(acc));
  }
  return item;
}

export async function fetchMyIp() {
  for (const api of IP_APIS) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(api.url, { signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const ip = api.isText ? api.extract(await res.text()) : api.extract(await res.json());
      if (ip && /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        return ip;
      }
    } catch (e) { continue; }
  }
  return null;
}

export function ipCompare(a, b) {
  const pa = (a || '').split('.').map(Number);
  const pb = (b || '').split('.').map(Number);
  while (pa.length < 4) pa.push(0);
  while (pb.length < 4) pb.push(0);
  for (let i = 0; i < 4; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
