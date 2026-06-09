import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { requireAdminSession } from '@/services/adminAccessService';
import { supabase } from '@/services/supabaseClient';

function mapSubtype(row) {
  return {
    id: row.id_subtype,
    categoryId: row.id_category,
    label: row.name ?? '',
    description: row.description ?? '',
  };
}

function mapReportType(row, subtypes = []) {
  return {
    id: row.id_category,
    label: row.name ?? '',
    description: row.description ?? '',
    color: row.color_hex ?? '#6b7280',
    stateId: row.id_state,
    stateName: row.state_element?.type_state ?? '',
    active: row.id_state === ELEMENT_STATE_IDS.ACTIVE,
    subtypes: subtypes.map(mapSubtype),
  };
}

export async function listManagedReportTypes() {
  await requireAdminSession();

  const [categoriesResult, subtypesResult] = await Promise.all([
    supabase
      .from('type_category')
      .select(`
        id_category,
        id_state,
        name,
        color_hex,
        description,
        state_element(id_state,type_state)
      `)
      .order('name', { ascending: true }),
    supabase
      .from('subtype_category')
      .select('id_subtype,id_category,name,description')
      .order('name', { ascending: true }),
  ]);

  const error = categoriesResult.error ?? subtypesResult.error;
  if (error) {
    throw new Error(error.message);
  }

  const subtypesByCategory = (subtypesResult.data ?? []).reduce((groups, subtype) => {
    const key = String(subtype.id_category);
    groups.set(key, [...(groups.get(key) ?? []), subtype]);
    return groups;
  }, new Map());

  return (categoriesResult.data ?? []).map((category) =>
    mapReportType(category, subtypesByCategory.get(String(category.id_category)) ?? [])
  );
}

async function insertSubtypes(categoryId, subtypes) {
  if (!subtypes.length) return [];

  const { data, error } = await supabase
    .from('subtype_category')
    .insert(
      subtypes.map((subtype) => ({
        id_category: categoryId,
        name: subtype.label.trim(),
        description: subtype.description.trim() || null,
      }))
    )
    .select('id_subtype,id_category,name,description');

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createManagedReportType(formData) {
  await requireAdminSession();

  const { data: category, error: categoryError } = await supabase
    .from('type_category')
    .insert({
      id_state: ELEMENT_STATE_IDS.ACTIVE,
      name: formData.label.trim(),
      color_hex: formData.color,
      description: formData.description.trim() || null,
    })
    .select('id_category,id_state,name,color_hex,description')
    .single();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  try {
    const subtypes = await insertSubtypes(category.id_category, formData.subtypes);
    return mapReportType(category, subtypes);
  } catch (error) {
    await supabase.from('type_category').delete().eq('id_category', category.id_category);
    throw error;
  }
}

export async function updateManagedReportType(categoryId, formData) {
  await requireAdminSession();

  const { data: currentSubtypes, error: currentError } = await supabase
    .from('subtype_category')
    .select('id_subtype')
    .eq('id_category', categoryId);

  if (currentError) {
    throw new Error(currentError.message);
  }

  const persistedSubtypes = formData.subtypes.filter((subtype) =>
    Number.isInteger(Number(subtype.id))
  );
  const retainedIds = new Set(persistedSubtypes.map((subtype) => Number(subtype.id)));
  const removedIds = (currentSubtypes ?? [])
    .map((subtype) => subtype.id_subtype)
    .filter((id) => !retainedIds.has(id));

  if (removedIds.length) {
    const { error } = await supabase
      .from('subtype_category')
      .delete()
      .in('id_subtype', removedIds);

    if (error) {
      throw new Error(
        `No se pudieron eliminar algunas razones porque están relacionadas con reportes. ${error.message}`
      );
    }
  }

  const subtypeUpdates = persistedSubtypes.map((subtype) =>
    supabase
      .from('subtype_category')
      .update({
        name: subtype.label.trim(),
        description: subtype.description.trim() || null,
      })
      .eq('id_subtype', Number(subtype.id))
  );

  const updateResults = await Promise.all(subtypeUpdates);
  const subtypeUpdateError = updateResults.find((result) => result.error)?.error;
  if (subtypeUpdateError) {
    throw new Error(subtypeUpdateError.message);
  }

  const newSubtypes = formData.subtypes.filter(
    (subtype) => !Number.isInteger(Number(subtype.id))
  );
  await insertSubtypes(categoryId, newSubtypes);

  const { error: categoryError } = await supabase
    .from('type_category')
    .update({
      name: formData.label.trim(),
      color_hex: formData.color,
      description: formData.description.trim() || null,
    })
    .eq('id_category', categoryId);

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  const reportTypes = await listManagedReportTypes();
  return reportTypes.find((type) => type.id === categoryId) ?? null;
}

export async function setManagedReportTypeActive(categoryId, active) {
  await requireAdminSession();

  const { error } = await supabase
    .from('type_category')
    .update({
      id_state: active
        ? ELEMENT_STATE_IDS.ACTIVE
        : ELEMENT_STATE_IDS.INACTIVE,
    })
    .eq('id_category', categoryId);

  if (error) {
    throw new Error(error.message);
  }
}
