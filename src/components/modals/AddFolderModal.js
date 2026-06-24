'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddFolderModal() {
  const { state, dispatch, t, addFolder } = useApp();
  const isOpen = state.modals.addFolder;
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addFolder(name.trim());
    setName('');
    dispatch({ type: 'CLOSE_MODAL', payload: 'addFolder' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'addFolder' }); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'addFolder' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{t('addNewFolder')}</h2></div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="folder-name">{t('folderName')}</label>
              <input type="text" id="folder-name" placeholder={t('folderNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              {t('addFolderBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
