import { RotateCcw } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { SelectField } from '@/core/components/ui/select-field';

export function ManagerReportFilters({
  filters,
  categories,
  subtypes,
  riskLevels,
  statuses,
  onChange,
  onReset,
  onCategoryChange,
}) {
  return (
    <section className="border-y border-border bg-card px-4 py-5 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SelectField
          id="manager-filter-category"
          label="Categoria"
          value={filters.categoryId}
          options={categories}
          onChange={(event) => onCategoryChange(event.target.value)}
          placeholder="Todas las categorias"
        />
        <SelectField
          id="manager-filter-subtype"
          label="Razon"
          value={filters.subtypeId}
          options={subtypes}
          onChange={(event) => onChange({ subtypeId: event.target.value, page: 1 })}
          placeholder="Todas las razones"
          disabled={!filters.categoryId}
        />
        <SelectField
          id="manager-filter-risk"
          label="Nivel de riesgo"
          value={filters.riskLevelId}
          options={riskLevels}
          onChange={(event) => onChange({ riskLevelId: event.target.value, page: 1 })}
          placeholder="Todos los niveles"
        />
        <SelectField
          id="manager-filter-status"
          label="Estado"
          value={filters.statusId}
          options={statuses}
          onChange={(event) => onChange({ statusId: event.target.value, page: 1 })}
          placeholder="Todos los estados"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex-1 space-y-2 text-sm font-medium text-foreground">
          Desde
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange({ dateFrom: event.target.value, page: 1 })}
            className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="flex-1 space-y-2 text-sm font-medium text-foreground">
          Hasta
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange({ dateTo: event.target.value, page: 1 })}
            className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <Button type="button" variant="outline" onClick={onReset}>
          <RotateCcw className="size-4" />
          Limpiar
        </Button>
      </div>
    </section>
  );
}
