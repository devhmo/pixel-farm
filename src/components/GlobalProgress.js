'use client';

import { useApp } from '../context/AppContext';
import { calculateStats, findItem } from '../lib/utils';

export default function GlobalProgress() {
  const { state, t } = useApp();

  let itemsToCalculate = [];
  if (state.currentView === 'main') {
    itemsToCalculate = state.masterItems;
  } else if (state.currentView === 'folder') {
    const folder = findItem(state.masterItems, state.currentFolderId);
    itemsToCalculate = folder ? folder.accounts || [] : [];
  }

  const stats = calculateStats(itemsToCalculate);
  const percent = stats.totalCapacity > 0 ? Math.min(100, (stats.totalExactProgress / stats.totalCapacity) * 100) : 0;

  if (stats.totalCapacity <= 0) return null;

  return (
    <div id="global-stats-wrapper" className="global-stats-wrapper">
      <div className="global-stats-header">{t('overallProgress')}</div>
      <div className="global-progress-bar-container">
        <div id="global-progress-bar" className="global-progress-bar" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="global-stats-values">
        <span>{stats.totalPixels.toLocaleString()}</span>
        <span>{stats.totalCapacity.toLocaleString()}</span>
      </div>
    </div>
  );
}
