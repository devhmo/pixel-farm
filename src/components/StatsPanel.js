'use client';

import { useApp } from '../context/AppContext';
import { getAllAccounts } from '../lib/utils';

export default function StatsPanel() {
  const { state, t } = useApp();
  const allAccounts = getAllAccounts(state.masterItems);
  const completed = allAccounts.filter(a => {
    const cp = Number(a.currentPixels) || 0;
    const cap = Number(a.capacity) || 0;
    return cap > 0 && cp >= cap;
  }).length;
  const active = allAccounts.length - completed;
  const totalPixels = allAccounts.reduce((s, a) => s + (Number(a.currentPixels) || 0), 0);

  return (
    <div className="stats-panel" id="stats-panel">
      <div className="stat-card"><div className="stat-value">{allAccounts.length}</div><div className="stat-label">{t('total')}</div></div>
      <div className="stat-card"><div className="stat-value">{active}</div><div className="stat-label">{t('active')}</div></div>
      <div className="stat-card"><div className="stat-value">{completed}</div><div className="stat-label">{t('completed')}</div></div>
      <div className="stat-card"><div className="stat-value">{totalPixels.toLocaleString()}</div><div className="stat-label">{t('pixels')}</div></div>
    </div>
  );
}
