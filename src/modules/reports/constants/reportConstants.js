import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  RESOLUTION_QUALITIES,
  RESOLUTION_STATUSES,
  RISK_LEVELS,
} from '@/core/data/cleanvalleSchema';

export function getReportCategoryOptions() {
  return REPORT_CATEGORIES.map(({ id, label, description, color }) => ({
    id,
    label,
    description,
    color,
  }));
}

export function getSubTypeOptions(categoryId) {
  const category = REPORT_CATEGORIES.find((item) => item.id === categoryId);
  return (category?.subtypes ?? []).map((subtype) => ({
    ...subtype,
    color: category?.color ?? '#6b7280',
  }));
}

export function getRiskLevelOptions() {
  return RISK_LEVELS;
}

export function getStatusMeta(statusId) {
  return REPORT_STATUSES.find((status) => status.id === statusId) ?? REPORT_STATUSES[0];
}

export function getCategoryMeta(categoryId) {
  const category = REPORT_CATEGORIES.find((item) => item.id === categoryId);
  return category
    ? { id: category.id, label: category.label, color: category.color }
    : { id: categoryId, label: 'Sin categoria', color: '#6b7280' };
}

export function getSubtypeLabel(categoryId, subtypeId) {
  const category = REPORT_CATEGORIES.find((item) => item.id === categoryId);
  return category?.subtypes.find((subtype) => subtype.id === subtypeId)?.label ?? 'Sin subtipo';
}

export function getRiskMeta(riskLevelId) {
  return RISK_LEVELS.find((risk) => risk.id === riskLevelId) ?? RISK_LEVELS[0];
}

export function getResolutionReviewStatusMeta(statusId) {
  return RESOLUTION_STATUSES.find((status) => status.id === statusId) ?? RESOLUTION_STATUSES[0];
}

export function getResolutionReviewStatusOptions() {
  return RESOLUTION_STATUSES;
}

export function getResolutionQualityMeta(qualityId) {
  return RESOLUTION_QUALITIES.find((quality) => quality.id === qualityId) ?? null;
}
