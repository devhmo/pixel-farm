'use client';

import { useApp } from '../context/AppContext';

export default function SearchFilter() {
  const { state, dispatch, t } = useApp();

  return (
    <div className="search-filter-bar" id="search-filter-bar">
      <input
        type="text"
        id="search-input"
        placeholder={t('searchPlaceholder')}
        value={state.searchQuery}
        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
      />
      <select
        id="filter-status"
        value={state.filterStatus}
        onChange={(e) => dispatch({ type: 'SET_FILTER', payload: e.target.value })}
      >
        <option value="all">{t('all')}</option>
        <option value="active">{t('activeFilter')}</option>
        <option value="completed">{t('completedFilter')}</option>
      </select>
    </div>
  );
}
