import { Check, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { SelectField } from '@/core/components/ui/select-field';

function getSpecializationLabel(specialization) {
  if (typeof specialization === 'string') return specialization;
  return specialization?.label ?? specialization?.name ?? '';
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function OperatorAssignmentPanel({
  operators,
  selectedOperatorId,
  notes,
  disabled,
  isLoading,
  categoryLabel,
  subtypeLabel,
  onSelect,
  onNotesChange,
  onAssign,
}) {
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const specializationOptions = useMemo(() => {
    const labels = new Set();

    operators.forEach((operator) => {
      (operator.specializations ?? []).forEach((item) => {
        const label = getSpecializationLabel(item);
        if (label) labels.add(label);
      });
    });

    return Array.from(labels)
      .sort((left, right) => left.localeCompare(right, 'es'))
      .map((label) => ({ id: label, label }));
  }, [operators]);
  const filteredOperators = useMemo(() => {
    const query = normalize(search);

    return operators.filter((operator) => {
      const operatorSpecializations = (operator.specializations ?? [])
        .map(getSpecializationLabel)
        .filter(Boolean);
      const matchesSpecialization =
        !specialization || operatorSpecializations.includes(specialization);
      const matchesSearch =
        !query ||
        normalize(
          `${operator.firstName} ${operator.lastName} ${operator.codeUser}`
        ).includes(query);

      return matchesSpecialization && matchesSearch;
    });
  }, [operators, search, specialization]);
  const selectedOperatorIsVisible = filteredOperators.some(
    (operator) => operator.authId === selectedOperatorId
  );

  return (
    <section className="space-y-5 bg-card px-5 py-6 sm:px-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="size-5" />
          Asignacion de operador
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Solo aparecen operadores activos, con capacidad y especialidad compatible.
        </p>
        {(categoryLabel || subtypeLabel) && (
          <p className="mt-2 text-xs font-medium text-primary">
            {[categoryLabel, subtypeLabel].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {disabled ? (
        <p className="text-sm text-muted-foreground">
          Este reporte ya tiene una asignacion activa o alcanzo un estado terminal.
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Buscando operadores disponibles...</p>
      ) : operators.length ? (
        <>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)]">
            <div className="relative self-end">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar operador por nombre o código"
                className="pl-9"
                aria-label="Buscar operador"
              />
            </div>
            <SelectField
              id="operator-specialization-filter"
              label="Especialización"
              value={specialization}
              options={specializationOptions}
              placeholder="Todas las especializaciones"
              onChange={(event) => setSpecialization(event.target.value)}
            />
          </div>

          {filteredOperators.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredOperators.map((operator) => {
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
                  {(operator.specializations ?? []).map((item) => {
                    const label = getSpecializationLabel(item);
                    return (
                      <span
                        key={typeof item === 'string' ? item : item.id ?? label}
                        className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        {label}
                      </span>
                    );
                  })}
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
            <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              Ningún operador coincide con la búsqueda y especialización seleccionadas.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay operadores disponibles para esta categoria.
        </p>
      )}

      {!disabled && filteredOperators.length > 0 && (
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
          <Button
            type="button"
            onClick={onAssign}
            disabled={!selectedOperatorId || !selectedOperatorIsVisible}
          >
            Asignar reporte
          </Button>
        </div>
      )}
    </section>
  );
}
