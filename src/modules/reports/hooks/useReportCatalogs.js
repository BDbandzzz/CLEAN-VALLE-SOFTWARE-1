import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getActiveReportCategories,
  getLocalizations,
  getReportStatuses,
  getResolutionQualities,
  getResolutionReviewStatuses,
  getRiskLevels,
  getSubareasByLocalizationId,
  getSubtypesByCategoryId,
} from '@/services/reportCatalogService';

export function useReportCatalogs() {
  const [categories, setCategories] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [resolutionQualities, setResolutionQualities] = useState([]);
  const [resolutionReviewStatuses, setResolutionReviewStatuses] = useState([]);
  const [subtypesByCategory, setSubtypesByCategory] = useState({});
  const [subareasByLocalization, setSubareasByLocalization] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubtypes, setLoadingSubtypes] = useState(false);
  const [loadingSubareas, setLoadingSubareas] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadInitialCatalogs() {
      setIsLoading(true);
      setError('');

      try {
        const [
          nextCategories,
          nextRiskLevels,
          nextLocalizations,
          nextReportStatuses,
          nextResolutionQualities,
          nextResolutionReviewStatuses,
        ] = await Promise.all([
          getActiveReportCategories(),
          getRiskLevels(),
          getLocalizations(),
          getReportStatuses(),
          getResolutionQualities(),
          getResolutionReviewStatuses(),
        ]);

        if (!isMounted) return;
        setCategories(nextCategories);
        setRiskLevels(nextRiskLevels);
        setLocalizations(nextLocalizations);
        setReportStatuses(nextReportStatuses);
        setResolutionQualities(nextResolutionQualities);
        setResolutionReviewStatuses(nextResolutionReviewStatuses);
      } catch (catalogError) {
        if (!isMounted) return;
        setError(catalogError.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialCatalogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadSubtypes = useCallback(
    async (categoryId) => {
      if (!categoryId || subtypesByCategory[categoryId]) return subtypesByCategory[categoryId] ?? [];

      setLoadingSubtypes(true);
      setError('');

      try {
        const category = categories.find((item) => item.id === categoryId);
        const subtypes = (await getSubtypesByCategoryId(categoryId)).map((subtype) => ({
          ...subtype,
          color: category?.color ?? '#6b7280',
        }));
        setSubtypesByCategory((current) => ({ ...current, [categoryId]: subtypes }));
        return subtypes;
      } catch (catalogError) {
        setError(catalogError.message);
        return [];
      } finally {
        setLoadingSubtypes(false);
      }
    },
    [categories, subtypesByCategory]
  );

  const loadSubareas = useCallback(
    async (localizationId) => {
      if (!localizationId || subareasByLocalization[localizationId]) {
        return subareasByLocalization[localizationId] ?? [];
      }

      setLoadingSubareas(true);
      setError('');

      try {
        const subareas = await getSubareasByLocalizationId(localizationId);
        setSubareasByLocalization((current) => ({ ...current, [localizationId]: subareas }));
        return subareas;
      } catch (catalogError) {
        setError(catalogError.message);
        return [];
      } finally {
        setLoadingSubareas(false);
      }
    },
    [subareasByLocalization]
  );

  return useMemo(
    () => ({
      categories,
      riskLevels,
      localizations,
      reportStatuses,
      resolutionQualities,
      resolutionReviewStatuses,
      subtypesByCategory,
      subareasByLocalization,
      isLoading,
      loadingSubtypes,
      loadingSubareas,
      error,
      loadSubtypes,
      loadSubareas,
    }),
    [
      categories,
      error,
      isLoading,
      loadSubareas,
      loadSubtypes,
      loadingSubareas,
      loadingSubtypes,
      localizations,
      reportStatuses,
      resolutionQualities,
      resolutionReviewStatuses,
      riskLevels,
      subareasByLocalization,
      subtypesByCategory,
    ]
  );
}
