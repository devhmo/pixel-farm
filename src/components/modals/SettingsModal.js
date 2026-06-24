'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function SettingsModal() {
  const { state, dispatch, t, saveLanguage, saveTheme, showToast } = useApp();
  const isOpen = state.modals.settings;
  const settings = state.settings;
  const [langOpen, setLangOpen] = useState(false);
  const [radiusOpen, setRadiusOpen] = useState(false);

  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    dispatch({ type: 'SET_SETTINGS', payload: { [key]: value } });
  };

  const langFlags = { en: '🇺🇸', ru: '🇷🇺', 'pt-br': '🇧🇷', ar: '🇸🇦' };
  const langNames = { en: 'English', ru: 'Русский', 'pt-br': 'Português (BR)', ar: 'العربية' };
  const radiusLabels = { sharp: 'Sharp', normal: 'Normal', rounded: 'Rounded', cardRadius: 'Pill' };
  const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink'];

  const handleViewMode = (mode) => {
    updateSetting('cardView', mode);
  };

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'settings' }); }}>
      <div className="modal-content" style={{ maxWidth: 540, maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'settings' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{t('settings')}</h2></div>
        </div>

        {/* Display Section */}
        <div className="settings-section settings-section-static open">
          <div className="settings-section-title">{t('display')}</div>
          <div className="settings-section-body">
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('statisticsPanel')}</div><div className="setting-desc">{t('statisticsPanelDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.showStats} onChange={(e) => updateSetting('showStats', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('searchFilter')}</div><div className="setting-desc">{t('searchFilterDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.showSearch} onChange={(e) => updateSetting('showSearch', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('globalProgressBar')}</div><div className="setting-desc">{t('globalProgressBarDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.showProgress} onChange={(e) => updateSetting('showProgress', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
          </div>
        </div>

        {/* Card View Mode */}
        <div className="settings-section settings-section-static open">
          <div className="settings-section-title">{t('cardViewMode')}</div>
          <div className="settings-section-body">
            <div className="card-view-options">
              <button className={`card-view-option${settings.cardView === 'grid' ? ' active' : ''}`} onClick={() => handleViewMode('grid')}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="12" height="12" rx="2"/><rect x="18" y="2" width="12" height="12" rx="2"/><rect x="2" y="18" width="12" height="12" rx="2"/><rect x="18" y="18" width="12" height="12" rx="2"/></svg>
                <span>{t('gridView')}</span>
              </button>
              <button className={`card-view-option${settings.cardView === 'compact' ? ' active' : ''}`} onClick={() => handleViewMode('compact')}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="28" height="4" rx="1"/><rect x="2" y="10" width="28" height="4" rx="1"/><rect x="2" y="17" width="28" height="4" rx="1"/><rect x="2" y="24" width="28" height="4" rx="1"/></svg>
                <span>{t('compactView')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card Elements */}
        <div className="settings-section">
          <div className="settings-section-title" onClick={(e) => { if (!e.target.closest('.styled-dropdown-container')) e.currentTarget.parentElement.classList.toggle('open'); }}>
            {t('cardElements')} <svg className="accordion-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div className="settings-section-body">
            {[
              { key: 'showCardProgress', label: t('showProgressBar'), desc: t('showProgressBarDesc') },
              { key: 'showCardPixels', label: t('showPixelsDisplay'), desc: t('showPixelsDisplayDesc') },
              { key: 'showCardTime', label: t('showTimeLeft'), desc: t('showTimeLeftDesc') },
              { key: 'showCardFinish', label: t('showFinishTime'), desc: t('showFinishTimeDesc') },
              { key: 'showCardRemaining', label: t('showRemaining'), desc: t('showRemainingDesc') },
              { key: 'showCardNotes', label: t('showNotes'), desc: t('showNotesDesc') },
            ].map(s => (
              <div key={s.key} className="setting-row">
                <div className="setting-info"><div className="setting-label">{s.label}</div><div className="setting-desc">{s.desc}</div></div>
                <label className="toggle-switch"><input type="checkbox" checked={settings[s.key]} onChange={(e) => updateSetting(s.key, e.target.checked)} /><span className="toggle-slider"></span></label>
              </div>
            ))}
          </div>
        </div>

        {/* Card Style */}
        <div className="settings-section">
          <div className="settings-section-title" onClick={(e) => { if (!e.target.closest('.styled-dropdown-container')) e.currentTarget.parentElement.classList.toggle('open'); }}>
            {t('cardStyle')} <svg className="accordion-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div className="settings-section-body">
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('cardCorners')}</div><div className="setting-desc">{t('cardCornersDesc')}</div></div>
              <div className="styled-dropdown-container" style={{ position: 'relative' }}>
                <button className="styled-dropdown-btn" onClick={(e) => { e.stopPropagation(); setRadiusOpen(!radiusOpen); }}>
                  <span>{radiusLabels[settings.cardRadius] || 'Normal'}</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {radiusOpen && (
                  <div className="styled-dropdown-menu show" style={{ display: 'block' }}>
                    {['sharp', 'normal', 'rounded', 'pill'].map(r => (
                      <button key={r} className={`styled-option${settings.cardRadius === r ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); updateSetting('cardRadius', r); setRadiusOpen(false); }}>
                        <span>{radiusLabels[r] || r}</span>
                        <svg className="option-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('cardBorder')}</div><div className="setting-desc">{t('cardBorderDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.cardBorder} onChange={(e) => updateSetting('cardBorder', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('cardShadow')}</div><div className="setting-desc">{t('cardShadowDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.cardShadow} onChange={(e) => updateSetting('cardShadow', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('animations')}</div><div className="setting-desc">{t('animationsDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.cardAnimations} onChange={(e) => updateSetting('cardAnimations', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
          </div>
        </div>

        {/* Defaults */}
        <div className="settings-section">
          <div className="settings-section-title" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            {t('defaults')} <svg className="accordion-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div className="settings-section-body">
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('defaultColor')}</div><div className="setting-desc">{t('defaultColorDesc')}</div></div>
              <div className="default-color-picker">
                {colors.map(c => (
                  <div key={c} className={`mini-swatch${settings.defaultColor === c ? ' selected' : ''}`} style={{ background: `var(--accent-${c})` }} onClick={() => updateSetting('defaultColor', c)}></div>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('defaultCapacity')}</div><div className="setting-desc">{t('defaultCapacityDesc')}</div></div>
              <input type="number" value={settings.defaultCapacity} onChange={(e) => { const v = parseInt(e.target.value); if (v > 0) updateSetting('defaultCapacity', v); }} min="1" style={{ width: 100, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 8, backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-family)', fontSize: '0.9em', textAlign: 'center' }} />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="settings-section settings-section-static open">
          <div className="settings-section-title">{t('layout')}</div>
          <div className="settings-section-body">
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('forceDesktop')}</div><div className="setting-desc">{t('forceDesktopDesc')}</div></div>
              <label className="toggle-switch"><input type="checkbox" checked={settings.forceDesktop} onChange={(e) => updateSetting('forceDesktop', e.target.checked)} /><span className="toggle-slider"></span></label>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="settings-section settings-section-static open">
          <div className="settings-section-title">{t('language')}</div>
          <div className="settings-section-body">
            <div className="setting-row">
              <div className="setting-info"><div className="setting-label">{t('language')}</div><div className="setting-desc" id="current-lang-label">{langNames[state.language] || 'English'}</div></div>
              <div className="lang-dropdown-container" style={{ position: 'relative' }}>
                <button className="lang-dropdown-btn" onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}>
                  <span>{langFlags[state.language] || '🌐'}</span>
                  <span>{langNames[state.language] || 'English'}</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {langOpen && (
                  <div className="lang-dropdown-menu show" style={{ display: 'block' }}>
                    {Object.entries(langNames).map(([code, name]) => (
                      <button key={code} className={`lang-option${state.language === code ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); saveLanguage(code); dispatch({ type: 'SET_LANGUAGE', payload: code === 'ar' ? 'en' : code }); setLangOpen(false); }}>
                        <span>{langFlags[code]}</span><span>{name}</span>
                        <svg className="lang-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="settings-section settings-section-static open" style={{ marginTop: 4 }}>
          <div className="settings-section-title">{t('aboutTitle')}</div>
          <div className="settings-section-body">
            <div className="setting-row" style={{ cursor: 'pointer' }} onClick={() => { dispatch({ type: 'CLOSE_MODAL', payload: 'settings' }); setTimeout(() => dispatch({ type: 'OPEN_MODAL', payload: 'about' }), 250); }}>
              <div className="setting-info"><div className="setting-label">About PixelFarm</div><div className="setting-desc">Features, privacy & version info</div></div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 20, height: 20, color: 'var(--subtext-color)', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
