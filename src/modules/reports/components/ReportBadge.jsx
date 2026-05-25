/**
 * ReportBadge.jsx – Etiqueta de color para tipo de reporte o nivel de riesgo.
 *
 * Props:
 *   type  {'reportType'|'riskLevel'}  Determina qué catálogo consultar.
 *   value {string}                    ID del ítem (ej: 'basura', 'alto').
 *   size  {'sm'|'md'}                 Tamaño del badge (default: 'sm').
 *
 * Los colores y labels vienen de reportConstants.js.
 * Para agregar un nuevo tipo o nivel, solo editar ese archivo.
 */
import { getReportTypeMeta, getRiskLevelMeta } from '../constants/reportConstants';
import { useCatalogs } from '@/core/context/CatalogContext';

export function ReportBadge({ type, value, size = 'sm' }) {
  const { getOptions } = useCatalogs();
  const meta = type === 'reportType'
    ? getReportTypeMeta(value, getOptions('typeReport'))
    : getRiskLevelMeta(value, getOptions('riskLevel'));

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{
        backgroundColor: meta.color + '22',
        color:           meta.color,
        border:          `1.5px solid ${meta.color}55`,
      }}
    >
      {meta.label}
    </span>
  );
}
