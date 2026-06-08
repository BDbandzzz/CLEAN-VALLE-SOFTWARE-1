import { supabase } from '@/core/services/supabaseClient';

const ROLE_BY_ID = Object.freeze({
  1: 'estudiante',
  2: 'profesor',
  3: 'operador',
  4: 'gestor',
  5: 'admin',
});

async function getUserByAuthId(authId) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      type_dni(id_type_dni,dni_type),
      gender(id_gender,gender),
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
  const role = ROLE_BY_ID[user.id_role];

  if (!role) {
    throw new Error('Rol no soportado.');
  }

  const state = user.state_element?.type_state ?? '';

  if (user.deleted_at || state.trim().toLowerCase() !== 'activo') {
    throw new Error('Usuario inactivo.');
  }

  return {
    id: authUser.id,
    authId: user.auth_id,
    codeUser: user.code_user,
    roleId: user.id_role,
    role,
    firstName: user.first_name ?? '',
    lastName: user.last_name ?? '',
    email: authUser.email ?? '',
    dniUser: user.dni_user ?? '',
    typeDniId: user.id_type_dni,
    typeDni: user.type_dni?.dni_type ?? '',
    genderId: user.id_gender,
    gender: user.gender?.gender ?? '',
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
