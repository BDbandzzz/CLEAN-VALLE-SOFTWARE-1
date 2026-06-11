import { ArrowLeft, Check, Layers, Tag, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/core/components/ui/button';
import { SelectionGroup } from '@/modules/reports/components/SelectionGroup';

export function ReportTypePreviewDialog({
  open,
  formData,
  onBack,
  onContinue,
}) {
  const category = useMemo(
    () => ({
      id: 'category-preview',
      label: formData.label,
      description: formData.description,
      color: formData.color,
    }),
    [formData.color, formData.description, formData.label]
  );
  const subtypes = useMemo(
    () =>
      formData.subtypes.map((subtype) => ({
        ...subtype,
        color: formData.color,
      })),
    [formData.color, formData.subtypes]
  );
  const [selectedSubtypeId, setSelectedSubtypeId] = useState(
    subtypes[0]?.id ?? ''
  );

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onBack?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-type-preview-title"
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="report-type-preview-title"
              className="text-lg font-semibold text-foreground"
            >
              Vista previa del tipo de reporte
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Así verán los usuarios la categoría y sus razones al crear un reporte.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label="Cerrar vista previa"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          <SelectionGroup
            label="Tipo de reporte"
            icon={<Tag className="size-4" />}
            required
            items={[category]}
            idPrefix="preview-category"
            selected={category.id}
            onSelect={() => {}}
          />
          <SelectionGroup
            label="Razón del reporte"
            icon={<Layers className="size-4" />}
            required
            items={subtypes}
            idPrefix="preview-subtype"
            selected={selectedSubtypeId}
            onSelect={setSelectedSubtypeId}
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Volver a editar
          </Button>
          <Button type="button" onClick={onContinue}>
            <Check className="size-4" />
            Continuar
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
}
