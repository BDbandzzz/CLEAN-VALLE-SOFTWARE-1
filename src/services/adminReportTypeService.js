import { supabase } from '@/services/supabaseClient';
import { invalidateReportCatalogCache } from '@/services/reportCatalogService';
import { invalidateUserManagementCatalogCache } from '@/services/adminUserService';

function invalidateCategoryCaches() {
  invalidateReportCatalogCache();
  invalidateUserManagementCatalogCache();
}

export async function listManagedReportTypes() {
  const { data, error } = await supabase.rpc('rpc_admin_list_report_types');

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createManagedReportType(formData) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_create_report_type',
    {
      p_name: formData.label.trim(),
      p_color_hex: formData.color,
      p_description: formData.description.trim() || null,
      p_subtypes: formData.subtypes,
    }
  );

  if (error) throw new Error(error.message);
  invalidateCategoryCaches();
  return data;
}

export async function updateManagedReportType(categoryId, formData) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_update_report_type',
    {
      p_category_id: Number(categoryId),
      p_name: formData.label.trim(),
      p_color_hex: formData.color,
      p_description: formData.description.trim() || null,
      p_subtypes: formData.subtypes,
    }
  );

  if (error) throw new Error(error.message);
  invalidateCategoryCaches();
  return data;
}

export async function setManagedReportTypeActive(categoryId, active) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_set_report_type_state',
    {
      p_category_id: Number(categoryId),
      p_active: Boolean(active),
    }
  );

  if (error) throw new Error(error.message);
  invalidateCategoryCaches();
  return data;
}
