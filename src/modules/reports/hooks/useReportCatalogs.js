import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getReportCatalogBundle,
  invalidateReportCatalogCache,
} from '@/services/reportCatalogService';
import { showErrorAlert } from '@/core/services/alertService';

const EMPTY_CATALOGS = {
  categories: [],
  riskLevels: [],
  localizations: [],
  reportStatuses: [],
  resolutionQualities: [],
  resolutionReviewStatuses: [],
  subtypesByCategory: {},
  subareasByLocalization: {},
};

export function useReportCatalogs() {
  const [catalogs, setCatalogs] = useState(EMPTY_CATALOGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCatalogs = useCallback(async ({ force = false } = {}) => {
    setIsLoading(true);
    setError('');

    try {
      if (force) invalidateReportCatalogCache();
      const nextCatalogs = await getReportCatalogBundle({ force });
      setCatalogs(nextCatalogs);
      return nextCatalogs;
    } catch (catalogError) {
      setError(catalogError.message);
      showErrorAlert(catalogError, { title: 'No fue posible cargar las opciones del formulario' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const loadSubtypes = useCallback(
    async (categoryId) =>
      catalogs.subtypesByCategory?.[String(categoryId)] ?? [],
    [catalogs.subtypesByCategory]
  );

  const loadSubareas = useCallback(
    async (localizationId) =>
      catalogs.subareasByLocalization?.[String(localizationId)] ?? [],
    [catalogs.subareasByLocalization]
  );

  return useMemo(
    () => ({
      ...catalogs,
      isLoading,
      loadingSubtypes: false,
      loadingSubareas: false,
      error,
      loadSubtypes,
      loadSubareas,
      refreshCatalogs: () => loadCatalogs({ force: true }),
    }),
    [catalogs, error, isLoading, loadCatalogs, loadSubareas, loadSubtypes]
  );
}
