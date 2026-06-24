'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ImportConfirmModal() {
  const { state, dispatch, t, importMerge, importReplace, importIntoFolder, showToast } = useApp();
  const isOpen = state.modals.importConfirm;
  const pendingData = state.pendingImportData;

  if (!isOpen || !pendingData) return null;

  const handleMerge = () => {
    const count = importMerge(pendingData);
    dispatch({ type: 'CLOSE_MODAL', payload: 'importConfirm' });
    dispatch({ type: 'SET_PENDING_IMPORT', payload: null });
    showToast(t('merged', { count }), 'info');
  };

  const handleReplace = async () => {
    importReplace(pendingData);
    dispatch({ type: 'CLOSE_MODAL', payload: 'importConfirm' });
    dispatch({ type: 'SET_PENDING_IMPORT', payload: null });
    showToast(t('dataReplaced'), 'success');
  };

  const handleIntoFolder = () => {
    if (state.currentFolderId) {
      const count = importIntoFolder(pendingData, state.currentFolderId);
      const folder = state.masterItems.find(i => i.id === state.currentFolderId);
      dispatch({ type: 'CLOSE_MODAL', payload: 'importConfirm' });
      dispatch({ type: 'SET_PENDING_IMPORT', payload: null });
      showToast(`Imported ${count} account(s) into "${folder?.name || 'folder'}"`, 'success');
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'importConfirm' });
    dispatch({ type: 'SET_PENDING_IMPORT', payload: null });
  };

  const showFolderBtn = state.currentView === 'folder' && state.currentFolderId;

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={handleCancel}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>{t('importData')}</h2>
            <p>{t('importHow')}</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="import-actions">
            {showFolderBtn && (
              <button className="import-btn merge" style={{ background: 'linear-gradient(135deg, var(--accent-indigo) 0%, #5a67d8 100%)' }} onClick={handleIntoFolder}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                <span>Import into Folder</span>
              </button>
            )}
            <button className="import-btn merge" onClick={handleMerge}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              {t('mergeWithExisting')}
            </button>
            <button className="import-btn replace" onClick={handleReplace}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              {t('replaceAllData')}
            </button>
            <button className="import-btn cancel-btn" onClick={handleCancel}>{t('cancel')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
