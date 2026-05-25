/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { API_BASE_URL } from '@/core/constants/api';
import {
  EMPTY_CATALOGS,
  findCatalogOption,
  getCatalogPayloadId,
  hasCatalogOptions,
  normalizeCatalogList,
  resolveCatalogLabel,
} from '@/core/catalogs/catalogUtils';

const CatalogContext = createContext(null);
const CURRENT_TOKEN_KEY = 'auth_token';

const CATALOG_ENDPOINTS = {
  genders: '/api/catalogs/genders',
  roles: '/api/catalogs/roles',
  typeDni: '/api/catalogs/type-dni',
  typeReport: '/api/catalogs/type-report',
  statusReport: '/api/catalogs/status-report',
  riskLevel: '/api/catalogs/risk-level',
};

async function fetchCatalog(path) {
  const token = localStorage.getItem(CURRENT_TOKEN_KEY);
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await fetch(`${API_BASE_URL}${path}`, { headers });

  if (!response.ok) {
    throw new Error(`Catalog request failed: ${path} (${response.status})`);
  }

  return response.json();
}

export function CatalogProvider({ children }) {
  const [catalogs, setCatalogs] = useState(EMPTY_CATALOGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const catalogsRef = useRef(EMPTY_CATALOGS);

  useEffect(() => {
    catalogsRef.current = catalogs;
  }, [catalogs]);

  const refreshCatalogs = useCallback(async () => {
    setIsLoading(true);

    const results = await Promise.all(
      Object.entries(CATALOG_ENDPOINTS).map(async ([key, path]) => {
        try {
          const data = await fetchCatalog(path);
          return [key, normalizeCatalogList(data, key), null];
        } catch (requestError) {
          console.error(requestError);
          return [key, [], requestError];
        }
      })
    );

    const nextCatalogs = {};
    const failedKeys = [];

    results.forEach(([key, options, requestError]) => {
      nextCatalogs[key] = options;
      if (requestError) failedKeys.push(key);
    });

    setCatalogs(nextCatalogs);
    setError(failedKeys.length ? `No se pudieron cargar estos catalogos: ${failedKeys.join(', ')}` : '');
    setIsLoading(false);

    catalogsRef.current = nextCatalogs;
    return nextCatalogs;
  }, []);

  useEffect(() => {
    Promise.resolve().then(refreshCatalogs);
  }, [refreshCatalogs]);

  const getOptions = useCallback(
    (catalogKey) => catalogs[catalogKey] ?? [],
    [catalogs]
  );

  const findOption = useCallback(
    (catalogKey, value) => findCatalogOption(catalogs[catalogKey] ?? [], value, catalogKey),
    [catalogs]
  );

  const getLabel = useCallback(
    (catalogKey, value, fallback = '') => resolveCatalogLabel(catalogs[catalogKey] ?? [], value, fallback, catalogKey),
    [catalogs]
  );

  const getPayloadId = useCallback(
    (catalogKey, value) => getCatalogPayloadId(catalogs[catalogKey] ?? [], value, catalogKey),
    [catalogs]
  );

  const hasOptions = useCallback(
    (catalogKey) => hasCatalogOptions(catalogs, catalogKey),
    [catalogs]
  );

  const value = useMemo(
    () => ({
      catalogs,
      isLoading,
      error,
      refreshCatalogs,
      getOptions,
      findOption,
      getLabel,
      getPayloadId,
      hasOptions,
    }),
    [catalogs, isLoading, error, refreshCatalogs, getOptions, findOption, getLabel, getPayloadId, hasOptions]
  );

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogs() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalogs debe ser usado dentro de CatalogProvider');
  }
  return context;
}
