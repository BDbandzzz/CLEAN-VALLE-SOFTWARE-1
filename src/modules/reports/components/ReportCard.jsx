import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
} from 'lucide-react';

import { ReportBadge } from './ReportBadge';
import { getStatusMeta, getSubtypeLabel } from '../constants/reportConstants';

const STATUS_ICONS = {
  pendiente: Clock,
  'en-revision': Clock,
  asignado: Clock,
  'en-proceso': Clock,
  resuelto: CheckCircle2,
  cerrado: CheckCircle2,
  rechazado: AlertCircle,
};

function StatusPill({ meta }) {
  const Icon = STATUS_ICONS[meta.id] ?? Clock;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${meta.color}18`, color: meta.color, border: `1.5px solid ${meta.color}44` }}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

export function ReportCard({ report, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const statusMeta = getStatusMeta(report.statusId);
  const subtypeLabel = getSubtypeLabel(report.categoryId, report.subtypeId);

  const formattedDate = report.incidentDate
    ? new Date(report.incidentDate).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  const formattedCreatedAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReportBadge type="category" value={report.categoryId} />
            <ReportBadge type="risk" value={report.riskLevelId} />
            <StatusPill meta={statusMeta} />
          </div>
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">{report.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{report.locationName}</span>
            <span className="flex items-center gap-1"><Calendar className="size-3" />{formattedDate}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="
            mt-1 flex shrink-0 items-center gap-1 self-start rounded-lg border border-border
            bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground
            transition hover:bg-muted hover:text-foreground
          "
          aria-expanded={expanded}
          aria-label={expanded ? 'Ocultar detalles' : 'Ver detalles'}
        >
          {expanded ? (
            <><span>Ocultar</span><ChevronUp className="size-3.5" /></>
          ) : (
            <><span>Ver mas</span><ChevronDown className="size-3.5" /></>
          )}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-border bg-muted/30 px-5 pb-5 pt-4">
          <InfoBlock label="Descripcion" value={report.description || 'Sin descripcion.'} />

          {report.customContext && (
            <InfoBlock label="Contexto adicional" value={report.customContext} />
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="Subtipo" value={subtypeLabel} />
            <InfoItem label="Ubicacion" value={report.locationName} />
            <InfoItem label="Fecha del incidente" value={formattedDate} />
            <InfoItem label="Reportado el" value={formattedCreatedAt} />
            <InfoItem label="Coordenadas" value={formatCoordinates(report.coordinates)} />
          </div>

          {report.evidences?.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidencias</p>
              <div className="flex flex-wrap gap-2">
                {report.evidences.map((src, index) => (
                  <img
                    key={`${report.id}-${index}`}
                    src={src}
                    alt={`Evidencia ${index + 1}`}
                    className="h-20 w-20 rounded-lg border border-border object-cover"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="size-3.5" />
              Sin evidencias adjuntas
            </p>
          )}

          {report.statusId === 'pendiente' && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(report.id)}
              className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
            >
              Eliminar reporte
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || '-'}</p>
    </div>
  );
}

function formatCoordinates(coordinates) {
  if (!coordinates) return '';
  return `${coordinates.lat}, ${coordinates.lng}`;
}
