import { findCatalogOption, normalizeCatalogText } from '@/core/catalogs/catalogUtils';

const REPORT_TYPE_STYLES = [
  { aliases: ['basura', 'basuras', 'residuo', 'residuos'], color: '#16a34a', bgClass: 'report-type-basura' },
  { aliases: ['agua', 'hidrico'], color: '#2563eb', bgClass: 'report-type-agua' },
  { aliases: ['riesgo', 'seguridad', 'peligro'], color: '#dc2626', bgClass: 'report-type-riesgo' },
  { aliases: ['ruido', 'sonoro'], color: '#7c3aed', bgClass: 'report-type-ruido' },
  { aliases: ['contaminacion', 'ambiental'], color: '#0891b2', bgClass: 'report-type-contaminacion' },
  { aliases: ['otro', 'otros'], color: '#6b7280', bgClass: 'report-type-otro' },
];

const RISK_LEVEL_STYLES = [
  { aliases: ['bajo'], color: '#16a34a', bgClass: 'risk-bajo' },
  { aliases: ['medio', 'moderado'], color: '#d97706', bgClass: 'risk-medio' },
  { aliases: ['alto'], color: '#dc2626', bgClass: 'risk-alto' },
  { aliases: ['critico'], color: '#991b1b', bgClass: 'risk-critico' },
];

const STATUS_STYLES = [
  { key: 'submitted', aliases: ['enviado', 'pendiente', 'nuevo', 'registrado'], label: 'Enviado', color: '#d97706' },
  { key: 'inProgress', aliases: ['en proceso', 'en progreso', 'proceso', 'asignado'], label: 'En Proceso', color: '#2563eb' },
  { key: 'resolved', aliases: ['resuelto', 'resuelta'], label: 'Resuelto', color: '#16a34a' },
  { key: 'closed', aliases: ['cerrado', 'cerrada'], label: 'Cerrado', color: '#0f766e' },
  { key: 'discarded', aliases: ['descartado', 'descartada', 'rechazado', 'rechazada'], label: 'Descartado', color: '#dc2626' },
];

function findStyle(label, styles, fallbackColor) {
  const normalized = normalizeCatalogText(label);
  const match = styles.find((style) =>
    style.aliases.some((alias) => normalized.includes(normalizeCatalogText(alias)))
  );

  return match ?? { color: fallbackColor, bgClass: '' };
}

function decorateOptions(options, styles, fallbackColor) {
  return options.map((option) => {
    const style = findStyle(option.label, styles, fallbackColor);
    return {
      ...option,
      color: style.color,
      bgClass: style.bgClass,
    };
  });
}

function resolveStatusStyle(value) {
  const normalized = normalizeCatalogText(value);
  return (
    STATUS_STYLES.find((status) => status.key === value) ||
    STATUS_STYLES.find((status) => status.aliases.some((alias) => normalized.includes(normalizeCatalogText(alias)))) ||
    null
  );
}

export function getReportTypeOptions(catalogOptions = []) {
  return decorateOptions(catalogOptions, REPORT_TYPE_STYLES, '#6b7280');
}

export function getRiskLevelOptions(catalogOptions = []) {
  return decorateOptions(catalogOptions, RISK_LEVEL_STYLES, '#6b7280');
}

export function getStatusOptions(catalogOptions = []) {
  return catalogOptions.map((option) => {
    const style = resolveStatusStyle(option.label);
    return {
      ...option,
      key: style?.key ?? 'unknown',
      color: style?.color ?? '#6b7280',
    };
  });
}

export function getReportTypeMeta(value, catalogOptions = []) {
  const options = getReportTypeOptions(catalogOptions);
  const option = findCatalogOption(options, value);
  const label = option?.label ?? String(value || '');
  const style = findStyle(label, REPORT_TYPE_STYLES, '#6b7280');
  return { id: String(value || ''), label, ...option, color: style.color, bgClass: style.bgClass };
}

export function getRiskLevelMeta(value, catalogOptions = []) {
  const options = getRiskLevelOptions(catalogOptions);
  const option = findCatalogOption(options, value);
  const label = option?.label ?? String(value || '');
  const style = findStyle(label, RISK_LEVEL_STYLES, '#6b7280');
  return { id: String(value || ''), label, ...option, color: style.color, bgClass: style.bgClass };
}

export function getStatusMeta(value, catalogOptions = []) {
  const options = getStatusOptions(catalogOptions);
  const option = findCatalogOption(options, value);
  const style = resolveStatusStyle(option?.label ?? value);

  return {
    id: option?.id ?? String(value || ''),
    value: option?.value ?? null,
    label: option?.label ?? style?.label ?? String(value || ''),
    key: option?.key ?? style?.key ?? 'unknown',
    color: option?.color ?? style?.color ?? '#6b7280',
  };
}

export function getStatusKey(value, catalogOptions = []) {
  return getStatusMeta(value, catalogOptions).key;
}

export function findStatusOptionByKey(statusKey, catalogOptions = []) {
  return getStatusOptions(catalogOptions).find((option) => option.key === statusKey) ?? null;
}
