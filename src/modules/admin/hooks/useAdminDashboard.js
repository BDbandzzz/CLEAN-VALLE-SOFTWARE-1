import { useMemo } from 'react';

import { USER_ROLES } from '@/core/data/cleanvalleSchema';
import { useCatalogs } from '@/core/context/CatalogContext';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { useReports } from '@/modules/reports/context/ReportsContext';

const ACTIVE_REPORT_STATUSES = new Set(['pendiente', 'en-revision', 'asignado', 'en-proceso']);

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
  const { getOptions } = useCatalogs();

  return useMemo(() => {
    const users = activeUsers.filter(isActiveUser);
    const reportStatuses = getOptions('reportStatuses');
    const reportCategories = getOptions('reportCategories');
    const riskLevels = getOptions('riskLevels');
    const activeReports = allReports.filter((report) => ACTIVE_REPORT_STATUSES.has(report.statusId));
    const reportsByStatus = countBy(allReports, (report) => report.statusId);
    const reportsByCategory = countBy(allReports, (report) => report.categoryId);
    const reportsByRisk = countBy(allReports, (report) => report.riskLevelId);
    const totalSubtypes = reportCategories.reduce((total, category) => total + (category.subtypes?.length ?? 0), 0);
    const pendingReviewReports = allReports.filter((report) => report.resolution?.reviewStatusId === 'enviada');
    const unassignedReports = activeReports.filter((report) => !report.assignedTo);
    const highRiskReports = allReports.filter((report) => report.riskLevelId === 'alto' || report.riskLevelId === 'critico');
    const operators = users.filter((user) => user.role === 'operador');

    const roleDistribution = Object.entries(USER_ROLES).map(([role, label]) => {
      const value = users.filter((user) => user.role === role).length;
      return {
        id: role,
        label,
        value,
        percentage: percent(value, users.length),
      };
    });

    const statusDistribution = reportStatuses.map((status) => {
      const value = reportsByStatus[status.id] ?? 0;
      return {
        id: status.id,
        label: status.label,
        color: status.color,
        value,
        percentage: percent(value, allReports.length),
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

    const riskDistribution = riskLevels.map((risk) => {
      const value = reportsByRisk[risk.id] ?? 0;
      return {
        id: risk.id,
        label: risk.label,
        color: risk.color,
        value,
        percentage: percent(value, allReports.length),
      };
    });

    const operatorWorkload = operators.map((operator) => {
      const assignedReports = allReports.filter((report) => String(report.assignedTo) === String(operator.id));
      const activeAssigned = assignedReports.filter((report) => ACTIVE_REPORT_STATUSES.has(report.statusId));
      const resolvedReports = assignedReports.filter((report) => Boolean(report.resolution));

      return {
        id: operator.id,
        name: `${operator.firstName} ${operator.lastName}`,
        activeAssigned: activeAssigned.length,
        resolved: resolvedReports.length,
        specializations: operator.specializationIds?.length ?? 0,
      };
    });

    const recentReports = [...allReports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      metrics: {
        activeReports: activeReports.length,
        totalReports: allReports.length,
        activeUsers: users.length,
        operators: operators.length,
        reportTypes: reportCategories.length,
        reportSubtypes: totalSubtypes,
        pendingReviews: pendingReviewReports.length,
        highRiskReports: highRiskReports.length,
        unassignedReports: unassignedReports.length,
      },
      roleDistribution,
      statusDistribution,
      categoryDistribution,
      riskDistribution,
      operatorWorkload,
      recentReports,
    };
  }, [activeUsers, allReports, getOptions]);
}
