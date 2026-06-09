import { useCallback, useEffect, useState } from 'react';

import { getAdminDashboardData } from '@/modules/admin/dashboard/services/adminDashboardService';
import { mapUsersByRole } from '@/modules/admin/dashboard/utils/dashboardMappers';

const INITIAL_METRICS = {
  activeUsers: 0,
  totalReports: 0,
  activeCategories: 0,
  totalSubcategories: 0,
};

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAdminDashboardData();
      setMetrics(data.metrics);
      setRoleDistribution(
        mapUsersByRole(data.roleCounts, data.roles, data.metrics.activeUsers)
      );
    } catch (dashboardError) {
      setError(dashboardError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    metrics,
    roleDistribution,
    isLoading,
    error,
    reload: loadDashboard,
  };
}
