const REPORT_TYPES_STORAGE_KEY = 'cleanvalle_admin_report_types_backend_ready_v1';

function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function readManagedReportTypes() {
  try {
    return JSON.parse(localStorage.getItem(REPORT_TYPES_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function persistManagedReportTypes(types) {
  localStorage.setItem(REPORT_TYPES_STORAGE_KEY, JSON.stringify(types));
}

export function buildReportType(formData) {
  const now = new Date().toISOString();
  const idBase = slugify(formData.label) || `tipo-${Date.now()}`;

  return {
    id: `${idBase}-${Date.now()}`,
    label: formData.label.trim(),
    description: formData.description.trim(),
    color: formData.color,
    active: true,
    source: 'admin',
    createdAt: now,
    updatedAt: now,
    subtypes: formData.subtypes.map((subtype) => ({
      id: subtype.id || `${slugify(subtype.label)}-${Date.now()}`,
      label: subtype.label.trim(),
      description: subtype.description.trim(),
      active: subtype.active !== false,
    })),
  };
}

export function mapReportTypeToForm(type) {
  return {
    label: type?.label ?? '',
    description: type?.description ?? '',
    color: type?.color ?? '#0f766e',
    subtypes: (type?.subtypes ?? []).map((subtype) => ({
      id: subtype.id,
      label: subtype.label,
      description: subtype.description ?? '',
      active: subtype.active !== false,
    })),
  };
}

export function buildUpdatedReportType(type, formData) {
  return {
    ...type,
    label: formData.label.trim(),
    description: formData.description.trim(),
    color: formData.color,
    updatedAt: new Date().toISOString(),
    subtypes: formData.subtypes.map((subtype) => ({
      id: subtype.id || `${slugify(subtype.label)}-${Date.now()}`,
      label: subtype.label.trim(),
      description: subtype.description.trim(),
      active: subtype.active !== false,
    })),
  };
}
