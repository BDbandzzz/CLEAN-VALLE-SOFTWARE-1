import { Calendar, Layers3, MapPin, Send, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { PhotoGallery } from '@/core/components/ui/photo-gallery';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';

export function OperatorAssignmentCard({ assignment, onReject }) {
  const navigate = useNavigate();
  const isGroup = assignment.sourceType === 'group';
  const resolvePath = isGroup
    ? `/operator/groups/${assignment.id}/resolution`
    : `/operator/reports/${assignment.id}/resolution`;

  return (
    <article className="rounded-lg bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <ReportBadge
              type="category"
              label={assignment.categoryName}
              color={assignment.categoryColor}
            />
            {!isGroup && (
              <ReportBadge
                type="risk"
                label={assignment.riskLevelName}
                color={assignment.riskLevelColor}
              />
            )}
            {isGroup && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Layers3 className="size-3" />
                {assignment.reports?.length ?? 0} reportes
              </span>
            )}
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {isGroup ? `Grupo #${assignment.id}` : `Reporte #${assignment.id}`}
            </p>
            <h2 className="mt-1 text-base font-semibold text-foreground">
              {assignment.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {assignment.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              Asignado {formatDate(assignment.assignment?.assignedAt)}
            </span>
            {!isGroup && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {formatLocation(assignment)}
              </span>
            )}
          </div>

          {assignment.assignment?.notes && (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {assignment.assignment.notes}
            </p>
          )}

          {!isGroup && (
            <PhotoGallery
              images={assignment.evidences}
              className="max-w-xl grid-cols-3 sm:grid-cols-5"
              emptyText="Sin evidencias adjuntas"
            />
          )}
        </div>

        <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:w-48 lg:grid-cols-1">
          <Button type="button" onClick={() => navigate(resolvePath)}>
            <Send className="size-4" />
            Generar resolución
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onReject(assignment)}
          >
            <XCircle className="size-4" />
            Rechazar asignación
          </Button>
        </div>
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) return 'sin fecha';
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatLocation(report) {
  return (
    [report.localizationName, report.subareaName].filter(Boolean).join(' - ') ||
    'Sin ubicación'
  );
}
