'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findItem } from '../../lib/utils';
import { IP_APIS } from '../../lib/constants';

export default function IpModal() {
  const { state, dispatch, t, updateItem, showToast } = useApp();
  const isOpen = state.modals.ip;
  const account = state.ipAccountId ? findItem(state.masterItems, state.ipAccountId) : null;
  const [ip, setIp] = useState('');
  const [note, setNote] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) { setIp(''); setNote(''); setEditMode(false); }
  }, [isOpen]);

  const fetchMyIp = async () => {
    setLoading(true);
    for (const api of IP_APIS) {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(api.url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
        clearTimeout(timeout);
        if (!res.ok) continue;
        const data = api.isText ? api.extract(await res.text()) : api.extract(await res.json());
        if (data && /^(\d{1,3}\.){3}\d{1,3}$/.test(data)) {
          setIp(data);
          showToast('IP detected: ' + data, 'success');
          setLoading(false);
          return;
        }
      } catch (e) { continue; }
    }
    setLoading(false);
    showToast('Could not detect IP. Try manually.', 'error');
  };

  const handlePaste = async () => {
    try { const text = await navigator.clipboard.readText(); setIp(text); showToast('Pasted from clipboard', 'success'); } catch (e) { showToast('Failed to read clipboard', 'error'); }
  };

  const handleEditLastIp = () => {
    if (!account || !account.ipHistory || account.ipHistory.length === 0) return;
    const last = account.ipHistory[account.ipHistory.length - 1];
    setIp(last.ip);
    setNote(last.note || '');
    setEditMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip.trim() || !account) return;
    const history = [...(account.ipHistory || [])];
    if (editMode && history.length > 0) {
      const last = history[history.length - 1];
      last.ip = ip.trim();
      last.note = note.trim();
      last.date = new Date().toISOString();
      showToast(t('ipUpdated'), 'success');
    } else {
      history.push({ ip: ip.trim(), date: new Date().toISOString(), note: note.trim() });
    }
    updateItem(account.id, { ipHistory: history });
    dispatch({ type: 'CLOSE_MODAL', payload: 'ip' });
  };

  if (!isOpen || !account) return null;

  const lastIp = account.ipHistory && account.ipHistory.length > 0 ? account.ipHistory[account.ipHistory.length - 1] : null;

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'ip' }); }}>
      <div className="modal-content">
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'ip' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon indigo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>{editMode ? `Edit IP — ${account.name}` : `Add IP — ${account.name}`}</h2>
            <p>{editMode ? t('editingLastIp') : 'Track a new IP for this account'}</p>
          </div>
        </div>
        <div className="modal-body">
          {lastIp && !editMode && (
            <div className="last-ip-section">
              <div className="last-ip-section-header">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 16, height: 16, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{t('lastIpUsed')}</span>
              </div>
              <div className="last-ip-section-body">
                <div className="last-ip-info">
                  <span className="last-ip-badge" style={{ margin: 0 }}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                    {lastIp.ip}
                  </span>
                  {lastIp.note && <span className="last-ip-note-text">{lastIp.note}</span>}
                  <span className="last-ip-date-text">{new Date(lastIp.date).toLocaleString()}</span>
                </div>
                <button type="button" className="edit-last-ip-btn" onClick={handleEditLastIp}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  {t('editThisIp')}
                </button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>IP Address</label>
              <div className="input-with-icon">
                <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="e.g., 192.168.1.1" autoComplete="off" />
                <button type="button" className={`fetch-ip-btn${loading ? ' loading' : ''}`} onClick={fetchMyIp} title="Auto-detect my IP">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
                <button type="button" className="paste-btn" onClick={handlePaste} title="Paste from clipboard">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Note (Optional)</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g., Home network, VPN..." autoComplete="off" />
            </div>
            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={editMode ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}></path></svg>
              {editMode ? t('saveEdit') : (t('addIpBtn') || 'Add IP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
