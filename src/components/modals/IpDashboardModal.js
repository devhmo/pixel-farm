'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAllAccounts, ipCompare } from '../../lib/utils';

export default function IpDashboardModal() {
  const { state, dispatch, t } = useApp();
  const isOpen = state.modals.ipDashboard;
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [showCount, setShowCount] = useState(1);

  if (!isOpen) return null;

  const accounts = getAllAccounts(state.masterItems).filter(a => a.ipHistory && a.ipHistory.length > 0);
  let filtered = [...accounts];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => a.name.toLowerCase().includes(q) || (a.ipHistory || []).some(e => e.ip.toLowerCase().includes(q)));
  }

  if (sort === 'recent') filtered.sort((a, b) => { const ad = a.ipHistory.length ? new Date(a.ipHistory[a.ipHistory.length - 1].date).getTime() : 0; const bd = b.ipHistory.length ? new Date(b.ipHistory[b.ipHistory.length - 1].date).getTime() : 0; return bd - ad; });
  else if (sort === 'most-ips') filtered.sort((a, b) => b.ipHistory.length - a.ipHistory.length);
  else if (sort === 'ip-asc') filtered.sort((a, b) => { const ai = a.ipHistory.length ? a.ipHistory[a.ipHistory.length - 1].ip : ''; const bi = b.ipHistory.length ? b.ipHistory[b.ipHistory.length - 1].ip : ''; return ipCompare(ai, bi); });
  else if (sort === 'ip-desc') filtered.sort((a, b) => { const ai = a.ipHistory.length ? a.ipHistory[a.ipHistory.length - 1].ip : ''; const bi = b.ipHistory.length ? b.ipHistory[b.ipHistory.length - 1].ip : ''; return ipCompare(bi, ai); });

  const openHistory = (acc) => {
    dispatch({ type: 'SET_IP_HISTORY', payload: { accountId: acc.id, name: acc.name } });
    dispatch({ type: 'OPEN_MODAL', payload: 'ipHistory' });
  };

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'ipDashboard' }); }}>
      <div className="modal-content" style={{ maxWidth: 750 }}>
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'ipDashboard' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon teal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>IP Tracking Dashboard</h2>
            <p>Manage IP addresses for all accounts</p>
          </div>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by name or IP..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1.5px solid var(--border-color)', borderRadius: 10, backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-family)', fontSize: '0.92em' }} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid var(--border-color)', borderRadius: 10, backgroundColor: 'var(--card-bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-family)', fontSize: '0.92em' }}>
              <option value="recent">Sort: Recent IP</option>
              <option value="most-ips">Sort: Most IPs</option>
              <option value="ip-asc">Sort: IP Low→High</option>
              <option value="ip-desc">Sort: IP High→Low</option>
            </select>
            <div className="ip-segmented-control">
              {[1, 2, 3, 5, 0].map(n => (
                <button key={n} className={`ip-segment-btn${showCount === n ? ' active' : ''}`} onClick={() => setShowCount(n)}>{n === 0 ? 'All' : n}</button>
              ))}
            </div>
          </div>
          <div style={{ maxHeight: 450, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--subtext-color)' }}>No accounts found.</div>
            ) : filtered.map(acc => {
              const history = [...acc.ipHistory];
              const ipsToShow = showCount === 0 ? history.reverse() : history.reverse().slice(0, showCount);
              return (
                <div key={acc.id} className="dash-account-card">
                  <div className="dash-account-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dash-account-name">{acc.name}</div>
                      <div className="dash-ip-count">{acc.ipHistory.length} IP{acc.ipHistory.length !== 1 ? 's' : ''} recorded</div>
                    </div>
                    <div className="dash-account-actions">
                      <button className="ip-view-add-btn" onClick={() => { dispatch({ type: 'SET_IP_ACCOUNT', payload: acc.id }); dispatch({ type: 'OPEN_MODAL', payload: 'ip' }); }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> IP
                      </button>
                      <button className="ip-view-history-btn" onClick={() => openHistory(acc)}>History</button>
                    </div>
                  </div>
                  <div className="dash-ip-list">
                    {ipsToShow.length === 0 ? (
                      <div style={{ color: 'var(--subtext-color)', fontStyle: 'italic', padding: '8px 0' }}>No IP recorded</div>
                    ) : ipsToShow.map((entry, idx) => (
                      <div key={idx} className={`dash-ip-entry${idx === 0 ? ' newest' : ''}`}>
                        <span className="ip-rank">{idx + 1}</span>
                        <span className="ip-value">{entry.ip || '—'}</span>
                        <div className="ip-meta">
                          {entry.note && <span className="dash-ip-note">{entry.note}</span>}
                          <span className="dash-ip-date">{new Date(entry.date).toLocaleString()}</span>
                        </div>
                        {idx === 0 && ipsToShow.length > 1 && <span className="dash-ip-newest-tag">newest</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
