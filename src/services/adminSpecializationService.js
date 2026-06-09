import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { requireAdminSession } from '@/services/adminAccessService';
import { supabase } from '@/services/supabaseClient';

function mapSpecialization(row) {
  return {
    id: row.id_type_specialization,
    categoryId: row.id_category,
    label: row.name_specialization ?? '',
    categoryName: row.type_category?.name ?? '',
    categoryColor: row.type_category?.color_hex ?? '#6b7280',
  };
}

export async function listManagedSpecializations() {
  await requireAdminSession();

  const { data, error } = await supabase
    .from('type_specialization')
    .select(`
      id_type_specialization,
      id_category,
      name_specialization,
      type_category(id_category,name,color_hex,id_state)
    `)
    .order('name_specialization', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSpecialization);
}

export async function listActiveCategoryOptions() {
  await requireAdminSession();

  const { data, error } = await supabase
    .from('type_category')
    .select('id_category,name,color_hex')
    .eq('id_state', ELEMENT_STATE_IDS.ACTIVE)
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((category) => ({
    id: category.id_category,
    label: category.name,
    color: category.color_hex ?? '#6b7280',
  }));
}

export async function createManagedSpecialization(formData) {
  await requireAdminSession();

  const { data, error } = await supabase
    .from('type_specialization')
    .insert({
      id_category: Number(formData.categoryId),
      name_specialization: formData.label.trim(),
    })
    .select(`
      id_type_specialization,
      id_category,
      name_specialization,
      type_category(id_category,name,color_hex,id_state)
    `)
    .single();

  if (error) throw new Error(error.message);
  return mapSpecialization(data);
}

export async function updateManagedSpecialization(specializationId, formData) {
  await requireAdminSession();

  const { data, error } = await supabase
    .from('type_specialization')
    .update({
      id_category: Number(formData.categoryId),
      name_specialization: formData.label.trim(),
    })
    .eq('id_type_specialization', specializationId)
    .select(`
      id_type_specialization,
      id_category,
      name_specialization,
      type_category(id_category,name,color_hex,id_state)
    `)
    .single();

  if (error) throw new Error(error.message);
  return mapSpecialization(data);
}

export async function deleteManagedSpecialization(specializationId) {
  await requireAdminSession();

  const { count, error: relationError } = await supabase
    .from('operator_specialization')
    .select('*', { count: 'exact', head: true })
    .eq('id_type_specialization', specializationId);

  if (relationError) throw new Error(relationError.message);
  if (count) {
    throw new Error(
      'No puedes eliminar esta especialización mientras esté asignada a operadores.'
    );
  }

  const { error } = await supabase
    .from('type_specialization')
    .delete()
    .eq('id_type_specialization', specializationId);

  if (error) throw new Error(error.message);
}
