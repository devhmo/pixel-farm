'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PIXEL_INTERVAL } from '../lib/constants';
import { escapeHtml, getAccountTimeLeftMs, formatTimeLeft, formatFinishTime } from '../lib/utils';

export default function AccountCard({ account, isNextUp = false }) {
  const { state, dispatch, t, deleteItem, resetAccount, showUndoToast, showToast } = useApp();
  const [moreOpen, setMoreOpen] = useState(false);
  const cardRef = useRef(null);

  const currentPixels = Number(account.currentPixels) || 0;
  const capacity = Number(account.capacity) || 0;
  const startTime = account.startTime || Date.now();
  const timeSinceLastPixel = (Date.now() - startTime) % PIXEL_INTERVAL;
  const progressWithinPixel = timeSinceLastPixel / PIXEL_INTERVAL;
  const totalProgress = currentPixels + progressWithinPixel;
  const progressPercent = capacity > 0 ? (totalProgress / capacity) * 100 : 0;
  const isFull = capacity > 0 && currentPixels >= capacity;

  const handleDelete = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    const snapshot = deleteItem(account.id);
    showUndoToast(t('accountDeleted', { name: account.name }), () => {
      dispatch({ type: 'SET_MASTER_ITEMS', payload: snapshot });
    });
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    const snapshot = resetAccount(account.id);
    if (snapshot) {
      showUndoToast(t('accountReset', { name: account.name }), () => {
        const items = JSON.parse(JSON.stringify(state.masterItems));
        const acc = items.flatMap(i => i.type === 'account' ? [i] : (i.accounts || [])).find(a => a.id === account.id);
        if (acc) {
          Object.assign(acc, snapshot);
          dispatch({ type: 'SET_MASTER_ITEMS', payload: items });
        }
      });
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    dispatch({ type: 'SET_EDITING_ITEM', payload: account.id });
    dispatch({ type: 'OPEN_MODAL', payload: 'edit' });
  };

  const handleNote = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    dispatch({ type: 'SET_EDITING_ITEM', payload: account.id });
    dispatch({ type: 'OPEN_MODAL', payload: 'note' });
  };

  const handleIp = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    dispatch({ type: 'SET_IP_ACCOUNT', payload: account.id });
    dispatch({ type: 'SET_IP_EDIT_MODE', payload: false });
    dispatch({ type: 'OPEN_MODAL', payload: 'ip' });
  };

  const handleMove = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    dispatch({ type: 'SET_EDITING_ITEM', payload: account.id });
    dispatch({ type: 'OPEN_MODAL', payload: 'move' });
  };

  const handleCustomize = (e) => {
    e.stopPropagation();
    setMoreOpen(false);
    dispatch({ type: 'SET_EDITING_ITEM', payload: account.id });
    dispatch({ type: 'OPEN_MODAL', payload: 'customize' });
  };

  const timeLeftMs = !isFull ? getAccountTimeLeftMs(account) : 0;
  const finishTimestamp = !isFull ? new Date(Date.now() + timeLeftMs) : null;

  const lastIp = account.ipHistory && account.ipHistory.length > 0
    ? account.ipHistory[account.ipHistory.length - 1]
    : null;

  const accentColor = `var(--accent-${account.color || 'blue'})`;

  if (isNextUp) {
    return (
      <div className="next-up-card" data-next-up-id={account.id} style={{ '--accent-color': accentColor }}>
        <div className="card-header">
          <div className="card-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 id={`name-${account.id}`} style={{ margin: 0 }}>{escapeHtml(account.name)}</h3>
              {account.browser && (
                <span className="browser-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>
                  {escapeHtml(account.browser)}
                </span>
              )}
            </div>
            {account.uid && <span className="account-uid" id={`uid-${account.id}`}>ID: {escapeHtml(account.uid)}</span>}
            <p className="account-note" id={`note-display-${account.id}`}>{escapeHtml(account.note || '')}</p>
          </div>
        </div>
        <div className="pixels-display" id={`pixels-${account.id}`}>{currentPixels} / {capacity}</div>
        <div className="progress-bar-container">
          <div className="progress-bar" id={`progress-${account.id}`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
        </div>
        <div className="info-grid">
          <div className="info-item"><strong>{t('timeLeft')}</strong><span id={`time-left-${account.id}`}>{isFull ? t('done') : formatTimeLeft(timeLeftMs)}</span></div>
          <div className="info-item"><strong>{t('finishTime')}</strong><span id={`finish-time-${account.id}`}>{isFull ? (account.completionTime ? `${t('completedAt')} ${new Date(account.completionTime).toLocaleTimeString()}` : t('completedLabel')) : (finishTimestamp ? formatFinishTime(finishTimestamp, state.language) : 'N/A')}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`card account-card${isFull ? ' full' : ''}${account.cardBg && account.cardBg !== 'default' ? ` card-bg-${account.cardBg}` : ''}${account.progressStyle && account.progressStyle !== 'default' ? ` card-progress-${account.progressStyle}` : ''}`}
      data-id={account.id}
      style={{ '--accent-color': accentColor }}
    >
      <div className="card-header">
        <div className="card-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 id={`name-${account.id}`} style={{ margin: 0 }}>{escapeHtml(account.name)}</h3>
            {account.browser && (
              <span className="browser-badge">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>
                {escapeHtml(account.browser)}
              </span>
            )}
          </div>
          {account.uid && <span className="account-uid" id={`uid-${account.id}`}>ID: {escapeHtml(account.uid)}</span>}
          {lastIp && (
            <span className="last-ip-badge" id={`last-ip-${account.id}`}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
              {escapeHtml(lastIp.ip)}
            </span>
          )}
          <p className="account-note" id={`note-display-${account.id}`}>{escapeHtml(account.note || '')}</p>
        </div>
        <div className="card-header-actions">
          <div className="more-options-container">
            <button className="header-btn more-options-btn" title="More Options" aria-label="More options" onClick={(e) => { e.stopPropagation(); setMoreOpen(!moreOpen); }}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
            </button>
            <div className={`more-options-menu${moreOpen ? ' show' : ''}`} role="menu">
              <button className="menu-item move-action-btn" role="menuitem" onClick={handleMove}>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
                {t('moveToFolder')}
              </button>
              <button className="menu-item customize-action-btn" role="menuitem" onClick={handleCustomize}>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                {t('customizeCardMenu')}
              </button>
            </div>
          </div>
          <span className="drag-handle" title="Drag to reorder" aria-label="Drag handle">⋮⋮</span>
        </div>
      </div>
      <div className="pixels-display" id={`pixels-${account.id}`}>{currentPixels} / {capacity}</div>
      <div className="progress-bar-container">
        <div className="progress-bar" id={`progress-${account.id}`} style={{ width: `${Math.min(100, progressPercent)}%` }}></div>
      </div>
      <div className="info-grid">
        <div className="info-item"><strong>{t('timeLeft')}</strong><span id={`time-left-${account.id}`}>{isFull ? t('done') : formatTimeLeft(timeLeftMs)}</span></div>
        <div className="info-item"><strong>{t('remaining')}</strong><span id={`remaining-${account.id}`}>{Math.max(0, capacity - currentPixels)}</span></div>
        <div className="info-item"><strong>{t('finishTime')}</strong><span id={`finish-time-${account.id}`}>{isFull ? (account.completionTime ? `${t('completedAt')} ${new Date(account.completionTime).toLocaleTimeString()}` : t('completedLabel')) : (finishTimestamp ? formatFinishTime(finishTimestamp, state.language) : 'N/A')}</span></div>
      </div>
      <div className="card-footer">
        <div className="footer-left">
          <button className="btn btn-note" title="Edit Note" aria-label="Edit note" onClick={handleNote}>
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
          </button>
          <button className="btn btn-ip" title="Add IP" aria-label="Add IP address" onClick={handleIp}>
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
          </button>
        </div>
        <div className="footer-right">
          <button className="btn btn-reset" title="Reset Account" aria-label="Reset account" onClick={handleReset}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20 4L9 15M4 20L15 9"></path></svg>
          </button>
          <button className="btn btn-edit" title="Edit Account" aria-label="Edit account" onClick={handleEdit}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
          <button className="btn btn-delete" title="Delete Account" aria-label="Delete account" onClick={handleDelete}>
            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
