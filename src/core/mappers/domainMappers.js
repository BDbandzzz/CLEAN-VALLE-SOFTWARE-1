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

export function isActiveState(stateId) {
  return normalizeNumericId(stateId) === ELEMENT_STATE_IDS.ACTIVE;
}

export function isInactiveState(stateId) {
  return normalizeNumericId(stateId) === ELEMENT_STATE_IDS.INACTIVE;
}
