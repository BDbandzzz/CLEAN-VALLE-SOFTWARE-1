import { supabase } from '@/services/supabaseClient';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

export async function getAdminDashboardData() {
  const { data, error } = await supabase.rpc('rpc_admin_dashboard');

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.dashboard.admin);
  }
  return data;
}
