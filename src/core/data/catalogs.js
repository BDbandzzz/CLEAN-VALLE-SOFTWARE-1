export const DOCUMENT_TYPES = [];
export const GENDERS = [];
export const REPORT_CATEGORIES = [];
export const RISK_LEVELS = [];
export const REPORT_STATUSES = [];
export const RESOLUTION_STATUSES = [];
export const RESOLUTION_QUALITIES = [];
export const CAMPUS_LOCATIONS = [];

export const CATALOGS = {
  documentTypes: DOCUMENT_TYPES,
  genders: GENDERS,
  reportCategories: REPORT_CATEGORIES,
  riskLevels: RISK_LEVELS,
  reportStatuses: REPORT_STATUSES,
  campusLocations: CAMPUS_LOCATIONS,
};

export function getCatalogOptions(catalogKey) {
  return CATALOGS[catalogKey] ?? [];
}

export function findCatalogOption(catalogKey, id) {
  return getCatalogOptions(catalogKey).find((option) => String(option.id) === String(id)) ?? null;
}

export function getCatalogLabel(catalogKey, id, fallback = '') {
  return findCatalogOption(catalogKey, id)?.label ?? fallback;
}
