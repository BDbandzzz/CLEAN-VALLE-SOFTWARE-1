/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from 'react';

import {
  CAMPUS_LOCATIONS,
  DOCUMENT_TYPES,
  GENDERS,
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  RISK_LEVELS,
} from '@/core/data/cleanvalleSchema';

const CatalogContext = createContext(null);

const CATALOGS = {
  documentTypes: DOCUMENT_TYPES,
  genders: GENDERS,
  reportCategories: REPORT_CATEGORIES,
  riskLevels: RISK_LEVELS,
  reportStatuses: REPORT_STATUSES,
  campusLocations: CAMPUS_LOCATIONS,
};

export function CatalogProvider({ children }) {
  const getOptions = useCallback((catalogKey) => CATALOGS[catalogKey] ?? [], []);

  const findOption = useCallback(
    (catalogKey, id) => getOptions(catalogKey).find((option) => String(option.id) === String(id)) ?? null,
    [getOptions]
  );

  const getLabel = useCallback(
    (catalogKey, id, fallback = '') => findOption(catalogKey, id)?.label ?? fallback,
    [findOption]
  );

  const hasOptions = useCallback(
    (catalogKey) => getOptions(catalogKey).length > 0,
    [getOptions]
  );

  const value = useMemo(
    () => ({
      catalogs: CATALOGS,
      isLoading: false,
      error: '',
      refreshCatalogs: async () => CATALOGS,
      getOptions,
      findOption,
      getLabel,
      hasOptions,
    }),
    [getOptions, findOption, getLabel, hasOptions]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalogs() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalogs debe ser usado dentro de CatalogProvider');
  }
  return context;
}
