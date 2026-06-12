import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Layers3,
  MessageSquare,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/core/components/ui/button';
import { PhotoGallery } from '@/core/components/ui/photo-gallery';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ResolutionMetaPill } from '@/modules/reports/components/ResolutionMetaPill';

export function OperatorResolutionCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const isGroup = item.sourceType === 'group';
  const resolution = item.resolution;
  const status = {
    label: resolution?.reviewStatusName || 'Pendiente de revisión',
    color: getReviewColor(resolution?.reviewStatusId),
  };

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <ReportBadge
              type="category"
              label={item.categoryName}
              color={item.categoryColor}
            />
            <ResolutionMetaPill label={status.label} color={status.color} />
            {isGroup && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Layers3 className="size-3.5" />
                Grupo de {item.reports?.length ?? 0} reportes
              </span>
            )}
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {isGroup ? `Grupo #${item.id}` : `Reporte #${item.id}`}
          </p>
          <h2 className="mt-1 break-words text-base font-semibold text-foreground">
            {item.title}
          </h2>
        </div>

        <div className="mt-4 min-w-0 rounded-lg bg-muted/35 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Método de resolución
          </p>
          <p
            className="mt-1 line-clamp-2 break-words text-sm leading-5 text-foreground [overflow-wrap:anywhere]"
            title={resolution?.resolutionMethod}
          >
            {resolution?.resolutionMethod || 'No especificado'}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            {formatDate(resolution?.resolvedAt)}
          </div>
          <Button
            type="button"
            variant={expanded ? 'default' : 'ghost'}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
            {expanded ? 'Cerrar detalles' : 'Ver detalles'}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="min-w-0 space-y-4 border-t border-border bg-muted/20 px-5 py-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Descripción
            </h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">
              {resolution?.description || 'Sin descripción.'}
            </p>
          </div>

          <PhotoGallery
            images={resolution?.evidences}
            altPrefix="Evidencia de resolución"
            emptyText="No se adjuntaron evidencias."
          />

          {resolution?.feedback && (
            <div className="min-w-0 overflow-hidden rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="size-4" />
                Feedback del gestor
              </p>
              <p className="mt-2 break-words text-sm [overflow-wrap:anywhere]">
                {resolution.feedback}
              </p>
            </div>
          )}

          {resolution?.reviewedAt && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserCheck className="size-3.5" />
              Revisada {formatDate(resolution.reviewedAt)}
              {resolution.reviewerName ? ` por ${resolution.reviewerName}` : ''}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function getReviewColor(reviewStatusId) {
  if (Number(reviewStatusId) === 2) return '#16a34a';
  if (Number(reviewStatusId) === 3) return '#dc2626';
  return '#d97706';
}

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
