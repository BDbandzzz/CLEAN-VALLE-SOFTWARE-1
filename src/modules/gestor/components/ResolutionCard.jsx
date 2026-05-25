import React from 'react';
import { Check, X, FileText, Calendar, User, Hash } from 'lucide-react';

export function ResolutionCard({ report, onEvaluate }) {
  const resolutionImages = report.resolutionImages ?? report.images ?? [];
  const formattedDate = report.resolvedAt
    ? new Date(report.resolvedAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '—';

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            {report.title}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="size-3.5" />
              {report.operatorName || 'Operador Desconocido'}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="size-3.5" />
              {report.operatorId || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descripción de la Resolución</p>
        <div className="rounded-lg bg-muted/50 p-4 border border-border">
          <p className="text-sm text-foreground">{report.resolution || 'No se proporcionó descripción de la resolución.'}</p>
        </div>
      </div>

      {resolutionImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Imágenes de la Resolución</p>
          <div className="flex flex-wrap gap-2">
            {resolutionImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Resolución ${idx + 1}`}
                className="h-24 w-24 rounded-lg object-cover border border-border"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onEvaluate(report.id, true)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          <Check className="size-4" />
          Aprobar como Válida
        </button>
        <button
          onClick={() => onEvaluate(report.id, false)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 hover:border-red-300"
        >
          <X className="size-4" />
          Marcar como Inválida
        </button>
      </div>
    </div>
  );
}
