import { CheckCircle2, Clock, Gauge, MessageSquare, Star } from 'lucide-react';

import {
  getResolutionQualityMeta,
  getResolutionReviewStatusMeta,
  getRiskMeta,
} from '@/modules/reports/constants/reportConstants';

export function ResolutionSummary({ report }) {
  if (!report?.resolution) return null;

  const reviewStatus = getResolutionReviewStatusMeta(
    report.resolution.reviewStatusId ?? report.resolution.statusId
  );
  const quality = getResolutionQualityMeta(report.resolution.qualityId);
  const risk = getRiskMeta(report.riskLevelId);

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold">Resolucion del operador</p>
        <MetaPill label={reviewStatus.label} color={reviewStatus.color} />
      </div>

      <p className="mt-2 text-emerald-900">{report.resolution.description}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          icon={<Star className="size-4" />}
          label="Satisfaccion"
          value={quality ? `${quality.label} (${quality.score}/5)` : 'Por evaluar'}
        />
        <Metric
          icon={<Gauge className="size-4" />}
          label="Prioridad"
          value={`${risk.priorityScore} pts`}
        />
        <Metric
          icon={<Clock className="size-4" />}
          label="Respuesta esperada"
          value={`${risk.responseTimeHours} h`}
        />
        <Metric
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
    </section>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-white/75 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-emerald-950">{value}</p>
    </div>
  );
}

function MetaPill({ label, color }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${color}22`, color, border: `1.5px solid ${color}55` }}
    >
      {label}
    </span>
  );
}
