'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function EmptyState({ hasSearch }) {
  const { t, dispatch } = useApp();

  if (hasSearch) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <div className="empty-state-title">{t('noResults')}</div>
        <div className="empty-state-desc">{t('noResultsDesc')}</div>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
      <div className="empty-state-title">{t('noAccountsYet')}</div>
      <div className="empty-state-desc">{t('noAccountsDesc')}</div>
      <button className="empty-state-btn" onClick={() => dispatch({ type: 'OPEN_MODAL', payload: 'addAccount' })}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        {t('addFirstAccount')}
      </button>
    </div>
  );
}
