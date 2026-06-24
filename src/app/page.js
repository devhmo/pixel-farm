'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import StatsPanel from '../components/StatsPanel';
import GlobalProgress from '../components/GlobalProgress';
import SearchFilter from '../components/SearchFilter';
import AccountCard from '../components/AccountCard';
import FolderCard from '../components/FolderCard';
import EmptyState from '../components/EmptyState';
import FAB from '../components/FAB';
import ToastContainer from '../components/ToastContainer';
import InstallBanner from '../components/InstallBanner';
import AddAccountModal from '../components/modals/AddAccountModal';
import AddFolderModal from '../components/modals/AddFolderModal';
import EditModal from '../components/modals/EditModal';
import NoteModal from '../components/modals/NoteModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import MoveModal from '../components/modals/MoveModal';
import CustomizeModal from '../components/modals/CustomizeModal';
import ImportConfirmModal from '../components/modals/ImportConfirmModal';
import IpModal from '../components/modals/IpModal';
import IpDashboardModal from '../components/modals/IpDashboardModal';
import IpHistoryModal from '../components/modals/IpHistoryModal';
import WelcomeModal from '../components/modals/WelcomeModal';
import AboutModal from '../components/modals/AboutModal';
import SettingsModal from '../components/modals/SettingsModal';
import IpDashboardView from '../components/IpDashboardView';
import { findItem, getItemTimeLeftMs } from '../lib/utils';

export default function Home() {
  const { state, dispatch, t, reorderItems } = useApp();
  const sortableRef = useRef(null);
  const containerRef = useRef(null);

  // Apply theme
  useEffect(() => {
    document.body.className = `${state.theme} ${state.settings.forceDesktop ? 'force-desktop' : ''}`;
    // Apply card style classes
    const b = document.body;
    b.classList.toggle('hide-card-progress', !state.settings.showCardProgress);
    b.classList.toggle('hide-card-pixels', !state.settings.showCardPixels);
    b.classList.toggle('hide-card-time', !state.settings.showCardTime);
    b.classList.toggle('hide-card-finish', !state.settings.showCardFinish);
    b.classList.toggle('hide-card-remaining', !state.settings.showCardRemaining);
    b.classList.toggle('hide-card-notes', !state.settings.showCardNotes);
    b.classList.remove('card-radius-sharp', 'card-radius-normal', 'card-radius-rounded', 'card-radius-pill');
    b.classList.add('card-radius-' + state.settings.cardRadius);
    b.classList.toggle('card-show-border', state.settings.cardBorder);
    b.classList.toggle('card-no-shadow', !state.settings.cardShadow);
    b.classList.toggle('no-animations', !state.settings.cardAnimations);
  }, [state.theme, state.settings]);

  // Apply RTL for Arabic
  useEffect(() => {
    if (state.language === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.removeAttribute('dir');
    }
  }, [state.language]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_ALL_MODALS' });
        dispatch({ type: 'SET_FAB_OPEN', payload: false });
      }
      if (e.key === 'n') dispatch({ type: 'OPEN_MODAL', payload: 'addAccount' });
      if (e.key === 'f') dispatch({ type: 'OPEN_MODAL', payload: 'addFolder' });
      if (e.key === 'd') {
        const newTheme = state.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
        dispatch({ type: 'SET_THEME', payload: newTheme });
      }
      if (e.key === '/') { e.preventDefault(); document.getElementById('search-input')?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.theme, dispatch]);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => {
      document.querySelectorAll('.more-options-menu.show').forEach(m => m.classList.remove('show'));
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Init SortableJS
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Sortable || !containerRef.current) return;
    if (sortableRef.current) {
      sortableRef.current.destroy();
    }
    sortableRef.current = new window.Sortable(containerRef.current, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd: (evt) => {
        reorderItems(evt.oldIndex, evt.newIndex);
      }
    });
    return () => {
      if (sortableRef.current) {
        sortableRef.current.destroy();
        sortableRef.current = null;
      }
    };
  }, [state.currentView, state.currentFolderId, state.masterItems, reorderItems]);

  // Get items to render
  let itemsToRender = [];
  if (state.currentView === 'main') {
    itemsToRender = state.masterItems;
  } else if (state.currentView === 'folder') {
    const folder = findItem(state.masterItems, state.currentFolderId);
    itemsToRender = folder ? folder.accounts || [] : [];
  }

  // Apply search & filter
  const query = state.searchQuery.toLowerCase().trim();
  const status = state.filterStatus;
  itemsToRender = itemsToRender.filter(item => {
    if (query) {
      const name = (item.name || '').toLowerCase();
      const note = (item.note || '').toLowerCase();
      if (item.type === 'account') {
        if (!name.includes(query) && !note.includes(query)) return false;
      } else if (item.type === 'folder') {
        if (!name.includes(query)) return false;
      }
    }
    if (status !== 'all' && item.type === 'account') {
      const cp = Number(item.currentPixels) || 0;
      const cap = Number(item.capacity) || 0;
      const isComplete = cap > 0 && cp >= cap;
      if (status === 'completed' && !isComplete) return false;
      if (status === 'active' && isComplete) return false;
    }
    return true;
  });

  const hasSearch = query || status !== 'all';

  // Card view mode class
  const viewClass = state.settings.cardView === 'compact' ? 'compact-view' : '';

  // IP Dashboard view
  if (state.currentView === 'ip-dashboard') {
    return (
      <>
        <div id="toast-container"><ToastContainer /></div>
        <div className="app-container">
          <Header />
          <IpDashboardView />
        </div>
        <FAB />
        <AllModals />
      </>
    );
  }

  return (
    <>
      <div id="toast-container"><ToastContainer /></div>
      <div className="app-container">
        <Header />
        <InstallBanner />
        {state.settings.showSearch && state.currentView !== 'ip-dashboard' && <SearchFilter />}
        {state.settings.showStats && state.currentView === 'main' && <StatsPanel />}
        {state.settings.showProgress && <GlobalProgress />}
        <main id="items-container" ref={containerRef} className={viewClass}>
          {itemsToRender.length === 0 ? (
            <EmptyState hasSearch={hasSearch} />
          ) : (
            itemsToRender.map(item =>
              item.type === 'account' ? (
                <AccountCard key={item.id} account={item} />
              ) : (
                <FolderCard key={item.id} folder={item} />
              )
            )
          )}
        </main>
      </div>
      <FAB />
      <AllModals />
    </>
  );
}

function AllModals() {
  return (
    <>
      <AddAccountModal />
      <AddFolderModal />
      <EditModal />
      <NoteModal />
      <ConfirmModal />
      <MoveModal />
      <CustomizeModal />
      <ImportConfirmModal />
      <IpModal />
      <IpDashboardModal />
      <IpHistoryModal />
      <WelcomeModal />
      <AboutModal />
      <SettingsModal />
    </>
  );
}
