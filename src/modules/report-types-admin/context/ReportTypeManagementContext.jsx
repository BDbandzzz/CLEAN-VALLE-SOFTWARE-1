/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createManagedReportType,
  listManagedReportTypes,
  setManagedReportTypeActive,
  updateManagedReportType,
} from '@/services/adminReportTypeService';
import { showErrorAlert } from '@/core/services/alertService';

const ReportTypeManagementContext = createContext(null);

export function ReportTypeManagementProvider({ children }) {
  const [reportTypes, setReportTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');

  const loadReportTypes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await listManagedReportTypes();
      setReportTypes(data);
      return data;
    } catch (loadError) {
      setReportTypes([]);
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar los tipos de reporte' });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReportTypes();
  }, [loadReportTypes]);

  const runMutation = useCallback(
    async (operation) => {
      setIsMutating(true);
      setError('');
      try {
        const result = await operation();
        await loadReportTypes();
        return result;
      } catch (mutationError) {
        setError(mutationError.message);
        showErrorAlert(mutationError);
        throw mutationError;
      } finally {
        setIsMutating(false);
      }
    },
    [loadReportTypes]
  );

  const createReportType = useCallback(
    (formData) => runMutation(() => createManagedReportType(formData)),
    [runMutation]
  );

  const updateReportType = useCallback(
    (typeId, formData) =>
      runMutation(() => updateManagedReportType(typeId, formData)),
    [runMutation]
  );

  const deleteReportType = useCallback(
    (typeId) =>
      runMutation(() => setManagedReportTypeActive(typeId, false)),
    [runMutation]
  );

  const value = useMemo(
    () => ({
      reportTypes,
      activeReportTypes: reportTypes.filter((type) => type.active),
      isLoading,
      isMutating,
      error,
      loadReportTypes,
      createReportType,
      updateReportType,
      deleteReportType,
    }),
    [
      reportTypes,
      isLoading,
      isMutating,
      error,
      loadReportTypes,
      createReportType,
      updateReportType,
      deleteReportType,
    ]
  );

  return (
    <ReportTypeManagementContext.Provider value={value}>
      {children}
    </ReportTypeManagementContext.Provider>
  );
}

export function useReportTypeManagement() {
  const context = useContext(ReportTypeManagementContext);
  if (!context) {
    throw new Error('useReportTypeManagement debe usarse dentro de ReportTypeManagementProvider');
  }
  return context;
}
