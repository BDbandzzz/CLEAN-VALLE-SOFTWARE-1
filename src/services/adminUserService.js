import { supabase } from '@/services/supabaseClient';
import { AUTH_REDIRECT_URLS } from '@/core/constants/authRoutes';

const CREATE_USER_FUNCTION = 'admin-create-user';
const USER_CATALOG_CACHE_KEY = 'cleanvalle_user_catalogs_v1';
const USER_CATALOG_CACHE_TTL = 60 * 60 * 1000;

let userCatalogMemory = null;
let userCatalogPromise = null;

function readUserCatalogCache() {
  if (userCatalogMemory) return userCatalogMemory;

  try {
    const cached = JSON.parse(localStorage.getItem(USER_CATALOG_CACHE_KEY));
    if (
      cached?.savedAt &&
      Date.now() - cached.savedAt < USER_CATALOG_CACHE_TTL &&
      cached.data
    ) {
      userCatalogMemory = cached.data;
      return cached.data;
    }
  } catch {
    try {
      localStorage.removeItem(USER_CATALOG_CACHE_KEY);
    } catch {
      // El almacenamiento puede estar bloqueado; se usara solo memoria.
    }
  }

  return null;
}

function cacheUserCatalogs(data) {
  userCatalogMemory = data;

  try {
    localStorage.setItem(
      USER_CATALOG_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // El cache en memoria permanece disponible.
  }

  return data;
}

export function invalidateUserManagementCatalogCache() {
  userCatalogMemory = null;
  userCatalogPromise = null;

  try {
    localStorage.removeItem(USER_CATALOG_CACHE_KEY);
  } catch {
    // No hay almacenamiento persistente que invalidar.
  }
}

async function getFunctionErrorMessage(error) {
  if (!error?.context) return error?.message;

  try {
    const body = await error.context.json();
    return body?.error ?? error.message;
  } catch {
    return error.message;
  }
}

export async function getUserManagementCatalogs() {
  const cached = readUserCatalogCache();
  if (cached) return cached;
  if (userCatalogPromise) return userCatalogPromise;

  userCatalogPromise = supabase
    .rpc('rpc_admin_user_catalogs')
    .then(({ data, error }) => {
      if (error) throw new Error(error.message);
      return cacheUserCatalogs(data);
    })
    .finally(() => {
      userCatalogPromise = null;
    });

  return userCatalogPromise;
}

export async function listManagedUsers(filters = {}) {
  const { data, error } = await supabase.rpc('rpc_admin_list_users', {
    p_page: filters.page ?? 1,
    p_page_size: filters.pageSize ?? 10,
    p_search: filters.search ?? '',
    p_state_id: filters.stateId ? Number(filters.stateId) : null,
    p_role_id: filters.roleId ? Number(filters.roleId) : null,
  });

  if (error) throw new Error(error.message);

  return {
    users: data?.users ?? [],
    total: data?.total ?? 0,
  };
}

export async function createManagedUser(formData) {
  const { data, error } = await supabase.functions.invoke(
    CREATE_USER_FUNCTION,
    {
      body: {
        codeUser: formData.codeUser.trim(),
        roleId: Number(formData.roleId),
        typeDniId: Number(formData.typeDniId),
        genderId: Number(formData.genderId),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dniUser: formData.dniUser.trim(),
        email: formData.email.trim().toLowerCase(),
        specializationIds: formData.specializationIds.map(Number),
        redirectTo: AUTH_REDIRECT_URLS.userInvitation,
      },
    }
  );

  if (error) {
    throw new Error(
      (await getFunctionErrorMessage(error)) ||
        'No fue posible enviar la invitacion.'
    );
  }

  if (data?.error) throw new Error(data.error);
  return data.user;
}

export async function updateManagedUser(authId, formData) {
  const { data, error } = await supabase.rpc('rpc_admin_update_user', {
    p_auth_id: authId,
    p_code_user: formData.codeUser.trim(),
    p_role_id: Number(formData.roleId),
    p_type_dni_id: Number(formData.typeDniId),
    p_gender_id: Number(formData.genderId),
    p_first_name: formData.firstName.trim(),
    p_last_name: formData.lastName.trim(),
    p_dni_user: formData.dniUser.trim(),
    p_specialization_ids: formData.specializationIds.map(Number),
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function setManagedUserActive(authId, active) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_set_user_state',
    {
      p_auth_id: authId,
      p_active: Boolean(active),
    }
  );

  if (error) throw new Error(error.message);
  return data;
}
