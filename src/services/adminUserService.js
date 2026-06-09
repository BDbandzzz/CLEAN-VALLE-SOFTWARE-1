import { ELEMENT_STATE_IDS, USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { requireAdminSession } from '@/services/adminAccessService';
import { supabase } from '@/services/supabaseClient';

const ADMIN_USERS_FUNCTION = 'admin-users';

function mapSpecialization(row) {
  return {
    id: row.id_type_specialization,
    categoryId: row.id_category,
    label: row.name_specialization,
    categoryName: row.type_category?.name ?? '',
    categoryColor: row.type_category?.color_hex ?? '#6b7280',
  };
}

function mapManagedUser(row) {
  return {
    id: row.auth_id,
    authId: row.auth_id,
    codeUser: row.code_user ?? '',
    roleId: row.id_role,
    roleName: row.roles?.role_name ?? '',
    roleColor: row.roles?.color_hex ?? '#6b7280',
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    email: row.email ?? '',
    dniUser: row.dni_user ?? '',
    typeDniId: row.id_type_dni,
    typeDni: row.type_dni?.dni_type ?? '',
    genderId: row.id_gender,
    gender: row.gender?.gender ?? '',
    stateId: row.id_state,
    stateName: row.state_element?.type_state ?? '',
    active: row.id_state === ELEMENT_STATE_IDS.ACTIVE && !row.deleted_at,
    deletedAt: row.deleted_at,
    specializationIds: (row.specializations ?? []).map(
      (specialization) => specialization.id_type_specialization
    ),
    specializations: (row.specializations ?? []).map(mapSpecialization),
    currentActiveReports: row.operator_profile?.current_active_reports ?? 0,
    maxActiveReports: row.operator_profile?.max_active_reports ?? null,
  };
}

async function invokeAdminUsers(action, payload = {}) {
  await requireAdminSession();

  const { data, error } = await supabase.functions.invoke(ADMIN_USERS_FUNCTION, {
    body: { action, payload },
  });

  if (error) {
    let message = error.message;
    if (error.context) {
      try {
        const body = await error.context.json();
        message = body?.error ?? message;
      } catch {
        // Conserva el mensaje original si la respuesta no contiene JSON.
      }
    }
    throw new Error(message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function getUserManagementCatalogs() {
  await requireAdminSession();

  const [rolesResult, documentTypesResult, gendersResult, specializationsResult] =
    await Promise.all([
      supabase
        .from('roles')
        .select('role_id,role_name,color_hex')
        .order('role_id', { ascending: true }),
      supabase
        .from('type_dni')
        .select('id_type_dni,dni_type')
        .order('dni_type', { ascending: true }),
      supabase
        .from('gender')
        .select('id_gender,gender')
        .order('id_gender', { ascending: true }),
      supabase
        .from('type_specialization')
        .select(`
          id_type_specialization,
          id_category,
          name_specialization,
          type_category(id_category,name,color_hex,id_state)
        `)
        .order('name_specialization', { ascending: true }),
    ]);

  const firstError = [
    rolesResult.error,
    documentTypesResult.error,
    gendersResult.error,
    specializationsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(firstError.message);
  }

  return {
    roles: (rolesResult.data ?? []).map((role) => ({
      id: role.role_id,
      label: role.role_name,
      color: role.color_hex ?? '#6b7280',
    })),
    creatableRoles: (rolesResult.data ?? [])
      .filter((role) => role.role_id !== USER_ROLE_IDS.ADMIN)
      .map((role) => ({
        id: role.role_id,
        label: role.role_name,
        color: role.color_hex ?? '#6b7280',
      })),
    documentTypes: (documentTypesResult.data ?? []).map((type) => ({
      id: type.id_type_dni,
      label: type.dni_type,
    })),
    genders: (gendersResult.data ?? []).map((gender) => ({
      id: gender.id_gender,
      label: gender.gender,
    })),
    specializations: (specializationsResult.data ?? [])
      .filter(
        (specialization) =>
          specialization.type_category?.id_state === ELEMENT_STATE_IDS.ACTIVE
      )
      .map(mapSpecialization),
  };
}

export async function listManagedUsers(filters = {}) {
  const response = await invokeAdminUsers('list', {
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    search: filters.search ?? '',
    stateId: filters.stateId ?? null,
    roleId: filters.roleId ?? null,
  });

  return {
    users: (response.users ?? []).map(mapManagedUser),
    total: response.total ?? 0,
  };
}

export async function createManagedUser(formData) {
  const response = await invokeAdminUsers('create', {
    codeUser: formData.codeUser.trim(),
    roleId: Number(formData.roleId),
    typeDniId: Number(formData.typeDniId),
    genderId: Number(formData.genderId),
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    dniUser: formData.dniUser.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    specializationIds: formData.specializationIds.map(Number),
  });

  return mapManagedUser(response.user);
}

export async function updateManagedUser(authId, formData) {
  const response = await invokeAdminUsers('update', {
    authId,
    codeUser: formData.codeUser.trim(),
    roleId: Number(formData.roleId),
    typeDniId: Number(formData.typeDniId),
    genderId: Number(formData.genderId),
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    dniUser: formData.dniUser.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password || null,
    specializationIds: formData.specializationIds.map(Number),
  });

  return mapManagedUser(response.user);
}

export async function setManagedUserActive(authId, active) {
  const response = await invokeAdminUsers(active ? 'reactivate' : 'deactivate', {
    authId,
  });

  return mapManagedUser(response.user);
}
