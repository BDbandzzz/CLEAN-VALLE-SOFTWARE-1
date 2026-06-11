import { useCallback, useEffect, useState } from 'react';

import {
  getOperatorReportDashboard,
  submitReportResolution,
} from '@/services/operatorReportService';

export function useOperatorReports() {
  const [assignedReports, setAssignedReports] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const dashboard = await getOperatorReportDashboard();
      setAssignedReports(dashboard.assigned);
      setResolvedReports(dashboard.resolutions);
      return dashboard;
    } catch (loadError) {
      setError(loadError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitResolution = useCallback(
    async (reportId, values) => {
      const result = await submitReportResolution(reportId, values);
      await refresh();
      return result;
    },
    [refresh]
  );

  return {
    assignedReports,
    resolvedReports,
    isLoading,
    error,
    refresh,
    submitResolution,
  };
}
