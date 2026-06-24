'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function FAB() {
  const { state, dispatch, t } = useApp();
  const isOpen = state.fabOpen;
  const isFolderView = state.currentView === 'folder';

  return (
    <div className={`fab-container${isOpen ? ' open' : ''}`}>
      <ul className="fab-options">
        {!isFolderView && (
          <li id="add-folder-fab-item">
            <span className="fab-label">{t('addFolder')}</span>
            <button id="add-folder-btn" className="fab-action" title="Add New Folder" onClick={() => { dispatch({ type: 'OPEN_MODAL', payload: 'addFolder' }); dispatch({ type: 'SET_FAB_OPEN', payload: false }); }}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"></path></svg>
            </button>
          </li>
        )}
        <li>
          <span className="fab-label">{t('addAccount')}</span>
          <button id="add-account-btn" className="fab-action" title="Add New Account" onClick={() => {
            const capInput = document.getElementById('account-capacity');
            if (capInput) capInput.value = state.settings.defaultCapacity || 1000;
            dispatch({ type: 'OPEN_MODAL', payload: 'addAccount' });
            dispatch({ type: 'SET_FAB_OPEN', payload: false });
          }}>
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
        </li>
      </ul>
      <button className="fab-main" title="Add new" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_FAB_OPEN', payload: !isOpen }); }}>
        <svg className="btn-icon" style={{ width: 28, height: 28 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      </button>
    </div>
  );
}
