import { Search, X } from 'lucide-react';
import { REPORT_TYPES, RISK_LEVELS } from '../constants/reportConstants';
import { TypeButton } from './TypeButton';

/**
 * Filtros de búsqueda para la vista de reportes:
 * texto libre, tipo de reporte, nivel de riesgo y fecha.
 */
export function ReportFilters({ filters, onChange, onClear }) {
  const hasActiveFilters =
    filters.search || filters.reportType || filters.riskLevel || filters.dateFrom || filters.dateTo;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
      {/* Buscador de texto */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="report-search"
          type="text"
          placeholder="Buscar reporte por título o localización…"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="
            w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-4 text-sm
            placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
          "
        />
      </div>

      {/* Tipo de reporte */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo de reporte</p>
        <div className="flex flex-wrap gap-2">
          {REPORT_TYPES.map((t) => (
            <TypeButton
              key={t.id}
              id={`filter-type-${t.id}`}
              label={t.label}
              color={t.color}
              isSelected={filters.reportType === t.id}
              onClick={() => onChange({ reportType: filters.reportType === t.id ? '' : t.id })}
            />
          ))}
        </div>
      </div>

      {/* Nivel de riesgo */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nivel de riesgo</p>
        <div className="flex flex-wrap gap-2">
          {RISK_LEVELS.map((r) => (
            <TypeButton
              key={r.id}
              id={`filter-risk-${r.id}`}
              label={r.label}
              color={r.color}
              isSelected={filters.riskLevel === r.id}
              onClick={() => onChange({ riskLevel: filters.riskLevel === r.id ? '' : r.id })}
            />
          ))}
        </div>
      </div>

      {/* Rango de fecha */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="filter-date-from" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Desde
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="
              w-full rounded-lg border border-input bg-background px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="filter-date-to" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hasta
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="
              w-full rounded-lg border border-input bg-background px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          />
        </div>
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
        >
          <X className="size-3.5" />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
