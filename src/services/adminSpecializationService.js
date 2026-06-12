import { supabase } from '@/services/supabaseClient';
import { invalidateUserManagementCatalogCache } from '@/services/adminUserService';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

export async function listManagedSpecializations() {
  const { data, error } = await supabase.rpc(
    'rpc_admin_list_specializations'
  );

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.specializations.list);
  }
  return data ?? [];
}

export async function listActiveCategoryOptions() {
  const { data, error } = await supabase.rpc(
    'rpc_admin_list_specialization_categories'
  );

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.specializations.categories
    );
  }
  return data ?? [];
}

export async function createManagedSpecialization(formData) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_create_specialization',
    {
      p_category_id: Number(formData.categoryId),
      p_name: formData.label.trim(),
    }
  );

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.specializations.create
    );
  }
  invalidateUserManagementCatalogCache();
  return data;
}

export async function updateManagedSpecialization(
  specializationId,
  formData
) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_update_specialization',
    {
      p_specialization_id: Number(specializationId),
      p_category_id: Number(formData.categoryId),
      p_name: formData.label.trim(),
    }
  );

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.specializations.update
    );
  }
  invalidateUserManagementCatalogCache();
  return data;
}

export async function deleteManagedSpecialization(specializationId) {
  const { error } = await supabase.rpc(
    'rpc_admin_delete_specialization',
    {
      p_specialization_id: Number(specializationId),
    }
  );

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.specializations.delete
    );
  }
  invalidateUserManagementCatalogCache();
}
