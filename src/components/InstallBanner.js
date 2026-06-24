'use client';

import React, { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isDismissed = localStorage.getItem('installDismissed') === 'true';
    if (isInstalled || isDismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 1500);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setShow(false); setDeferredPrompt(null); });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('installDismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="install-banner show">
      <div className="install-banner-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18v-6m0 0l-3 3m3-3l3 3M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z"/></svg>
      </div>
      <div className="install-banner-text">
        <strong>Install PixelFarm</strong>
        <span>Add to home screen for the best experience</span>
      </div>
      <button className="install-banner-btn" onClick={handleInstall}>Install</button>
      <button className="install-banner-close" aria-label="Close" onClick={handleClose}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
}
