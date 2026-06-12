import { useCallback, useEffect, useState } from 'react';

import { getManagerReportDashboard } from '@/services/managerReportService';
import { showErrorAlert } from '@/core/services/alertService';

export function useManagerReportDashboard(filters) {
  const [dashboard, setDashboard] = useState({
    reports: [],
    total: 0,
    byStatus: [],
    byCategory: [],
    byRisk: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const nextDashboard = await getManagerReportDashboard(filters);
      setDashboard(nextDashboard);
      return nextDashboard;
    } catch (loadError) {
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar la gestión de reportes' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dashboard, isLoading, error, refresh };
}
