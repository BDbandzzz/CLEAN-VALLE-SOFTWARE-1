import { USER_ROLE_IDS } from '@/core/constants/domainConstants';

export function getNotificationRoute(notification, roleId) {
  const entityId = notification?.entityId;

  if (notification?.entityType === 'assignation') {
    return roleId === USER_ROLE_IDS.OPERATOR
      ? '/operator/assignments'
      : '/manager/reports';
  }

  if (notification?.entityType === 'group') {
    return roleId === USER_ROLE_IDS.MANAGER && entityId
      ? `/manager/groups/${entityId}`
      : '/reports/view';
  }

  if (notification?.entityType === 'report') {
    return roleId === USER_ROLE_IDS.MANAGER && entityId
      ? `/manager/reports/${entityId}`
      : '/reports/view';
  }

  if (notification?.entityType === 'resolution') {
    if (roleId === USER_ROLE_IDS.MANAGER) return '/manager/resolutions';
    if (roleId === USER_ROLE_IDS.OPERATOR) return '/operator/resolutions';
    return '/reports/view';
  }

  return '/notifications';
}
