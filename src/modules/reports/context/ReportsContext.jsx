/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from '@/core/context/AuthContext';
import { showErrorAlert } from '@/core/services/alertService';
import {
  createReport,
  getMyReports,
  getResolvedReports,
} from '@/services/reportService';

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const loadedUserId = useRef(null);
  const reportsRequest = useRef(null);
  const resolvedRequest = useRef(null);
  const [reports, setReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isLoadingResolvedReports, setIsLoadingResolvedReports] =
    useState(false);
  const [error, setError] = useState('');

  const refreshReports = useCallback(
    async ({ force = false } = {}) => {
      if (!userId) {
        setReports([]);
        return [];
      }
      if (loadedUserId.current !== userId) {
        loadedUserId.current = userId;
        reportsRequest.current = null;
        setReports([]);
      }
      if (!force && reportsRequest.current) return reportsRequest.current;

      setIsLoadingReports(true);
      setError('');
      reportsRequest.current = getMyReports()
        .then((nextReports) => {
          setReports(nextReports);
          return nextReports;
        })
        .catch((loadError) => {
          setError(loadError.message);
          showErrorAlert(loadError, { title: 'No fue posible cargar tus reportes' });
          reportsRequest.current = null;
          throw loadError;
        })
        .finally(() => setIsLoadingReports(false));

      return reportsRequest.current;
    },
    [userId]
  );

  const refreshResolvedReports = useCallback(
    async ({ force = false } = {}) => {
      if (!force && resolvedRequest.current) return resolvedRequest.current;

      setIsLoadingResolvedReports(true);
      setError('');
      resolvedRequest.current = getResolvedReports()
        .then((nextReports) => {
          setResolvedReports(nextReports);
          return nextReports;
        })
        .catch((loadError) => {
          setError(loadError.message);
          showErrorAlert(loadError, { title: 'No fue posible cargar los reportes resueltos' });
          resolvedRequest.current = null;
          throw loadError;
        })
        .finally(() => setIsLoadingResolvedReports(false));

      return resolvedRequest.current;
    },
    []
  );

  const addReport = useCallback(async (formData) => {
    const createdReport = await createReport(formData);
    reportsRequest.current = null;
    return createdReport;
  }, []);

  const value = useMemo(
    () => ({
      reports,
      resolvedReports,
      isLoadingReports,
      isLoadingResolvedReports,
      error,
      addReport,
      refreshReports,
      refreshResolvedReports,
    }),
    [
      addReport,
      error,
      isLoadingReports,
      isLoadingResolvedReports,
      refreshReports,
      refreshResolvedReports,
      reports,
      resolvedReports,
    ]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error('useReports debe ser usado dentro de ReportsProvider');
  return context;
}
