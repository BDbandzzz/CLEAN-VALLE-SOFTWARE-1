import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ReportBadge } from './ReportBadge';

const STATUS_META = {
  pendiente:    { label: 'Pendiente',    icon: Clock,         color: '#d97706' },
  en_progreso:  { label: 'En progreso',  icon: Loader2,       color: '#2563eb' },
  resuelto:     { label: 'Resuelto',     icon: CheckCircle2,  color: '#16a34a' },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pendiente;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: meta.color + '18', color: meta.color, border: `1.5px solid ${meta.color}44` }}
    >
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

/**
 * Tarjeta desplegable para un reporte individual.
 */
export function ReportCard({ report }) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = report.incidentDate
    ? new Date(report.incidentDate + 'T00:00:00').toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const formattedCreatedAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Header siempre visible */}
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReportBadge type="reportType" value={report.reportType} />
            <ReportBadge type="riskLevel" value={report.riskLevel} />
            <StatusPill status={report.status} />
          </div>
          <h3 className="text-base font-semibold text-foreground line-clamp-1">{report.title}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {report.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formattedDate}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="
            mt-1 flex shrink-0 items-center gap-1 self-start rounded-lg border border-border
            bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground
            transition hover:bg-muted hover:text-foreground
          "
          aria-expanded={expanded}
          aria-label={expanded ? 'Ocultar detalles' : 'Ver detalles'}
        >
          {expanded ? (
            <>
              Ocultar <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Ver más <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Detalle desplegable */}
      {expanded && (
        <div className="border-t border-border bg-muted/30 px-5 pb-5 pt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descripción</p>
            <p className="text-sm text-foreground">{report.description || 'Sin descripción.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoItem label="Localización" value={report.location} />
            <InfoItem label="Fecha del incidente" value={formattedDate} />
            <InfoItem label="Reportado el" value={formattedCreatedAt} />
          </div>

          {/* Resolución (si está resuelto) */}
          {report.status === 'resuelto' && report.resolution && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-1.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
                <CheckCircle2 className="size-3.5" />
                Resolución del operador
              </p>
              <p className="text-sm text-green-800">{report.resolution}</p>
              {report.operatorName && (
                <p className="text-xs text-green-600">Operador: {report.operatorName}</p>
              )}
              {report.resolvedAt && (
                <p className="text-xs text-green-600">
                  Resuelto el:{' '}
                  {new Date(report.resolvedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          )}

          {/* Placeholder de imágenes */}
          {report.images && report.images.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Imágenes</p>
              <div className="flex flex-wrap gap-2">
                {report.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Imagen ${idx + 1}`}
                    className="h-20 w-20 rounded-lg object-cover border border-border"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="size-3.5" />
              Sin imágenes adjuntas
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}
