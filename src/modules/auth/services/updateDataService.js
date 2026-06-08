import { supabase } from '@/core/services/supabaseClient';


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
