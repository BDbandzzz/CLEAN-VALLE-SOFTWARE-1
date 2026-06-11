import { getRoleDisplayLabel } from '@/core/mappers/domainMappers';

function getPercentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function mapUsersByRole(roleCounts, roles, totalActiveUsers) {
  const countByRole = roleCounts.reduce((counts, role) => {
    counts.set(String(role.roleId), role.count);
    return counts;
  }, new Map());

  return roles.map((role) => {
    const value = countByRole.get(String(role.role_id)) ?? 0;

    return {
      id: role.role_id,
      label: getRoleDisplayLabel(role.role_id, role.role_name),
      description: role.description ?? '',
      color: role.color_hex || '#6b7280',
      value,
      percentage: getPercentage(value, totalActiveUsers),
    };
  });
}
