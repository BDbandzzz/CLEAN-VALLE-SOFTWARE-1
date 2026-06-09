import { isActiveState } from '@/core/mappers/domainMappers';
import { supabase } from '@/core/services/supabaseClient';

async function getUserByAuthId(authId) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      type_dni(id_type_dni,dni_type),
      gender(id_gender,gender),
      roles(role_id,role_name,color_hex),
      state_element(id_state,type_state)
    `)
    .eq('auth_id', authId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function mapUser(authUser, user) {
  if (!user.roles?.role_id) {
    throw new Error('Rol no soportado.');
  }

  if (user.deleted_at || !isActiveState(user.id_state)) {
    throw new Error('Usuario inactivo.');
  }

  return {
    id: authUser.id,
    authId: user.auth_id,
    codeUser: user.code_user,
    roleId: user.id_role,
    roleName: user.roles.role_name ?? '',
    roleColor: user.roles.color_hex ?? '',
    firstName: user.first_name ?? '',
    lastName: user.last_name ?? '',
    email: authUser.email ?? '',
    dniUser: user.dni_user ?? '',
    typeDniId: user.id_type_dni,
    typeDni: user.type_dni?.dni_type ?? '',
    genderId: user.id_gender,
    gender: user.gender?.gender ?? '',
    stateId: user.id_state,
    stateName: user.state_element?.type_state ?? '',
    deletedAt: user.deleted_at,
  };
}

async function buildCurrentUser(authUser) {
  if (!authUser) return null;

  const user = await getUserByAuthId(authUser.id);
  return mapUser(authUser, user);
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email ?? '').trim(),
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
  return buildCurrentUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return buildCurrentUser(data.user);
}

export async function updateAuthPassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function updateUserEmail(_authId, email) {
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
