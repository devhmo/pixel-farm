'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { findItem } from '../../lib/utils';

export default function CustomizeModal() {
  const { state, dispatch, t, updateItem } = useApp();
  const isOpen = state.modals.customize;
  const editingItem = state.editingItemId ? findItem(state.masterItems, state.editingItemId) : null;
  const [color, setColor] = useState('blue');
  const [cardBg, setCardBg] = useState('default');
  const [progressStyle, setProgressStyle] = useState('default');
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setColor(editingItem.color || 'blue');
      setCardBg(editingItem.cardBg || 'default');
      setProgressStyle(editingItem.progressStyle || 'default');
      setShowMore(false);
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateItem(editingItem.id, { color, cardBg, progressStyle });
    dispatch({ type: 'CLOSE_MODAL', payload: 'customize' });
  };

  if (!isOpen || !editingItem) return null;

  const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];
  const bgs = ['default', 'blue', 'green', 'purple', 'orange', 'teal', 'pink', 'red', 'indigo'];
  const styles = [
    { id: 'default', label: 'Default', barStyle: { height: 12, borderRadius: 8, background: 'var(--accent-blue)', width: '65%' } },
    { id: 'thin', label: 'Thin', barStyle: { height: 4, borderRadius: 4, background: 'var(--accent-blue)', width: '65%' } },
    { id: 'thick', label: 'Thick', barStyle: { height: 18, borderRadius: 8, background: 'var(--accent-blue)', width: '65%' } },
    { id: 'gradient', label: 'Gradient', barStyle: { height: 12, borderRadius: 8, background: 'linear-gradient(90deg,var(--accent-blue),var(--accent-purple))', width: '65%' } },
    { id: 'striped', label: 'Striped', barStyle: { height: 12, borderRadius: 8, background: 'var(--accent-blue)', width: '65%', backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,0.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0.2) 75%,transparent 75%)', backgroundSize: '14px 14px' } },
    { id: 'glow', label: 'Glow', barStyle: { height: 12, borderRadius: 8, background: 'var(--accent-blue)', width: '65%', boxShadow: '0 0 10px var(--accent-blue)' } },
  ];

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'customize' }); }}>
      <div className="modal-content" style={{ maxWidth: 480 }}>
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'customize' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon pink">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
          </div>
          <div className="modal-header-text">
            <h2>{t('customizeCard')}</h2>
            <p>Personalize the look of this card</p>
          </div>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="customize-section" style={{ marginBottom: 16 }}>
              <div className="customize-section-label">{t('accentColor')}</div>
              <div className="color-palette" id="customize-color-palette" style={{ gap: 10 }}>
                {colors.map(c => (
                  <div key={c} className={`color-swatch${color === c ? ' selected' : ''}`} data-color={c} title={c} style={{ width: 42, height: 42 }} onClick={() => setColor(c)}></div>
                ))}
              </div>
            </div>

            <div className="settings-section" style={{ marginBottom: 16, border: 'none', background: 'none' }}>
              <div className="settings-section-title" style={{ cursor: 'pointer', pointerEvents: 'auto', fontSize: '0.85em', padding: '12px 0 8px', textTransform: 'none', letterSpacing: 0, fontWeight: 600, color: 'var(--subtext-color)', borderBottom: '1px solid var(--border-color)' }} onClick={() => setShowMore(!showMore)}>
                More Options <svg className="accordion-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: showMore ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              {showMore && (
                <div style={{ paddingTop: 12 }}>
                  <div className="customize-section" style={{ marginBottom: 16 }}>
                    <div className="customize-section-label">{t('cardBackground')}</div>
                    <div className="color-palette" id="customize-bg-palette">
                      {bgs.map(bg => (
                        <div key={bg} className={`bg-swatch${cardBg === bg ? ' selected' : ''}`} data-bg={bg} title={bg} style={{ background: bg === 'default' ? 'var(--card-bg-color)' : `linear-gradient(135deg, rgba(66,153,225,0.3), rgba(66,153,225,0.1))` }} onClick={() => setCardBg(bg)}></div>
                      ))}
                    </div>
                  </div>
                  <div className="customize-section">
                    <div className="customize-section-label">{t('progressStyle')}</div>
                    <div className="progress-style-options" id="progress-style-options">
                      {styles.map(s => (
                        <button key={s.id} type="button" className={`progress-style-btn${progressStyle === s.id ? ' active' : ''}`} data-style={s.id} onClick={() => setProgressStyle(s.id)}>
                          <div className="ps-preview"><div className="ps-bar" style={s.barStyle}></div></div>
                          <span>{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn-add">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {t('saveCustomization')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
