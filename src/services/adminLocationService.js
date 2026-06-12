import { supabase } from '@/services/supabaseClient';
import { invalidateReportCatalogCache } from '@/services/reportCatalogService';
import {
  CONTROLLED_ERROR_MESSAGES,
  SERVICE_ERROR_MESSAGES,
} from '@/core/constants/errorMessages';
import { createServiceError } from '@/core/services/errorMessageService';

export async function listManagedLocations() {
  const { data, error } = await supabase.rpc('rpc_admin_list_locations');

  if (error) {
    throw createServiceError(error, SERVICE_ERROR_MESSAGES.locations.list);
  }
  return data ?? [];
}

export async function createManagedLocation(formData) {
  const { data, error } = await supabase.rpc('rpc_admin_create_location', {
    p_name: formData.label.trim(),
    p_description: formData.description.trim() || null,
    p_subareas: formData.subareas,
  });

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.locations.create,
      CONTROLLED_ERROR_MESSAGES
    );
  }
  invalidateReportCatalogCache();
  return data;
}

export async function updateManagedLocation(locationId, formData) {
  const { data, error } = await supabase.rpc('rpc_admin_update_location', {
    p_location_id: Number(locationId),
    p_name: formData.label.trim(),
    p_description: formData.description.trim() || null,
    p_subareas: formData.subareas,
  });

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.locations.update,
      CONTROLLED_ERROR_MESSAGES
    );
  }
  invalidateReportCatalogCache();
  return data;
}

export async function setManagedLocationActive(locationId, active) {
  const { data, error } = await supabase.rpc(
    'rpc_admin_set_location_state',
    {
      p_location_id: Number(locationId),
      p_active: Boolean(active),
    }
  );

  if (error) {
    throw createServiceError(
      error,
      SERVICE_ERROR_MESSAGES.locations.delete,
      CONTROLLED_ERROR_MESSAGES
    );
  }
  invalidateReportCatalogCache();
  return data;
}
