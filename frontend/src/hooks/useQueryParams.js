import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_PARAMS = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: '',
  status: '',
  priority: '',
  projectId: '',
  view: 'table',
};

export const useQueryParams = (defaultOverrides) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current params directly from searchParams
  const searchParamsString = searchParams.toString();

  const params = useMemo(() => {
    const sp = new URLSearchParams(searchParamsString);
    const defaults = { ...DEFAULT_PARAMS, ...defaultOverrides };

    const pageStr = sp.get('page');
    const limitStr = sp.get('limit');
    const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : defaults.page;
    const limit = limitStr ? Math.max(1, parseInt(limitStr, 10) || 10) : defaults.limit;
    const sortBy = sp.get('sortBy') || defaults.sortBy;
    const sortOrder = (sp.get('sortOrder') || defaults.sortOrder).toLowerCase();
    const search = sp.get('search') || '';
    const status = sp.get('status') || '';
    const priority = sp.get('priority') || '';
    const projectId = sp.get('projectId') || '';
    const view = sp.get('view') || defaults.view;

    return {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      priority,
      projectId,
      view,
    };
  }, [searchParamsString]);

  // Clean object for API consumption
  const apiParams = useMemo(() => {
    const result = {};
    if (params.page) result.page = params.page;
    if (params.limit) result.limit = params.limit;
    if (params.sortBy) result.sortBy = params.sortBy;
    if (params.sortOrder) result.sortOrder = params.sortOrder;
    if (params.search) result.search = params.search;
    if (params.status) result.status = params.status;
    if (params.priority) result.priority = params.priority;
    if (params.projectId) result.projectId = params.projectId;
    return result;
  }, [
    params.page,
    params.limit,
    params.sortBy,
    params.sortOrder,
    params.search,
    params.status,
    params.priority,
    params.projectId,
  ]);

  // Update query params in URL
  const setParams = useCallback((newParams, options = {}) => {
    const { resetPage = false } = options;

    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || (key === 'page' && Number(value) === 1)) {
          updated.delete(key);
        } else {
          updated.set(key, String(value));
        }
      });

      if (resetPage && !('page' in newParams)) {
        updated.delete('page');
      }

      return updated;
    }, { replace: true });
  }, [setSearchParams]);

  // Helper setter methods
  const setPage = useCallback((page) => {
    setParams({ page });
  }, [setParams]);

  const setLimit = useCallback((limit) => {
    setParams({ limit, page: 1 });
  }, [setParams]);

  const setSearch = useCallback((search) => {
    setParams({ search }, { resetPage: true });
  }, [setParams]);

  const setSort = useCallback((columnKey) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      const currentSortBy = updated.get('sortBy') || DEFAULT_PARAMS.sortBy;
      const currentSortOrder = updated.get('sortOrder') || DEFAULT_PARAMS.sortOrder;

      let nextOrder = 'asc';
      if (currentSortBy === columnKey) {
        nextOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      }

      updated.set('sortBy', columnKey);
      updated.set('sortOrder', nextOrder);
      updated.delete('page'); // Reset to page 1 on sort change
      return updated;
    }, { replace: true });
  }, [setSearchParams]);

  const setFilter = useCallback((key, value) => {
    setParams({ [key]: value }, { resetPage: true });
  }, [setParams]);

  const setView = useCallback((view) => {
    setParams({ view });
  }, [setParams]);

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams();
      const view = prev.get('view');
      if (view) updated.set('view', view);
      return updated;
    }, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(params.search || params.status || params.priority || params.projectId);
  }, [params]);

  return {
    ...params,
    apiParams,
    hasActiveFilters,
    setParams,
    setPage,
    setLimit,
    setSearch,
    setSort,
    setFilter,
    setView,
    clearFilters,
  };
};
