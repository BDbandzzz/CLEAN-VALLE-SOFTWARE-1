import {
  ELEMENT_STATE_IDS,
  USER_ROLE_IDS,
} from '@/core/constants/domainConstants';

export function normalizeNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

export function isRoleId(roleId, expectedRoleId) {
  return normalizeNumericId(roleId) === expectedRoleId;
}

export function isOperatorRoleId(roleId) {
  return isRoleId(roleId, USER_ROLE_IDS.OPERATOR);
}

export function getRoleDisplayLabel(roleId, roleName = '') {
  if (isRoleId(roleId, USER_ROLE_IDS.ADMIN)) return 'Administrador';
  if (isRoleId(roleId, USER_ROLE_IDS.MANAGER)) return 'Gestor administrativo';
  if (isRoleId(roleId, USER_ROLE_IDS.OPERATOR)) return 'Personal administrativo';
  if (isRoleId(roleId, USER_ROLE_IDS.STUDENT)) return 'Estudiante';
  if (isRoleId(roleId, USER_ROLE_IDS.TEACHER)) return 'Docente';

  return roleName || 'Rol sin nombre';
}

export function isActiveState(stateId) {
  return normalizeNumericId(stateId) === ELEMENT_STATE_IDS.ACTIVE;
}

export function isInactiveState(stateId) {
  return normalizeNumericId(stateId) === ELEMENT_STATE_IDS.INACTIVE;
}
