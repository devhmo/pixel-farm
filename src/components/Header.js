'use client';

import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, dispatch, t, sortItems } = useApp();

  const handleThemeToggle = () => {
    const newTheme = state.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', payload: { view: 'main', folderId: null } });
    dispatch({ type: 'SET_SEARCH', payload: '' });
    dispatch({ type: 'SET_FILTER', payload: 'all' });
  };

  const handleExport = () => {
    const exportData = {
      version: 2,
      exportDate: new Date().toISOString(),
      items: state.masterItems
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('dataExported'), type: 'success' } });
  };

  const handleImport = () => {
    document.getElementById('import-file-input')?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.items || !Array.isArray(data.items)) {
          dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('invalidBackup'), type: 'error' } });
          return;
        }
        dispatch({ type: 'SET_PENDING_IMPORT', payload: data.items });
        dispatch({ type: 'OPEN_MODAL', payload: 'importConfirm' });
      } catch (err) {
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('parseFailed'), type: 'error' } });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleIpDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: { view: 'ip-dashboard' } });
  };

  const isFolderView = state.currentView === 'folder';
  const isIpDashboard = state.currentView === 'ip-dashboard';

  return (
    <header>
      <div className="header-controls">
        <button id="theme-toggle" title="Toggle dark/light mode" onClick={handleThemeToggle}>
          <svg className="sun-icon btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg className="moon-icon btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
        <button id="settings-btn" title="Settings" onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'settings' })}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
        <button id="sort-btn" className="btn btn-primary" title={t('sort')} onClick={sortItems}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
        </button>
      </div>
      <div className="data-actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="data-btn" id="export-btn" title="Export data to JSON file" onClick={handleExport}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            {t('export')}
          </button>
          <button className="data-btn" id="import-btn" title="Import data from JSON file" onClick={handleImport}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {t('import')}
          </button>
          <input type="file" id="import-file-input" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
        {!isIpDashboard && (
          <button className="data-btn ip-dashboard-btn" id="ip-dashboard-btn" title="IP Tracking Dashboard" onClick={handleIpDashboard}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
            {t('ipTracker')}
          </button>
        )}
      </div>
      <h1 id="main-title">
        {state.currentView === 'main' ? t('appTitle') : (findItem(state.masterItems, state.currentFolderId)?.name || t('appTitle'))}
      </h1>
      {state.currentView === 'main' && <p id="main-subtitle">{t('appSubtitle')}</p>}
      {isFolderView && (
        <button id="back-to-main" className="btn btn-primary" style={{ margin: '0 auto 20px' }} onClick={handleBack}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          {t('backToMain')}
        </button>
      )}
      {state.currentView === 'main' && 'Notification' in window && Notification.permission !== 'granted' && (
        <button id="enable-notifications-btn" className="btn btn-primary" onClick={() => { Notification.requestPermission().then(p => { if (p === 'granted' || p === 'denied') dispatch({ type: 'FORCE_UPDATE' }); }); }}>
          {t('enableNotifications')}
        </button>
      )}
    </header>
  );
}

function findItem(items, id) {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.type === 'folder' && item.accounts) {
      const found = item.accounts.find(a => a.id === id);
      if (found) return found;
    }
  }
  return null;
}
