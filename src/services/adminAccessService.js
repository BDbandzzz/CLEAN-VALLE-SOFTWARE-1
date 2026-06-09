import { ELEMENT_STATE_IDS, USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { supabase } from '@/services/supabaseClient';

export async function requireAdminSession() {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error('Debes iniciar sesión para realizar esta operación.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('auth_id,id_role,id_state,deleted_at')
    .eq('auth_id', authData.user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (
    profile.id_role !== USER_ROLE_IDS.ADMIN ||
    profile.id_state !== ELEMENT_STATE_IDS.ACTIVE ||
    profile.deleted_at
  ) {
    throw new Error('Esta operación requiere una cuenta de administrador activa.');
  }

  return authData.user;
}
