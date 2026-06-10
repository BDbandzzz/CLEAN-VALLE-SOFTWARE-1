import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { isActiveState } from '@/core/mappers/domainMappers';
import { supabase } from '@/services/supabaseClient';

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

  if (data.id_role !== USER_ROLE_IDS.OPERATOR) {
    return { ...data, specializations: [] };
  }

  const { data: assignments, error: specializationError } = await supabase
    .from('operator_specialization')
    .select(`
      id_type_specialization,
      type_specialization(
        id_type_specialization,
        id_category,
        name_specialization,
        type_category(id_category,name,color_hex)
      )
    `)
    .eq('operator_uuid', authId);

  if (specializationError) {
    throw new Error(specializationError.message);
  }

  return {
    ...data,
    specializations: (assignments ?? [])
      .map((assignment) => assignment.type_specialization)
      .filter(Boolean),
  };
}

function mapUser(authUser, user) {
  if (authUser.user_metadata?.invitation_pending === true) {
    throw new Error('Debes completar la invitación antes de ingresar.');
  }

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
    specializationIds: (user.specializations ?? []).map(
      (specialization) => specialization.id_type_specialization
    ),
    specializations: (user.specializations ?? []).map((specialization) => ({
      id: specialization.id_type_specialization,
      categoryId: specialization.id_category,
      label: specialization.name_specialization,
      categoryName: specialization.type_category?.name ?? '',
      categoryColor: specialization.type_category?.color_hex ?? '#6b7280',
    })),
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

export async function updateAuthPassword(currentPassword, newPassword) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    throw new Error('No fue posible verificar la sesión actual.');
  }

  const { error: verificationError } =
    await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword,
    });

  if (verificationError) {
    throw new Error('La contraseña actual no es correcta.');
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw new Error(updateError.message);
  }

  return true;
}

export async function updateUserEmail(email) {
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
