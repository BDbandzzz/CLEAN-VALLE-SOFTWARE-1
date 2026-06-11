import { supabase } from '@/services/supabaseClient';
import { ELEMENT_STATE_IDS } from '@/core/constants/domainConstants';

const REPORT_CATALOG_CACHE_KEY = 'cleanvalle_report_catalogs_v1';
const REPORT_CATALOG_CACHE_TTL = 60 * 60 * 1000;

let catalogBundleMemory = null;
let catalogBundlePromise = null;

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

function mapReportStatus(row) {
  return {
    id: String(row.status_id),
    label: row.status_name,
    description: row.description ?? '',
    color: row.color_hex ?? '#6b7280',
    isTerminal: Boolean(row.is_terminal),
  };
}

function mapResolutionQuality(row) {
  return {
    id: String(row.id_quality),
    label: row.name,
    description: row.description ?? '',
  };
}

function mapResolutionReviewStatus(row) {
  return {
    id: String(row.id_review_status),
    label: row.name,
    description: row.description ?? '',
    isTerminal: Boolean(row.is_terminal),
  };
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = [...(groups[groupKey] ?? []), item];
    return groups;
  }, {});
}

function readCachedCatalogBundle() {
  if (catalogBundleMemory) return catalogBundleMemory;

  try {
    const cached = JSON.parse(
      localStorage.getItem(REPORT_CATALOG_CACHE_KEY)
    );

    if (
      cached?.savedAt &&
      Date.now() - cached.savedAt < REPORT_CATALOG_CACHE_TTL &&
      cached.data
    ) {
      catalogBundleMemory = cached.data;
      return cached.data;
    }
  } catch {
    try {
      localStorage.removeItem(REPORT_CATALOG_CACHE_KEY);
    } catch {
      // El almacenamiento puede estar bloqueado; se usara solo memoria.
    }
  }

  return null;
}

function cacheCatalogBundle(data) {
  catalogBundleMemory = data;

  try {
    localStorage.setItem(
      REPORT_CATALOG_CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data })
    );
  } catch {
    // El cache en memoria sigue evitando solicitudes repetidas en esta sesion.
  }

  return data;
}

async function runCatalogQuery(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchReportCatalogBundle() {
  const [
    categoryRows,
    subtypeRows,
    riskRows,
    localizationRows,
    subareaRows,
    statusRows,
    qualityRows,
    reviewStatusRows,
  ] = await Promise.all([
    runCatalogQuery(
      supabase
        .from('type_category')
        .select('id_category,id_state,name,color_hex,description')
        .eq('id_state', ELEMENT_STATE_IDS.ACTIVE)
        .order('name', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('subtype_category')
        .select('id_subtype,id_category,name,description')
        .order('name', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('risk_level')
        .select('risk_id,risk_level,description,color_hex')
        .order('risk_id', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('localization')
        .select('id_localization,id_state,name,description')
        .eq('id_state', ELEMENT_STATE_IDS.ACTIVE)
        .order('name', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('subarea_localization')
        .select('id_subarea,id_localization,name,description')
        .order('name', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('status_report')
        .select('status_id,status_name,description,is_terminal,color_hex')
        .order('status_id', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('resolution_quality')
        .select('id_quality,name,description')
        .order('id_quality', { ascending: true })
    ),
    runCatalogQuery(
      supabase
        .from('resolution_review_status')
        .select('id_review_status,name,description,is_terminal')
        .order('id_review_status', { ascending: true })
    ),
  ]);

  const categories = categoryRows.map(mapCategory);
  const categoryById = new Map(
    categories.map((category) => [category.id, category])
  );
  const activeCategoryIds = new Set(categories.map((category) => category.id));
  const localizations = localizationRows.map(mapLocalization);
  const activeLocalizationIds = new Set(
    localizations.map((localization) => localization.id)
  );

  const subtypes = subtypeRows
    .map(mapSubtype)
    .filter((subtype) => activeCategoryIds.has(subtype.categoryId))
    .map((subtype) => ({
      ...subtype,
      color: categoryById.get(subtype.categoryId)?.color ?? '#6b7280',
    }));
  const subareas = subareaRows
    .map(mapSubarea)
    .filter((subarea) =>
      activeLocalizationIds.has(subarea.localizationId)
    );

  return {
    categories,
    riskLevels: riskRows.map(mapRiskLevel),
    localizations,
    reportStatuses: statusRows.map(mapReportStatus),
    resolutionQualities: qualityRows.map(mapResolutionQuality),
    resolutionReviewStatuses: reviewStatusRows.map(
      mapResolutionReviewStatus
    ),
    subtypesByCategory: groupBy(subtypes, 'categoryId'),
    subareasByLocalization: groupBy(subareas, 'localizationId'),
  };
}

export async function getReportCatalogBundle({ force = false } = {}) {
  if (!force) {
    const cached = readCachedCatalogBundle();
    if (cached) return cached;
    if (catalogBundlePromise) return catalogBundlePromise;
  }

  catalogBundlePromise = fetchReportCatalogBundle()
    .then(cacheCatalogBundle)
    .finally(() => {
      catalogBundlePromise = null;
    });

  return catalogBundlePromise;
}

export function invalidateReportCatalogCache() {
  catalogBundleMemory = null;
  catalogBundlePromise = null;

  try {
    localStorage.removeItem(REPORT_CATALOG_CACHE_KEY);
  } catch {
    // No hay nada mas que invalidar si el almacenamiento no esta disponible.
  }
}
