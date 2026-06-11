export function ReportBadge({ type, label, color, size = 'sm' }) {
  const meta = {
    label: label || (type === 'category' ? 'Sin categoria' : 'Sin riesgo'),
    color: color || '#6b7280',
  };
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{
        backgroundColor: `${meta.color}22`,
        color: meta.color,
        border: `1.5px solid ${meta.color}55`,
      }}
    >
      {meta.label}
    </span>
  );
}
