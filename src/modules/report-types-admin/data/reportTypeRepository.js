export function mapReportTypeToForm(type) {
  return {
    label: type?.label ?? '',
    description: type?.description ?? '',
    color: type?.color ?? '#0f766e',
    subtypes: (type?.subtypes ?? []).map((subtype) => ({
      id: subtype.id,
      label: subtype.label,
      description: subtype.description ?? '',
    })),
  };
}
