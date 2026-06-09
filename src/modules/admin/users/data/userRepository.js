import {
  isOperatorRoleId,
  normalizeNumericId,
} from '@/core/mappers/domainMappers';
import { USER_ROLE_OPTIONS } from '@/modules/admin/users/constants/userFormOptions';

const USERS_STORAGE_KEY = 'cleanvalle_admin_users_backend_ready_v1';

export function readManagedUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function persistManagedUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function buildManagedUser(formData) {
  const now = new Date().toISOString();
  const roleId = normalizeNumericId(formData.roleId);
  const roleName = USER_ROLE_OPTIONS.find((role) => role.id === roleId)?.label ?? '';

  return {
    id: `usr-${Date.now()}`,
    codeUser: formData.codeUser.trim(),
    roleId,
    roleName,
    password: formData.password,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    dniUser: formData.dniUser.trim(),
    typeDniId: Number(formData.typeDniId),
    genderId: Number(formData.genderId),
    specializationIds: isOperatorRoleId(roleId) ? formData.specializationIds : [],
    active: true,
    source: 'admin',
    createdAt: now,
    updatedAt: now,
  };
}

export function mapUserToForm(user) {
  return {
    codeUser: user?.codeUser ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    dniUser: user?.dniUser ?? '',
    typeDniId: user?.typeDniId ? String(user.typeDniId) : '',
    genderId: user?.genderId ? String(user.genderId) : '',
    roleId: user?.roleId ? String(user.roleId) : '',
    specializationIds: user?.specializationIds ?? [],
    password: '',
    confirmPassword: '',
  };
}

export function buildUpdatedUser(user, formData) {
  const roleId = normalizeNumericId(formData.roleId);
  const roleName = USER_ROLE_OPTIONS.find((role) => role.id === roleId)?.label ?? '';

  return {
    ...user,
    codeUser: formData.codeUser.trim(),
    roleId,
    roleName,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim().toLowerCase(),
    dniUser: formData.dniUser.trim(),
    typeDniId: Number(formData.typeDniId),
    genderId: Number(formData.genderId),
    specializationIds: isOperatorRoleId(roleId) ? formData.specializationIds : [],
    ...(formData.password.trim() ? { password: formData.password } : {}),
    updatedAt: new Date().toISOString(),
  };
}
