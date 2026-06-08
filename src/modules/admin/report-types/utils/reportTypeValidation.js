function isValidHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function validateReportTypeForm(formData, reportTypes, options = {}) {
  const { currentTypeId = null } = options;
  const errors = {};
  const subtypeErrors = {};
  const normalizedLabel = formData.label.trim().toLowerCase();

  if (!formData.label.trim()) {
    errors.label = 'El título del tipo es obligatorio.';
  }

  if (!formData.description.trim()) {
    errors.description = 'La descripción es obligatoria.';
  }

  if (!isValidHexColor(formData.color)) {
    errors.color = 'Ingresa un color hexadecimal válido. Ejemplo: #0f766e.';
  }

  if (
    normalizedLabel &&
    reportTypes.some((type) => type.id !== currentTypeId && type.label.trim().toLowerCase() === normalizedLabel)
  ) {
    errors.label = 'Ya existe un tipo de reporte con este título.';
  }

  formData.subtypes.forEach((subtype) => {
    if (!subtype.label.trim()) {
      subtypeErrors[subtype.id] = 'El título de la razón es obligatorio.';
    }
  });

  const subtypeNames = formData.subtypes
    .map((subtype) => subtype.label.trim().toLowerCase())
    .filter(Boolean);
  const duplicatedSubtype = subtypeNames.find(
    (name, index) => subtypeNames.indexOf(name) !== index
  );

  if (duplicatedSubtype) {
    errors.subtypes = 'No repitas razones dentro del mismo tipo.';
  }

  return {
    ...errors,
    subtypeErrors,
  };
}
