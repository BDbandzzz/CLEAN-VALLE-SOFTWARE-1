import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { requireAdminSession } from '@/services/adminAccessService';
import { supabase } from '@/services/supabaseClient';

function mapLocation(row, subareas = []) {
  return {
    id: row.id_localization,
    label: row.name ?? '',
    description: row.description ?? '',
    stateId: row.id_state,
    active: row.id_state === ELEMENT_STATE_IDS.ACTIVE,
    subareas: subareas.map((subarea) => ({
      id: subarea.id_subarea,
      localizationId: subarea.id_localization,
      label: subarea.name ?? '',
      description: subarea.description ?? '',
    })),
  };
}

export async function listManagedLocations() {
  await requireAdminSession();

  const [locationsResult, subareasResult] = await Promise.all([
    supabase
      .from('localization')
      .select('id_localization,id_state,name,description')
      .order('name', { ascending: true }),
    supabase
      .from('subarea_localization')
      .select('id_subarea,id_localization,name,description')
      .order('name', { ascending: true }),
  ]);

  const error = locationsResult.error ?? subareasResult.error;
  if (error) throw new Error(error.message);

  const subareasByLocation = (subareasResult.data ?? []).reduce((groups, subarea) => {
    const key = String(subarea.id_localization);
    groups.set(key, [...(groups.get(key) ?? []), subarea]);
    return groups;
  }, new Map());

  return (locationsResult.data ?? []).map((location) =>
    mapLocation(
      location,
      subareasByLocation.get(String(location.id_localization)) ?? []
    )
  );
}

export async function createManagedLocation(formData) {
  await requireAdminSession();

  const { data: location, error } = await supabase
    .from('localization')
    .insert({
      id_state: ELEMENT_STATE_IDS.ACTIVE,
      name: formData.label.trim(),
      description: formData.description.trim() || null,
    })
    .select('id_localization,id_state,name,description')
    .single();

  if (error) throw new Error(error.message);

  if (formData.subareas.length) {
    const { error: subareaError } = await supabase
      .from('subarea_localization')
      .insert(
        formData.subareas.map((subarea) => ({
          id_localization: location.id_localization,
          name: subarea.label.trim(),
          description: subarea.description.trim() || null,
        }))
      );

    if (subareaError) {
      await supabase
        .from('localization')
        .delete()
        .eq('id_localization', location.id_localization);
      throw new Error(subareaError.message);
    }
  }

  return location;
}

export async function updateManagedLocation(locationId, formData) {
  await requireAdminSession();

  const { data: currentSubareas, error: currentError } = await supabase
    .from('subarea_localization')
    .select('id_subarea')
    .eq('id_localization', locationId);

  if (currentError) throw new Error(currentError.message);

  const persisted = formData.subareas.filter((subarea) =>
    Number.isInteger(Number(subarea.id))
  );
  const retainedIds = new Set(persisted.map((subarea) => Number(subarea.id)));
  const removedIds = (currentSubareas ?? [])
    .map((subarea) => subarea.id_subarea)
    .filter((id) => !retainedIds.has(id));

  if (removedIds.length) {
    const { error } = await supabase
      .from('subarea_localization')
      .delete()
      .in('id_subarea', removedIds);

    if (error) {
      throw new Error(
        `No se pudieron eliminar algunas subáreas porque están en uso. ${error.message}`
      );
    }
  }

  const updateResults = await Promise.all(
    persisted.map((subarea) =>
      supabase
        .from('subarea_localization')
        .update({
          name: subarea.label.trim(),
          description: subarea.description.trim() || null,
        })
        .eq('id_subarea', Number(subarea.id))
    )
  );
  const updateError = updateResults.find((result) => result.error)?.error;
  if (updateError) throw new Error(updateError.message);

  const newSubareas = formData.subareas.filter(
    (subarea) => !Number.isInteger(Number(subarea.id))
  );
  if (newSubareas.length) {
    const { error } = await supabase.from('subarea_localization').insert(
      newSubareas.map((subarea) => ({
        id_localization: locationId,
        name: subarea.label.trim(),
        description: subarea.description.trim() || null,
      }))
    );
    if (error) throw new Error(error.message);
  }

  const { error } = await supabase
    .from('localization')
    .update({
      name: formData.label.trim(),
      description: formData.description.trim() || null,
    })
    .eq('id_localization', locationId);

  if (error) throw new Error(error.message);
}

export async function setManagedLocationActive(locationId, active) {
  await requireAdminSession();

  const { error } = await supabase
    .from('localization')
    .update({
      id_state: active
        ? ELEMENT_STATE_IDS.ACTIVE
        : ELEMENT_STATE_IDS.INACTIVE,
    })
    .eq('id_localization', locationId);

  if (error) throw new Error(error.message);
}
