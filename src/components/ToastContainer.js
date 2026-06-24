'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  const getIcon = (type) => {
    if (type === 'success') return <svg style={{ width: 22, height: 22, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    if (type === 'warning') return <svg style={{ width: 22, height: 22, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>;
    if (type === 'error') return <svg style={{ width: 22, height: 22, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    return <svg style={{ width: 22, height: 22, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
  };

  return (
    <div id="toast-container">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} show`}
          onClick={() => {
            if (toast.type === 'undo' && toast.onUndo) {
              toast.onUndo();
            }
            dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
          }}
        >
          {toast.type === 'undo' ? (
            <>
              <svg style={{ width: 20, height: 20, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a5 5 0 015 5v2M3 10l4 4M3 10l4-4"></path></svg>
              <span className="toast-body">{toast.message}</span>
              <button className="undo-btn" onClick={(e) => { e.stopPropagation(); if (toast.onUndo) toast.onUndo(); dispatch({ type: 'REMOVE_TOAST', payload: toast.id }); }}>Undo</button>
            </>
          ) : (
            <>
              {getIcon(toast.type)}
              <span>{toast.message}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
