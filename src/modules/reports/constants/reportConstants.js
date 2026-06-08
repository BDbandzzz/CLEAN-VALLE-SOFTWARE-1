import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  RESOLUTION_QUALITIES,
  RESOLUTION_STATUSES,
  RISK_LEVELS,
} from '@/core/data/catalogs';

const DEFAULT_STATUS_META = { id: 'sin-estado', label: 'Sin estado', color: '#6b7280' };
const DEFAULT_RISK_META = { id: 'sin-riesgo', label: 'Sin riesgo', color: '#6b7280' };
const DEFAULT_RESOLUTION_STATUS_META = { id: 'sin-revision', label: 'Sin revision', color: '#6b7280' };

export const REPORT_TEXTAREA_FIELDS = {
  description: {
    id: 'report-description',
    label: 'Descripcion del reporte',
    placeholder: 'Describe que ocurre, desde cuando y a quien afecta...',
    rows: 4,
    maxLength: 800,
  },
  customContext: {
    id: 'report-custom-context',
    label: 'Especifica aqui el problema',
    placeholder: 'Explica que tipo de incidente es y por que no encaja en las opciones anteriores.',
    rows: 3,
    maxLength: 500,
  },
};

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
  return REPORT_STATUSES.find((status) => status.id === statusId) ?? DEFAULT_STATUS_META;
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
  return RISK_LEVELS.find((risk) => risk.id === riskLevelId) ?? DEFAULT_RISK_META;
}

export function getResolutionReviewStatusMeta(statusId) {
  return RESOLUTION_STATUSES.find((status) => status.id === statusId) ?? DEFAULT_RESOLUTION_STATUS_META;
}

export function getResolutionReviewStatusOptions() {
  return RESOLUTION_STATUSES;
}

export function getResolutionQualityMeta(qualityId) {
  return RESOLUTION_QUALITIES.find((quality) => quality.id === qualityId) ?? null;
}
