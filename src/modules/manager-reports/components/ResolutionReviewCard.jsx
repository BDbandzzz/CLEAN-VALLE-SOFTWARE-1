import { Calendar, CheckCircle2, User, Wrench, XCircle } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { SelectField } from '@/core/components/ui/select-field';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';

export function ResolutionReviewCard({
  resolution,
  qualities,
  draft,
  disabled,
  onChange,
  onRequestReview,
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              Reporte #{resolution.report.id} · Resolucion #{resolution.id}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              {resolution.report.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <ReportBadge
                type="category"
                label={resolution.report.categoryName}
                color={resolution.report.categoryColor}
              />
              <ReportBadge
                type="risk"
                label={resolution.report.riskLevelName}
                color={resolution.report.riskLevelColor}
              />
            </div>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><User className="size-3.5" />{resolution.operatorName}</p>
            <p className="flex items-center gap-2"><Calendar className="size-3.5" />{formatDate(resolution.resolvedAt)}</p>
            <p className="flex items-center gap-2"><Wrench className="size-3.5" />{resolution.method || 'Sin metodo'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Descripcion del operador</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {resolution.description || 'Sin descripcion.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Evidencias</h3>
            {resolution.evidences?.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {resolution.evidences.map((src, index) => (
                  <a key={src} href={src} target="_blank" rel="noreferrer">
                    <img
                      src={src}
                      alt={`Evidencia de resolucion ${index + 1}`}
                      className="aspect-square w-full rounded-lg border border-border object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No se adjuntaron fotografias.</p>
            )}
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <SelectField
            id={`resolution-quality-${resolution.id}`}
            label="Calidad de la resolucion"
            value={draft.qualityId}
            options={qualities}
            onChange={(event) => onChange({ qualityId: event.target.value })}
            placeholder="Selecciona una calidad"
            disabled={disabled}
          />

          <label className="block space-y-2 text-sm font-medium text-foreground">
            Comentario del gestor
            <textarea
              rows={5}
              value={draft.feedback}
              onChange={(event) => onChange({ feedback: event.target.value })}
              placeholder="Observaciones para el operador."
              disabled={disabled}
              className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={disabled}
              onClick={() => onRequestReview(true)}
            >
              <CheckCircle2 className="size-4" />
              Aprobar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={disabled}
              onClick={() => onRequestReview(false)}
            >
              <XCircle className="size-4" />
              Descartar
            </Button>
          </div>
        </div>
      </div>
    </article>
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
