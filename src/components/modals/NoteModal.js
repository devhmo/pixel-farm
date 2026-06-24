'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findItem } from '../../lib/utils';

export default function NoteModal() {
  const { state, dispatch, t, updateItem } = useApp();
  const isOpen = state.modals.note;
  const editingItem = state.editingItemId ? findItem(state.masterItems, state.editingItemId) : null;
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingItem) setNote(editingItem.note || '');
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateItem(editingItem.id, { note: note.trim() });
    dispatch({ type: 'CLOSE_MODAL', payload: 'note' });
  };

  if (!isOpen || !editingItem) return null;

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'note' }); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'note' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon purple">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{t('editNote')}</h2></div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="account-note-input">{t('note')}</label>
              <textarea id="account-note-input" placeholder={t('notePlaceholder')} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {t('saveNote')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
