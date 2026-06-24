'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { findItem } from '../../lib/utils';

export default function IpHistoryModal() {
  const { state, dispatch, t, updateItem, showToast } = useApp();
  const isOpen = state.modals.ipHistory;
  const account = state.ipHistoryAccountId ? findItem(state.masterItems, state.ipHistoryAccountId) : null;

  if (!isOpen || !account) return null;

  const history = account.ipHistory || [];

  const handleDelete = async (idx) => {
    const entry = history[idx];
    const confirmed = window.confirm(`Are you sure you want to delete IP "${entry.ip}"?`);
    if (!confirmed) return;
    const newHistory = [...history];
    newHistory.splice(idx, 1);
    updateItem(account.id, { ipHistory: newHistory });
  };

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'ipHistory' }); }}>
      <div className="modal-content" style={{ maxWidth: 500 }}>
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'ipHistory' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon purple">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>IP History</h2>
            <p>{state.ipHistoryAccountName} — {history.length} entries</p>
          </div>
        </div>
        <div className="modal-body">
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--subtext-color)' }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 40, height: 40, margin: '0 auto 12px', opacity: 0.4, display: 'block' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                No IP history recorded.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 12px', marginBottom: 4, borderBottom: '2px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75em', fontWeight: 700, color: 'var(--subtext-color)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>IP Address</span>
                  <span style={{ fontSize: '0.75em', fontWeight: 700, color: 'var(--subtext-color)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</span>
                </div>
                {[...history].reverse().map((entry, i) => (
                  <div key={i} className={`dash-ip-entry${i === 0 ? ' newest' : ''}`} style={{ marginBottom: 4 }}>
                    <span className="ip-rank">{i + 1}</span>
                    <span className="ip-value">{entry.ip}</span>
                    <div className="ip-meta">
                      {entry.note && <span className="dash-ip-note">{entry.note}</span>}
                      <span className="dash-ip-date">{new Date(entry.date).toLocaleString()}</span>
                    </div>
                    {i === 0 && history.length > 1 && <span className="dash-ip-newest-tag">newest</span>}
                    <button onClick={() => handleDelete(history.length - 1 - i)} style={{ background: 'none', border: '1.5px solid transparent', cursor: 'pointer', color: 'var(--subtext-color)', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 6 }} title="Delete">
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
