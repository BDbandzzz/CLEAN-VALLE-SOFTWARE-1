import { getReportTypeMeta, getRiskLevelMeta } from '../constants/reportConstants';

/**
 * Muestra una etiqueta/badge para el tipo de reporte o nivel de riesgo.
 */
export function ReportBadge({ type, value, size = 'sm' }) {
  const meta =
    type === 'reportType' ? getReportTypeMeta(value) : getRiskLevelMeta(value);

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{
        backgroundColor: meta.color + '22',
        color: meta.color,
        border: `1.5px solid ${meta.color}55`,
      }}
    >
      {meta.label}
    </span>
  );
}
