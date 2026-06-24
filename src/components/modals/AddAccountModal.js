'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddAccountModal() {
  const { state, dispatch, t, addAccount } = useApp();
  const isOpen = state.modals.addAccount;
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(state.settings.defaultCapacity || 1000);
  const [currentPixels, setCurrentPixels] = useState('');
  const [uid, setUid] = useState('');
  const [browser, setBrowser] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || capacity <= 0) return;
    addAccount(name.trim(), uid.trim(), browser.trim(), capacity, parseInt(currentPixels) || 0, state.currentView === 'folder' ? state.currentFolderId : 'root');
    setName(''); setCapacity(state.settings.defaultCapacity || 1000); setCurrentPixels(''); setUid(''); setBrowser('');
    dispatch({ type: 'CLOSE_MODAL', payload: 'addAccount' });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'addAccount' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" role="dialog" aria-labelledby="add-account-title" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={handleClose}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2 id="add-account-title">{t('addNewAccount')}</h2>
          </div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="account-name">{t('accountName')}</label>
              <input type="text" id="account-name" placeholder={t('accountNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="account-capacity">{t('capacity')}</label>
              <input type="number" id="account-capacity" placeholder={t('capacityPlaceholder')} value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" />
            </div>
            <div className="form-optional-section">
              <div className="form-optional-label">Optional</div>
              <div className="form-group optional-field">
                <label htmlFor="current-pixels">{t('currentPixels')}</label>
                <input type="number" id="current-pixels" placeholder={t('currentPixelsPlaceholder')} value={currentPixels} onChange={(e) => setCurrentPixels(e.target.value)} min="0" />
              </div>
              <div className="form-group optional-field">
                <label htmlFor="account-uid">{t('accountUid')}</label>
                <input type="text" id="account-uid" placeholder={t('accountUidPlaceholder')} value={uid} onChange={(e) => setUid(e.target.value)} />
              </div>
              <div className="form-group optional-field">
                <label htmlFor="account-browser">{t('browserName')}</label>
                <input type="text" id="account-browser" placeholder={t('browserNamePlaceholder')} value={browser} onChange={(e) => setBrowser(e.target.value)} list="browser-list" />
                <datalist id="browser-list">
                  <option value="Chrome" /><option value="Firefox" /><option value="Safari" /><option value="Edge" />
                  <option value="Opera" /><option value="Brave" /><option value="Vivaldi" /><option value="Tor Browser" />
                  <option value="Samsung Internet" /><option value="UC Browser" /><option value="Yandex Browser" /><option value="DuckDuckGo" />
                </datalist>
              </div>
            </div>
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              {t('addAccountBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
