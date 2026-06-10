import { supabase } from '@/services/supabaseClient';

export async function getAdminDashboardData() {
  const { data, error } = await supabase.rpc('rpc_admin_dashboard');

  if (error) throw new Error(error.message);
  return data;
}
