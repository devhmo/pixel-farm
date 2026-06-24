export const PIXEL_INTERVAL = 30 * 1000;

export const ACCENT_COLORS = {
  blue: '#4299e1',
  green: '#48bb78',
  purple: '#9f7aea',
  orange: '#ed8936',
  teal: '#4fd1c5',
  pink: '#ed64a6',
  red: '#f56565',
  yellow: '#ecc94b',
  indigo: '#667eea',
  cyan: '#0bc5ea',
  rose: '#f687b3',
  lime: '#9ae6b4',
};

export const COLOR_SWATCHES = [
  'blue', 'green', 'purple', 'orange', 'teal', 'pink',
  'red', 'yellow', 'indigo', 'cyan', 'rose', 'lime'
];

export const BG_SWATCHES = [
  'default', 'blue', 'green', 'purple', 'orange', 'teal', 'pink', 'red', 'indigo'
];

export const PROGRESS_STYLES = ['default', 'thin', 'thick', 'gradient', 'striped', 'glow'];

export const RADIUS_OPTIONS = ['sharp', 'normal', 'rounded', 'pill'];

export const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'pt-br', flag: '🇧🇷', name: 'Português (BR)' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
];

export const BROWSER_LIST = [
  'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Brave',
  'Vivaldi', 'Tor Browser', 'Samsung Internet', 'UC Browser',
  'Yandex Browser', 'DuckDuckGo'
];

export const IP_APIS = [
  { url: 'https://api.ipify.org?format=json', extract: d => d.ip },
  { url: 'https://api.seeip.org/jsonip', extract: d => d.ip },
  { url: 'https://ipapi.co/json/', extract: d => d.ip },
  { url: 'https://api.my-ip.io/v2/ip.json', extract: d => d.ip },
  { url: 'https://ipinfo.io/json', extract: d => d.ip },
  { url: 'https://checkip.amazonaws.com', extract: t => t.trim(), isText: true },
  { url: 'https://api.ip.sb/ip', extract: t => t.trim(), isText: true },
  { url: 'https://ifconfig.me/ip', extract: t => t.trim(), isText: true }
];

export const DEFAULT_SETTINGS = {
  showStats: false,
  showSearch: false,
  showProgress: true,
  forceDesktop: true,
  cardView: 'grid',
  showCardProgress: true,
  showCardPixels: true,
  showCardTime: true,
  showCardFinish: true,
  showCardRemaining: true,
  showCardNotes: true,
  cardRadius: 'normal',
  cardBorder: false,
  cardShadow: true,
  cardAnimations: false,
  defaultColor: 'blue',
  defaultCapacity: 1000,
};

export const DEFAULT_STATE = {
  masterItems: [],
  currentView: 'main',
  currentFolderId: null,
  settings: DEFAULT_SETTINGS,
  language: 'en',
  theme: 'dark-mode',
};
