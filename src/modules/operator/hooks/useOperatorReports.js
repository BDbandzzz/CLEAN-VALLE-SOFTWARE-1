import { useCallback, useEffect, useState } from 'react';

import {
  getOperatorReportDashboard,
  rejectOperatorAssignment,
  submitOperatorResolution,
} from '@/services/operatorReportService';
import { showErrorAlert } from '@/core/services/alertService';

export function useOperatorReports() {
  const [assignedReports, setAssignedReports] = useState([]);
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [resolvedReports, setResolvedReports] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const dashboard = await getOperatorReportDashboard();
      setAssignedReports(dashboard.assigned);
      setAssignedGroups(dashboard.groupAssignments);
      setResolvedReports(dashboard.resolutions);
      setMetrics(dashboard.metrics);
      return dashboard;
    } catch (loadError) {
      setError(loadError.message);
      showErrorAlert(loadError, { title: 'No fue posible cargar los reportes asignados' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitResolution = useCallback(
    async (sourceType, sourceId, values) => {
      const result = await submitOperatorResolution(
        sourceType,
        sourceId,
        values
      );
      await refresh();
      return result;
    },
    [refresh]
  );

  const rejectAssignment = useCallback(
    async (sourceType, sourceId, reason) => {
      await rejectOperatorAssignment(sourceType, sourceId, reason);
      await refresh();
    },
    [refresh]
  );

  return {
    assignedReports,
    assignedGroups,
    resolvedReports,
    metrics,
    isLoading,
    error,
    refresh,
    submitResolution,
    rejectAssignment,
  };
}
