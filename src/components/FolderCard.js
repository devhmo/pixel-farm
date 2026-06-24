'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { escapeHtml, getNextCompletingAccount, getAccountTimeLeftMs, formatTimeLeft, formatFinishTime } from '../lib/utils';
import { PIXEL_INTERVAL } from '../lib/constants';

export default function FolderCard({ folder }) {
  const { state, dispatch, t, deleteItem, showUndoToast, showToast } = useApp();

  const accounts = folder.accounts || [];
  const nextUp = getNextCompletingAccount(accounts);

  const handleDelete = (e) => {
    e.stopPropagation();
    const snapshot = deleteItem(folder.id);
    showUndoToast(t('folderDeleted', { name: folder.name }), () => {
      dispatch({ type: 'SET_MASTER_ITEMS', payload: snapshot });
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch({ type: 'SET_EDITING_ITEM', payload: folder.id });
    dispatch({ type: 'OPEN_MODAL', payload: 'edit' });
  };

  const handleExport = (e) => {
    e.stopPropagation();
    const exportData = {
      version: 2,
      exportDate: new Date().toISOString(),
      exportType: 'folder',
      folderName: folder.name,
      items: [folder]
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-tracker-${folder.name.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Folder "${folder.name}" exported`, 'success');
  };

  const handleClick = (e) => {
    if (!e.target.closest('.btn') && !e.target.closest('.drag-handle')) {
      dispatch({ type: 'SET_VIEW', payload: { view: 'folder', folderId: folder.id } });
      dispatch({ type: 'SET_SEARCH', payload: '' });
      dispatch({ type: 'SET_FILTER', payload: 'all' });
    }
  };

  const renderNextUp = () => {
    if (!nextUp) {
      return <div className="folder-summary">{t('folderSummary', { count: accounts.length })}</div>;
    }

    const cp = Number(nextUp.currentPixels) || 0;
    const cap = Number(nextUp.capacity) || 0;
    const startTime = nextUp.startTime || Date.now();
    const timeSinceLastPixel = (Date.now() - startTime) % PIXEL_INTERVAL;
    const progressWithinPixel = timeSinceLastPixel / PIXEL_INTERVAL;
    const totalProgress = cp + progressWithinPixel;
    const progressPercent = cap > 0 ? (totalProgress / cap) * 100 : 0;
    const isFull = cap > 0 && cp >= cap;
    const timeLeftMs = !isFull ? getAccountTimeLeftMs(nextUp) : 0;
    const finishTimestamp = !isFull ? new Date(Date.now() + timeLeftMs) : null;

    return (
      <>
        <div className="next-up-title">{t('nextUp')}</div>
        <div className="next-up-card" data-next-up-id={nextUp.id} style={{ '--accent-color': `var(--accent-${nextUp.color || 'blue'})` }}>
          <div className="card-header">
            <div className="card-header-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h3 id={`name-${nextUp.id}`} style={{ margin: 0 }}>{escapeHtml(nextUp.name)}</h3>
                {nextUp.browser && (
                  <span className="browser-badge">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>
                    {escapeHtml(nextUp.browser)}
                  </span>
                )}
              </div>
              {nextUp.uid && <span className="account-uid" id={`uid-${nextUp.id}`}>ID: {escapeHtml(nextUp.uid)}</span>}
              <p className="account-note" id={`note-display-${nextUp.id}`}>{escapeHtml(nextUp.note || '')}</p>
            </div>
          </div>
          <div className="pixels-display" id={`pixels-${nextUp.id}`}>{cp} / {cap}</div>
          <div className="progress-bar-container">
            <div className="progress-bar" id={`progress-${nextUp.id}`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
          </div>
          <div className="info-grid">
            <div className="info-item"><strong>{t('timeLeft')}</strong><span id={`time-left-${nextUp.id}`}>{isFull ? t('done') : formatTimeLeft(timeLeftMs)}</span></div>
            <div className="info-item"><strong>{t('finishTime')}</strong><span id={`finish-time-${nextUp.id}`}>{isFull ? t('completedLabel') : (finishTimestamp ? formatFinishTime(finishTimestamp) : 'N/A')}</span></div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="card folder-card" data-id={folder.id} onClick={handleClick}>
      <div className="card-header">
        <div className="card-header-title">
          <h3>{escapeHtml(folder.name)}</h3>
        </div>
        <div className="card-header-actions">
          <span className="drag-handle" aria-label="Drag handle">⋮⋮</span>
        </div>
      </div>
      <div className="next-up-container">
        {renderNextUp()}
      </div>
      <div className="card-footer">
        <div className="footer-right">
          <button className="btn btn-note" title="Export Folder" aria-label="Export folder" style={{ backgroundColor: 'var(--accent-teal)' }} onClick={handleExport}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </button>
          <button className="btn btn-edit" title="Edit Folder" aria-label="Edit folder" onClick={handleEdit}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button className="btn btn-delete" title="Delete Folder" aria-label="Delete folder" onClick={handleDelete}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
