import { useCallback, useEffect, useState } from 'react';

import { mapUsersByRole } from '@/modules/dashboard-admin/utils/dashboardMappers';
import { getAdminDashboardData } from '@/services/adminDashboardService';
import { showErrorAlert } from '@/core/services/alertService';

const INITIAL_METRICS = {
  activeUsers: 0,
  totalReports: 0,
  activeCategories: 0,
  totalSubcategories: 0,
};

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [systemDistribution, setSystemDistribution] = useState([]);
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
      setSystemDistribution([
        {
          id: 'users',
          label: 'Usuarios',
          value: data.metrics.activeUsers,
          color: '#0f766e',
        },
        {
          id: 'reports',
          label: 'Reportes',
          value: data.metrics.totalReports,
          color: '#2563eb',
        },
        {
          id: 'categories',
          label: 'Categorias',
          value: data.metrics.activeCategories,
          color: '#ca8a04',
        },
        {
          id: 'subcategories',
          label: 'Razones',
          value: data.metrics.totalSubcategories,
          color: '#7c3aed',
        },
      ]);
    } catch (dashboardError) {
      setError(dashboardError.message);
      showErrorAlert(dashboardError, { title: 'No fue posible cargar el panel administrativo' });
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
    systemDistribution,
    isLoading,
    error,
    reload: loadDashboard,
  };
}
