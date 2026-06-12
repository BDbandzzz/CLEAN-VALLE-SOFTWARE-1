import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { PhotoGallery } from '@/core/components/ui/photo-gallery';
import { ReportInfoBlock } from './ReportInfoBlock';
import { ReportInfoItem } from './ReportInfoItem';
import { ReportBadge } from './ReportBadge';
import { ReportStatusPill } from './ReportStatusPill';
import { ResolutionSummary } from './ResolutionSummary';

export function ReportCard({ report, showResolutionSummary = false }) {
  const [reportExpanded, setReportExpanded] = useState(false);
  const [resolutionExpanded, setResolutionExpanded] = useState(false);
  const statusMeta = {
    id: report.statusId,
    label: report.statusName || 'Sin estado',
    color: report.statusColor || '#6b7280',
  };

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
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReportBadge
              type="category"
              label={report.categoryName}
              color={report.categoryColor}
            />
            <ReportBadge
              type="risk"
              label={report.riskLevelName}
              color={report.riskLevelColor}
            />
            <ReportStatusPill meta={statusMeta} />
          </div>
          <h3 className="break-words text-base font-semibold text-foreground">
            {report.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{formatLocation(report)}</span>
            <span className="flex items-center gap-1"><Calendar className="size-3" />{formattedDate}</span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:justify-end">
          <Button
            type="button"
            onClick={() => setReportExpanded((value) => !value)}
            variant={reportExpanded ? 'default' : 'outline'}
            className="flex-1 px-3 text-xs sm:flex-none"
            aria-expanded={reportExpanded}
          >
            Detalles
            {reportExpanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </Button>
          {report.resolution && (
            <Button
              type="button"
              onClick={() => setResolutionExpanded((value) => !value)}
              variant={resolutionExpanded ? 'default' : 'outline'}
              className="flex-1 px-3 text-xs sm:flex-none"
              aria-expanded={resolutionExpanded}
            >
              Resolución
              {resolutionExpanded ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {reportExpanded && (
        <div className="space-y-4 border-t border-border bg-muted/30 px-5 pb-5 pt-4">
          <ReportInfoBlock label="Descripcion" value={report.description || 'Sin descripcion.'} />

          {report.customContext && (
            <ReportInfoBlock label="Contexto adicional" value={report.customContext} />
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ReportInfoItem label="Subtipo" value={report.subtypeName || 'Sin subtipo'} />
            <ReportInfoItem label="Ubicacion" value={formatLocation(report)} />
            <ReportInfoItem label="Fecha del incidente" value={formattedDate} />
            <ReportInfoItem label="Reportado el" value={formattedCreatedAt} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Evidencias
            </p>
            <PhotoGallery
              images={report.evidences}
              className="max-w-xl grid-cols-3 sm:grid-cols-5"
              emptyText="Sin evidencias adjuntas"
            />
          </div>

        </div>
      )}

      {resolutionExpanded && report.resolution && (
        <div className="border-t border-border bg-muted/20 px-4 py-4 sm:px-5">
          <ResolutionSummary
            report={report}
            compact={!showResolutionSummary}
          />
        </div>
      )}
    </article>
  );
}

function formatLocation(report) {
  return [report.localizationName, report.subareaName].filter(Boolean).join(' - ') || 'Sin ubicacion';
}
