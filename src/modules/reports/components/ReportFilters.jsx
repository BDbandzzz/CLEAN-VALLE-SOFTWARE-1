import { Search, X, Tag, AlertTriangle } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { getReportCategoryOptions, getRiskLevelOptions } from '../constants/reportConstants';
import { ReportDateField } from './ReportDateField';
import { SelectionGroup } from './SelectionGroup';

export function ReportFilters({ filters, onChange, onClear }) {
  const categoryOptions = getReportCategoryOptions();
  const riskLevelOptions = getRiskLevelOptions();

  const hasActiveFilters =
    filters.search || filters.categoryId || filters.riskLevelId ||
    filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="report-search"
          type="text"
          placeholder="Buscar por titulo, ubicacion o descripcion..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="
            w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm
            placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
          "
        />
      </div>

      <SelectionGroup
        label="Tipo de reporte"
        icon={<Tag className="size-4" />}
        items={categoryOptions}
        idPrefix="filter-category"
        selected={filters.categoryId}
        onSelect={(id) => onChange({ categoryId: filters.categoryId === id ? '' : id })}
      />

      <SelectionGroup
        label="Nivel de riesgo"
        icon={<AlertTriangle className="size-4" />}
        items={riskLevelOptions}
        idPrefix="filter-risk"
        selected={filters.riskLevelId}
        onSelect={(id) => onChange({ riskLevelId: filters.riskLevelId === id ? '' : id })}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReportDateField
          id="filter-date-from"
          label="Desde"
          value={filters.dateFrom}
          onChange={(dateFrom) => onChange({ dateFrom })}
        />
        <ReportDateField
          id="filter-date-to"
          label="Hasta"
          value={filters.dateTo}
          onChange={(dateTo) => onChange({ dateTo })}
        />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="h-auto justify-start px-0 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
