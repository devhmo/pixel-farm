'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ConfirmModal() {
  const { state, dispatch, t } = useApp();
  const isOpen = state.modals.confirm;
  const data = state.confirmData;

  if (!isOpen || !data) return null;

  const handleConfirm = () => {
    if (data.onConfirm) data.onConfirm(true);
    dispatch({ type: 'CLOSE_MODAL', payload: 'confirm' });
    dispatch({ type: 'SET_CONFIRM', payload: null });
  };

  const handleCancel = () => {
    if (data.onConfirm) data.onConfirm(false);
    dispatch({ type: 'CLOSE_MODAL', payload: 'confirm' });
    dispatch({ type: 'SET_CONFIRM', payload: null });
  };

  return (
    <div className="modal active" role="alertdialog" onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }} style={{ zIndex: 1001 }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={handleCancel}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon red">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>{data.title || t('confirmAction')}</h2>
            <p>{data.message || t('areYouSure')}</p>
          </div>
        </div>
        <div className="modal-body">
          <div className="confirm-actions">
            <button className="btn-secondary" onClick={handleCancel}>{t('cancel')}</button>
            <button className="btn-danger" onClick={handleConfirm}>{t('confirm')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
