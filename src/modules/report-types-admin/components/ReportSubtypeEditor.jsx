import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';

export function ReportSubtypeEditor({
  subtypes,
  errors = {},
  onAdd,
  onChange,
  onRemove,
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Razones específicas</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra los subtipos asociados a esta categoría.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onAdd}>
          <Plus className="size-4" />
          Añadir razón
        </Button>
      </div>

      {errors.subtypes && <p className="text-xs text-destructive">{errors.subtypes}</p>}

      <div className="space-y-3">
        {subtypes.map((subtype, index) => (
          <div
            key={subtype.id}
            className="rounded-lg border border-border bg-background/80 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <div className="space-y-2">
                <Label htmlFor={`subtype-label-${subtype.id}`}>Título de la razón</Label>
                <Input
                  id={`subtype-label-${subtype.id}`}
                  value={subtype.label}
                  onChange={(event) => onChange(subtype.id, 'label', event.target.value)}
                  placeholder={`Razón ${index + 1}`}
                  aria-invalid={Boolean(errors.subtypeErrors?.[subtype.id])}
                />
                {errors.subtypeErrors?.[subtype.id] && (
                  <p className="text-xs text-destructive">{errors.subtypeErrors[subtype.id]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`subtype-description-${subtype.id}`}>Descripción</Label>
                <Input
                  id={`subtype-description-${subtype.id}`}
                  value={subtype.description}
                  onChange={(event) => onChange(subtype.id, 'description', event.target.value)}
                  placeholder="Contexto de la razón"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="destructive" onClick={() => onRemove(subtype.id)}>
                  <Trash2 className="size-4" />
                  Quitar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
