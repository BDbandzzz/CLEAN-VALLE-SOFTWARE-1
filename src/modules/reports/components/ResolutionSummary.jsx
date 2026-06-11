import { Calendar, CheckCircle2, MessageSquare, Star } from 'lucide-react';

import { PhotoGallery } from '@/core/components/ui/photo-gallery';
import { ResolutionMetaPill } from '@/modules/reports/components/ResolutionMetaPill';
import { ResolutionMetric } from '@/modules/reports/components/ResolutionMetric';

export function ResolutionSummary({ report }) {
  if (!report?.resolution) return null;

  const reviewStatus = {
    label: report.resolution.reviewStatusName || 'Pendiente de revision',
    color: report.statusColor || '#16a34a',
  };

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold">Resolucion del operador</p>
        <ResolutionMetaPill label={reviewStatus.label} color={reviewStatus.color} />
      </div>

      <p className="mt-2 text-emerald-900">{report.resolution.description}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResolutionMetric
          icon={<Star className="size-4" />}
          label="Calidad"
          value={report.resolution.qualityName || 'Por evaluar'}
        />
        <ResolutionMetric
          icon={<Calendar className="size-4" />}
          label="Fecha de resolucion"
          value={formatDate(report.resolution.resolvedAt)}
        />
        <ResolutionMetric
          icon={<CheckCircle2 className="size-4" />}
          label="Metodo"
          value={report.resolution.resolutionMethod || 'No especificado'}
        />
      </div>

      {report.resolution.feedback && (
        <div className="mt-4 flex gap-2 rounded-lg border border-emerald-300/70 bg-white/70 p-3">
          <MessageSquare className="mt-0.5 size-4 shrink-0 text-emerald-700" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Feedback del gestor</p>
            <p className="mt-1 text-sm text-emerald-950">{report.resolution.feedback}</p>
          </div>
        </div>
      )}

      {report.resolution.evidences?.length > 0 && (
        <PhotoGallery
          images={report.resolution.evidences}
          altPrefix="Evidencia de resolucion"
          className="mt-4 grid-cols-3 sm:grid-cols-5"
          imageClassName="border-emerald-200"
        />
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) return 'No especificada';
  return new Date(value).toLocaleDateString('es-CO');
}
