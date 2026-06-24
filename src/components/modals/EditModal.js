'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findItem } from '../../lib/utils';
import { PIXEL_INTERVAL } from '../../lib/constants';

export default function EditModal() {
  const { state, dispatch, t, updateItem } = useApp();
  const isOpen = state.modals.edit;
  const editingItem = state.editingItemId ? findItem(state.masterItems, state.editingItemId) : null;
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [browser, setBrowser] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pixels, setPixels] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setUid(editingItem.uid || '');
      setBrowser(editingItem.browser || '');
      setCapacity(editingItem.capacity || '');
      setPixels(editingItem.currentPixels || '');
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingItem || !name.trim()) return;

    const updates = { name: name.trim() };
    if (editingItem.type === 'account') {
      updates.uid = uid.trim();
      updates.browser = browser.trim();
      updates.capacity = Number(capacity) || 1000;
      updates.currentPixels = Math.min(Number(pixels) || 0, updates.capacity);
      if (updates.currentPixels < updates.capacity) {
        updates.startTime = Date.now() - (updates.currentPixels * PIXEL_INTERVAL);
        updates.completionTime = null;
      } else {
        updates.startTime = null;
        if (!editingItem.completionTime) updates.completionTime = Date.now();
      }
      updates.notificationSent = updates.currentPixels >= updates.capacity;
    }

    updateItem(editingItem.id, updates);
    dispatch({ type: 'CLOSE_MODAL', payload: 'edit' });
  };

  if (!isOpen || !editingItem) return null;
  const isAccount = editingItem.type === 'account';

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'edit' }); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'edit' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{isAccount ? t('editAccount') : t('editFolder')}</h2></div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>{t('name')}</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
            {isAccount && (
              <>
                <div className="form-group"><label>{t('accountUid')}</label><input type="text" value={uid} onChange={(e) => setUid(e.target.value)} placeholder={t('accountUidPlaceholder')} /></div>
                <div className="form-group"><label>{t('browserName')}</label><input type="text" value={browser} onChange={(e) => setBrowser(e.target.value)} placeholder={t('browserNamePlaceholder')} /></div>
                <div className="form-group"><label>{t('newCapacity')}</label><input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" /></div>
                <div className="form-group"><label>{t('newCurrentPixels')}</label><input type="number" value={pixels} onChange={(e) => setPixels(e.target.value)} required min="0" /></div>
              </>
            )}
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {t('saveChanges')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
