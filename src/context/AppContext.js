'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { DEFAULT_SETTINGS, PIXEL_INTERVAL } from '../lib/constants';
import { translations } from '../lib/translations';
import { migrateItem, findItem, findParentFolder, getAllAccounts, generateId, getAccountTimeLeftMs, getItemTimeLeftMs } from '../lib/utils';

const AppContext = createContext(null);

const initialState = {
  masterItems: [],
  currentView: 'main',
  currentFolderId: null,
  settings: { ...DEFAULT_SETTINGS },
  language: 'en',
  theme: 'dark-mode',
  searchQuery: '',
  filterStatus: 'all',
  toasts: [],
  modals: {
    addAccount: false,
    addFolder: false,
    edit: false,
    note: false,
    confirm: false,
    move: false,
    customize: false,
    importConfirm: false,
    ip: false,
    ipDashboard: false,
    ipHistory: false,
    welcome: false,
    about: false,
    settings: false,
  },
  editingItemId: null,
  confirmData: null,
  pendingImportData: null,
  ipAccountId: null,
  ipHistoryAccountId: null,
  ipHistoryAccountName: '',
  ipEditMode: false,
  fabOpen: false,
  viewMode: 'ip-dashboard-hidden',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_MASTER_ITEMS':
      return { ...state, masterItems: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload.view, currentFolderId: action.payload.folderId || null };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER':
      return { ...state, filterStatus: action.payload };
    case 'OPEN_MODAL':
      return { ...state, modals: { ...state.modals, [action.payload]: true } };
    case 'CLOSE_MODAL':
      return { ...state, modals: { ...state.modals, [action.payload]: false } };
    case 'CLOSE_ALL_MODALS':
      return { ...state, modals: Object.fromEntries(Object.keys(state.modals).map(k => [k, false])) };
    case 'SET_EDITING_ITEM':
      return { ...state, editingItemId: action.payload };
    case 'SET_CONFIRM':
      return { ...state, confirmData: action.payload };
    case 'SET_PENDING_IMPORT':
      return { ...state, pendingImportData: action.payload };
    case 'SET_IP_ACCOUNT':
      return { ...state, ipAccountId: action.payload };
    case 'SET_IP_HISTORY':
      return { ...state, ipHistoryAccountId: action.payload.accountId, ipHistoryAccountName: action.payload.name || '' };
    case 'SET_IP_EDIT_MODE':
      return { ...state, ipEditMode: action.payload };
    case 'SET_FAB_OPEN':
      return { ...state, fabOpen: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const logicIntervalRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Translation helper
  const t = useCallback((key, params) => {
    const lang = translations[state.language] || translations.en;
    let str = lang[key] || translations.en[key] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      });
    }
    return str;
  }, [state.language]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') || 'dark-mode';
      const savedLang = localStorage.getItem('appLanguage') || 'en';
      let savedSettings = { ...DEFAULT_SETTINGS };
      try {
        const s = JSON.parse(localStorage.getItem('appSettings'));
        if (s && typeof s === 'object') savedSettings = { ...DEFAULT_SETTINGS, ...s };
      } catch (e) {}

      let savedItems = [];
      try {
        const items = JSON.parse(localStorage.getItem('trackerItems'));
        if (Array.isArray(items)) {
          savedItems = items;
          savedItems.forEach(item => migrateItem(item));
        }
      } catch (e) {}

      dispatch({
        type: 'SET_STATE',
        payload: {
          theme: savedTheme,
          language: savedLang || 'en',
          settings: savedSettings,
          masterItems: savedItems,
        }
      });

      // Show welcome if first visit
      if (!localStorage.getItem('welcomeSeen')) {
        setTimeout(() => dispatch({ type: 'OPEN_MODAL', payload: 'welcome' }), 300);
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }, []);

  // Save to localStorage
  const saveItems = useCallback(() => {
    try {
      const json = JSON.stringify(state.masterItems);
      localStorage.setItem('trackerItems', json);
    } catch (e) {
      console.error('Failed to save:', e);
      if (e.name === 'QuotaExceededError') {
        dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: 'Storage full!', type: 'warning' } });
      }
    }
  }, [state.masterItems]);

  const saveSettings = useCallback(() => {
    localStorage.setItem('appSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  const saveTheme = useCallback((theme) => {
    localStorage.setItem('theme', theme);
  }, []);

  const saveLanguage = useCallback((lang) => {
    localStorage.setItem('appLanguage', lang);
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (state.masterItems.length > 0 || localStorage.getItem('trackerItems')) {
      saveItems();
    }
  }, [state.masterItems, saveItems]);

  useEffect(() => {
    saveSettings();
  }, [state.settings, saveSettings]);

  // Logic loop - pixel increment
  useEffect(() => {
    const runLogic = () => {
      let needsSave = false;
      const allAccounts = getAllAccounts(state.masterItems);

      allAccounts.forEach(account => {
        const cp = Number(account.currentPixels) || 0;
        const cap = Number(account.capacity) || 0;
        if (cp < cap && account.startTime) {
          const elapsedTime = Date.now() - account.startTime;
          const newPixels = Math.floor(elapsedTime / PIXEL_INTERVAL);
          if (newPixels > cp) {
            account.currentPixels = Math.min(newPixels, cap);
            needsSave = true;
          }
          if (account.currentPixels >= cap) {
            account.currentPixels = cap;
            if (!account.notificationSent) {
              account.completionTime = account.startTime ? account.startTime + (cap * PIXEL_INTERVAL) : Date.now();
              account.notificationSent = true;
              needsSave = true;

              // Send notification
              dispatch({ type: 'ADD_TOAST', payload: { id: Date.now(), message: t('accountFull', { name: account.name }), type: 'success' } });

              if ('Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(t('accountFull', { name: account.name }), {
                    body: t('accountFull', { name: account.name }),
                    icon: 'https://i.imgur.com/REcURC3.png'
                  });
                } catch (e) {}
              }

              // Play sound
              try {
                const audio = document.getElementById('notification-sound');
                if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
              } catch (e) {}
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 800;
                gain.gain.value = 0.3;
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
              } catch (e) {}

              // Apply completed animation
              setTimeout(() => {
                const cardEl = document.querySelector(`.account-card[data-id="${account.id}"]`);
                if (cardEl) {
                  cardEl.classList.add('completed-animation');
                  setTimeout(() => cardEl.classList.remove('completed-animation'), 1000);
                }
              }, 0);
            }
          }
        }
      });

      if (needsSave) {
        dispatch({ type: 'SET_MASTER_ITEMS', payload: [...state.masterItems] });
      }
    };

    logicIntervalRef.current = setInterval(runLogic, 1000);
    return () => clearInterval(logicIntervalRef.current);
  }, [state.masterItems, t]);

  // Save before unload
  useEffect(() => {
    const handleUnload = () => {
      try {
        localStorage.setItem('trackerItems', JSON.stringify(state.masterItems));
      } catch (e) {}
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [state.masterItems]);

  // CRUD operations
  const addAccount = useCallback((name, uid, browser, capacity, currentPixels, parentFolderId) => {
    capacity = Number(capacity) || state.settings.defaultCapacity;
    currentPixels = Number(currentPixels) || 0;
    const newAccount = {
      type: 'account',
      id: generateId('acc'),
      name, uid: uid || '', browser: browser || '', capacity, currentPixels,
      note: '', color: state.settings.defaultColor || 'blue',
      startTime: currentPixels < capacity ? Date.now() - (currentPixels * PIXEL_INTERVAL) : null,
      notificationSent: currentPixels >= capacity,
      completionTime: currentPixels >= capacity ? Date.now() : null,
      createdAt: Date.now(),
      resetCount: 0,
      cardBg: 'default',
      progressStyle: 'default',
      ipHistory: [],
    };

    const newItems = [...state.masterItems];
    if (parentFolderId === 'root' || !parentFolderId) {
      newItems.push(newAccount);
    } else {
      const folder = findItem(newItems, parentFolderId);
      if (folder && folder.type === 'folder') {
        if (!folder.accounts) folder.accounts = [];
        folder.accounts.push(newAccount);
      } else {
        newItems.push(newAccount);
      }
    }
    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
  }, [state.masterItems, state.settings]);

  const addFolder = useCallback((name) => {
    const newFolder = {
      type: 'folder',
      id: generateId('folder'),
      name,
      accounts: [],
      createdAt: Date.now(),
    };
    dispatch({ type: 'SET_MASTER_ITEMS', payload: [...state.masterItems, newFolder] });
  }, [state.masterItems]);

  const deleteItem = useCallback((itemId) => {
    const newItems = state.masterItems.map(folder => {
      if (folder.type === 'folder' && folder.accounts) {
        return { ...folder, accounts: folder.accounts.filter(acc => acc.id !== itemId) };
      }
      return folder;
    }).filter(i => i.id !== itemId);
    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
    return JSON.parse(JSON.stringify(state.masterItems)); // snapshot for undo
  }, [state.masterItems]);

  const resetAccount = useCallback((accountId) => {
    const newItems = JSON.parse(JSON.stringify(state.masterItems));
    const account = findItem(newItems, accountId);
    if (account && account.type === 'account') {
      const snapshot = {
        currentPixels: account.currentPixels,
        startTime: account.startTime,
        notificationSent: account.notificationSent,
        completionTime: account.completionTime,
        resetCount: account.resetCount || 0,
      };
      account.currentPixels = 0;
      account.startTime = Date.now();
      account.notificationSent = false;
      account.completionTime = null;
      account.resetCount = (account.resetCount || 0) + 1;
      dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
      return snapshot;
    }
    return null;
  }, [state.masterItems]);

  const updateItem = useCallback((itemId, updates) => {
    const newItems = JSON.parse(JSON.stringify(state.masterItems));
    const item = findItem(newItems, itemId);
    if (item) {
      Object.assign(item, updates);
      dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
    }
  }, [state.masterItems]);

  const moveAccount = useCallback((accountId, destinationId) => {
    const newItems = JSON.parse(JSON.stringify(state.masterItems));
    const account = findItem(newItems, accountId);
    if (!account) return;

    const currentParent = findParentFolder(newItems, accountId);
    const currentLocation = currentParent ? currentParent.id : 'root';
    if (destinationId === currentLocation) return;

    // Remove from current
    if (currentParent) {
      currentParent.accounts = currentParent.accounts.filter(acc => acc.id !== accountId);
    } else {
      const idx = newItems.findIndex(i => i.id === accountId);
      if (idx !== -1) newItems.splice(idx, 1);
    }

    // Add to destination
    if (destinationId === 'root') {
      newItems.push(account);
    } else {
      const destFolder = findItem(newItems, destinationId);
      if (destFolder && destFolder.type === 'folder') {
        if (!destFolder.accounts) destFolder.accounts = [];
        destFolder.accounts.push(account);
      }
    }

    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
  }, [state.masterItems]);

  const reorderItems = useCallback((oldIndex, newIndex) => {
    const newItems = [...state.masterItems];
    const [moved] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, moved);
    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
  }, [state.masterItems]);

  const sortItems = useCallback(() => {
    let items;
    if (state.currentView === 'main') {
      items = [...state.masterItems];
      items.sort((a, b) => getItemTimeLeftMs(a) - getItemTimeLeftMs(b));
      dispatch({ type: 'SET_MASTER_ITEMS', payload: items });
    } else {
      const folder = findItem(state.masterItems, state.currentFolderId);
      if (folder && folder.accounts) {
        folder.accounts.sort((a, b) => getAccountTimeLeftMs(a) - getAccountTimeLeftMs(b));
        dispatch({ type: 'SET_MASTER_ITEMS', payload: [...state.masterItems] });
      }
    }
  }, [state.masterItems, state.currentView, state.currentFolderId]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 4000);
  }, []);

  const showUndoToast = useCallback((message, onUndo, durationMs = 8000) => {
    const id = Date.now() + Math.random();
    dispatch({
      type: 'ADD_TOAST',
      payload: { id, message, type: 'undo', onUndo, durationMs }
    });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), durationMs);
  }, []);

  const importMerge = useCallback((importData) => {
    const existingIds = new Set(getAllAccounts(state.masterItems).map(a => a.id).concat(state.masterItems.map(i => i.id)));
    let addedCount = 0;
    const newItems = [...state.masterItems];
    importData.forEach(item => {
      if (!existingIds.has(item.id)) {
        migrateItem(item);
        newItems.push(item);
        addedCount++;
      }
    });
    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
    return addedCount;
  }, [state.masterItems]);

  const importReplace = useCallback((importData) => {
    importData.forEach(item => migrateItem(item));
    dispatch({ type: 'SET_MASTER_ITEMS', payload: importData });
  }, []);

  const importIntoFolder = useCallback((importData, folderId) => {
    const newItems = JSON.parse(JSON.stringify(state.masterItems));
    const folder = findItem(newItems, folderId);
    if (!folder || folder.type !== 'folder') return 0;
    if (!folder.accounts) folder.accounts = [];
    const existingIds = new Set(getAllAccounts(newItems).map(a => a.id).concat(newItems.map(i => i.id)));
    let addedCount = 0;
    let accountsToImport = [];
    importData.forEach(item => {
      if (item.type === 'folder' && item.accounts) accountsToImport.push(...item.accounts);
      else if (item.type === 'account') accountsToImport.push(item);
    });
    accountsToImport.forEach(acc => {
      if (!existingIds.has(acc.id)) {
        migrateItem(acc);
        folder.accounts.push(acc);
        addedCount++;
      }
    });
    dispatch({ type: 'SET_MASTER_ITEMS', payload: newItems });
    return addedCount;
  }, [state.masterItems]);

  const value = {
    state,
    dispatch,
    t,
    // Actions
    addAccount,
    addFolder,
    deleteItem,
    resetAccount,
    updateItem,
    moveAccount,
    reorderItems,
    sortItems,
    showToast,
    showUndoToast,
    importMerge,
    importReplace,
    importIntoFolder,
    saveItems,
    saveTheme,
    saveLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
