import { supabase } from '@/services/supabaseClient';
import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';
import { isActiveState } from '@/core/mappers/domainMappers';

function isActive(row) {
  return isActiveState(row.id_state);
}

function mapCategory(row) {
  return {
    id: String(row.id_category),
    label: row.name,
    description: row.description ?? '',
    color: row.color_hex ?? '#6b7280',
  };
}

function mapSubtype(row) {
  return {
    id: String(row.id_subtype),
    categoryId: String(row.id_category),
    label: row.name,
    description: row.description ?? '',
  };
}

function mapRiskLevel(row) {
  return {
    id: String(row.risk_id),
    label: row.risk_level,
    description: row.description ?? '',
    color: row.color_hex ?? '#6b7280',
  };
}

function mapLocalization(row) {
  return {
    id: String(row.id_localization),
    label: row.name,
    description: row.description ?? '',
  };
}

function mapSubarea(row) {
  return {
    id: String(row.id_subarea),
    localizationId: String(row.id_localization),
    label: row.name,
    description: row.description ?? '',
  };
}

export async function getActiveReportCategories() {
  const { data, error } = await supabase
    .from('type_category')
    .select(`
      id_category,
      id_state,
      name,
      color_hex,
      description
    `)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).filter(isActive).map(mapCategory);
}

export async function getSubtypesByCategoryId(categoryId) {
  if (!categoryId) return [];

  const { data, error } = await supabase
    .from('subtype_category')
    .select('id_subtype,id_category,name,description')
    .eq('id_category', categoryId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapSubtype);
}

export async function getRiskLevels() {
  const { data, error } = await supabase
    .from('risk_level')
    .select('risk_id,risk_level,description,color_hex')
    .order('risk_id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRiskLevel);
}

export async function getLocalizations() {
  const { data, error } = await supabase
    .from('localization')
    .select('id_localization,id_state,name,description')
    .eq('id_state', ELEMENT_STATE_IDS.ACTIVE)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapLocalization);
}

export async function getSubareasByLocalizationId(localizationId) {
  if (!localizationId) return [];

  const { data, error } = await supabase
    .from('subarea_localization')
    .select('id_subarea,id_localization,name,description')
    .eq('id_localization', localizationId)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapSubarea);
}
