import { Calendar, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ResolutionSummary } from '@/modules/reports/components/ResolutionSummary';
import { getStatusMeta, getSubtypeLabel } from '@/modules/reports/constants/reportConstants';

export function OperatorReportCard({ report, showResolution = false }) {
  const navigate = useNavigate();
  const status = getStatusMeta(report.statusId);
  const subtypeLabel = getSubtypeLabel(report.categoryId, report.subtypeId);

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap gap-2">
            <ReportBadge type="category" value={report.categoryId} />
            <ReportBadge type="risk" value={report.riskLevelId} />
            <span
              className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: `${status.color}22`, color: status.color, border: `1.5px solid ${status.color}55` }}
            >
              {status.label}
            </span>
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">{report.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{report.locationName}</span>
            <span className="flex items-center gap-1"><Calendar className="size-3" />{formatDate(report.incidentDate)}</span>
            <span>Razon: {subtypeLabel}</span>
          </div>

          {showResolution && report.resolution && (
            <ResolutionSummary report={report} />
          )}
        </div>

        {!showResolution && (
          <button
            type="button"
            onClick={() => navigate(`/operator/reports/${report.id}/resolution`)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Send className="size-4" />
            Enviar resolucion
          </button>
        )}
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
