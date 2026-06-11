import { Check, Users } from 'lucide-react';

import { Button } from '@/core/components/ui/button';

export function OperatorAssignmentPanel({
  operators,
  selectedOperatorId,
  notes,
  disabled,
  isLoading,
  onSelect,
  onNotesChange,
  onAssign,
}) {
  return (
    <section className="space-y-5 border-b border-border bg-card px-5 py-6 sm:px-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="size-5" />
          Asignacion de operador
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Solo aparecen operadores activos, con capacidad y especialidad compatible.
        </p>
      </div>

      {disabled ? (
        <p className="text-sm text-muted-foreground">
          Este reporte ya tiene una asignacion activa o alcanzo un estado terminal.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Buscando operadores disponibles...</p>
      ) : operators.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {operators.map((operator) => {
            const selected = selectedOperatorId === operator.authId;
            const capacity = `${operator.currentActiveReports}/${operator.maxActiveReports}`;
            const percent = Math.min(
              100,
              (operator.currentActiveReports / operator.maxActiveReports) * 100
            );

            return (
              <button
                key={operator.authId}
                type="button"
                onClick={() => onSelect(operator.authId)}
                className={[
                  'rounded-lg border p-4 text-left transition',
                  selected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/15'
                    : 'border-border bg-background hover:border-primary/40',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {operator.firstName} {operator.lastName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{operator.codeUser}</p>
                  </div>
                  {selected && <Check className="size-5 text-primary" />}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(operator.specializations ?? []).map((specialization) => (
                    <span key={specialization} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {specialization}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Carga actual</span>
                    <span>{capacity}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay operadores disponibles para esta categoria.
        </p>
      )}

      {!disabled && operators.length > 0 && (
        <div className="space-y-3">
          <label htmlFor="assignment-notes" className="text-sm font-medium text-foreground">
            Notas de asignacion
          </label>
          <textarea
            id="assignment-notes"
            rows={3}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Indicaciones adicionales para el operador."
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button type="button" onClick={onAssign} disabled={!selectedOperatorId}>
            Asignar reporte
          </Button>
        </div>
      )}
    </section>
  );
}
