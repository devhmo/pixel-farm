'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findItem, findParentFolder } from '../../lib/utils';

export default function MoveModal() {
  const { state, dispatch, t, moveAccount } = useApp();
  const isOpen = state.modals.move;
  const editingItem = state.editingItemId ? findItem(state.masterItems, state.editingItemId) : null;
  const [destination, setDestination] = useState('root');

  useEffect(() => {
    if (editingItem) {
      const parent = findParentFolder(state.masterItems, editingItem.id);
      setDestination(parent ? parent.id : 'root');
    }
  }, [editingItem, state.masterItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    moveAccount(editingItem.id, destination);
    dispatch({ type: 'CLOSE_MODAL', payload: 'move' });
  };

  if (!isOpen || !editingItem) return null;

  const currentParent = findParentFolder(state.masterItems, editingItem.id);

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'move' }); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'move' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon teal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{t('moveAccount')}</h2></div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="move-folder-select">{t('selectDestination')}</label>
              <select id="move-folder-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="root">{t('mainViewNoFolder')}</option>
                {state.masterItems.filter(i => i.type === 'folder').map(folder => (
                  <option key={folder.id} value={folder.id} disabled={currentParent && currentParent.id === folder.id}>
                    {folder.name}{currentParent && currentParent.id === folder.id ? ` ${t('current')}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path></svg>
              {t('moveAccountBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
