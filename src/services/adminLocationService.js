import { supabase } from '@/services/supabaseClient';

export async function listManagedLocations() {
  const { data, error } = await supabase.rpc('rpc_admin_list_locations');

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createManagedLocation(formData) {
  const { data, error } = await supabase.rpc('rpc_admin_create_location', {
    p_name: formData.label.trim(),
    p_description: formData.description.trim() || null,
    p_subareas: formData.subareas,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateManagedLocation(locationId, formData) {
  const { data, error } = await supabase.rpc('rpc_admin_update_location', {
    p_location_id: Number(locationId),
    p_name: formData.label.trim(),
    p_description: formData.description.trim() || null,
    p_subareas: formData.subareas,
  });

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
  return data;
}
