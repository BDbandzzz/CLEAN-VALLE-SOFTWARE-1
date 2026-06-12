import { Calendar, MapPin, User } from 'lucide-react';

import { PhotoGallery } from '@/core/components/ui/photo-gallery';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';

export function ManagerReportOverview({ report }) {
  return (
    <section className="space-y-6 rounded-lg bg-card px-5 py-6 shadow-sm sm:px-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Reporte #{report.id}</p>
          <h2 className="mt-1 text-xl font-bold text-foreground">{report.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <ReportBadge type="category" label={report.categoryName} color={report.categoryColor} />
            <ReportBadge type="risk" label={report.riskLevelName} color={report.riskLevelColor} />
            <ReportStatusPill
              meta={{
                id: report.statusId,
                label: report.statusName,
                color: report.statusColor,
              }}
            />
          </div>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><User className="size-4" />{report.reporterName || 'Usuario'}</p>
          <p className="flex items-center gap-2"><Calendar className="size-4" />{formatDate(report.incidentDate)}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4" />{formatLocation(report)}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Descripcion</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {report.description}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Contexto adicional</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {report.customContext || 'No aplica.'}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Evidencias del reporte</h3>
        <PhotoGallery
          images={report.evidences}
          className="mt-3 lg:grid-cols-6"
          emptyText="No hay fotografias adjuntas."
        />
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatLocation(report) {
  return [report.localizationName, report.subareaName].filter(Boolean).join(' - ') || 'Sin ubicacion';
}
