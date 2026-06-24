'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function AboutModal() {
  const { state, dispatch, t } = useApp();
  const isOpen = state.modals.about;

  if (!isOpen) return null;

  return (
    <div className="modal active" role="dialog" onClick={(e) => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL', payload: 'about' }); }}>
      <div className="modal-content" style={{ maxWidth: 520, maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="close-button" aria-label="Close" onClick={() => dispatch({ type: 'CLOSE_MODAL', payload: 'about' })}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="modal-header">
          <div className="modal-header-icon green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="modal-header-text"><h2>{t('aboutTitle')}</h2></div>
        </div>
        <div className="modal-body">
          <div className="about-hero">
            <div className="about-hero-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3>PixelFarm</h3>
            <p>{t('aboutHeroDesc')}</p>
            <span className="about-version">v1.0</span>
          </div>

          <div className="about-section-label">{t('aboutFeatures')}</div>
          <div className="about-feature-list">
            {[
              { icon: 'blue', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>, title: t('aboutF1Title'), desc: t('aboutF1Desc') },
              { icon: 'green', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>, title: t('aboutF2Title'), desc: t('aboutF2Desc') },
              { icon: 'purple', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>, title: t('aboutF3Title'), desc: t('aboutF3Desc') },
              { icon: 'orange', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>, title: t('aboutF4Title'), desc: t('aboutF4Desc') },
              { icon: 'teal', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>, title: t('aboutF5Title'), desc: t('aboutF5Desc') },
              { icon: 'red', svg: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>, title: t('aboutF6Title'), desc: t('aboutF6Desc') },
            ].map((f, i) => (
              <div key={i} className="about-feature-item">
                <div className={`about-fi-icon ${f.icon}`}>{f.svg}</div>
                <div className="about-fi-text"><strong>{f.title}</strong><span>{f.desc}</span></div>
              </div>
            ))}
          </div>

          <div className="about-privacy-box">
            <div className="about-privacy-header">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <strong>{t('aboutPrivacyTitle')}</strong>
            </div>
            <div className="about-privacy-points">
              {[t('aboutP1'), t('aboutP2'), t('aboutP3'), t('aboutP4'), t('aboutP5')].map((p, i) => (
                <div key={i} className="about-privacy-point">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-footer"><p>{t('aboutFooter')}</p></div>
        </div>
      </div>
    </div>
  );
}
