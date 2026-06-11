import { useCallback, useEffect, useState } from 'react';

import { getManagerReportDashboard } from '@/services/managerReportService';

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
