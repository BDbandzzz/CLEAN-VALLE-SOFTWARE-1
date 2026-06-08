import { useMemo } from 'react';

import { USER_ROLES, getCatalogOptions } from '@/core/data/catalogs';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { useReports } from '@/modules/reports/context/ReportsContext';

const ROLE_COLORS = {
  estudiante: '#2563eb',
  profesor: '#7c3aed',
  operador: '#0f766e',
  gestor: '#d97706',
  admin: '#991b1b',
};

function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function isActiveUser(user) {
  return user.active !== false && user.status !== 'inactive';
}

export function useAdminDashboard() {
  const { allReports } = useReports();
  const { activeUsers } = useUserManagement();

  return useMemo(() => {
    const users = activeUsers.filter(isActiveUser);
    const reportCategories = getCatalogOptions('reportCategories');
    const reportsByCategory = countBy(allReports, (report) => report.categoryId);
    const totalSubtypes = reportCategories.reduce((total, category) => total + (category.subtypes?.length ?? 0), 0);

    const roleDistribution = Object.entries(USER_ROLES).map(([role, label]) => {
      const value = users.filter((user) => user.role === role).length;
      return {
        id: role,
        label,
        color: ROLE_COLORS[role],
        value,
        percentage: percent(value, users.length),
      };
    });

    const categoryDistribution = reportCategories.map((category) => {
      const value = reportsByCategory[category.id] ?? 0;
      return {
        id: category.id,
        label: category.label,
        color: category.color,
        value,
        subtypes: category.subtypes?.length ?? 0,
        percentage: percent(value, allReports.length),
      };
    });

    const recentReports = [...allReports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      metrics: {
        totalReports: allReports.length,
        activeUsers: users.length,
        reportTypes: reportCategories.length,
        reportSubtypes: totalSubtypes,
      },
      roleDistribution,
      categoryDistribution,
      recentReports,
    };
  }, [activeUsers, allReports]);
}
