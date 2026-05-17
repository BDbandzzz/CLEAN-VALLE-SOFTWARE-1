/**
 * ReportFilters.jsx – Panel de filtros para la vista de reportes.
 *
 * Qué hace:
 *   Renderiza controles de filtrado sin gestionar estado propio.
 *   Todo el estado vive en ViewReportsPage y se pasa vía props.
 *
 * Filtros disponibles:
 *   search     – Texto libre (título o localización).
 *   reportType – Selector de tipo (toggle: segundo clic limpia).
 *   riskLevel  – Selector de nivel de riesgo (toggle).
 *   dateFrom   – Fecha de inicio del rango.
 *   dateTo     – Fecha de fin del rango.
 *
 * Props:
 *   filters  {object}    Estado actual de filtros (ver EMPTY_FILTERS en ViewReportsPage).
 *   onChange {Function}  Recibe un objeto parcial: onChange({ search: 'texto' }).
 *   onClear  {Function}  Limpia todos los filtros de una vez.
 *
 * Para agregar un nuevo filtro:
 *   1. Agregar la clave en EMPTY_FILTERS (ViewReportsPage).
 *   2. Agregar el control aquí y llamar onChange({ nuevaClave: valor }).
 *   3. Agregar la condición en applyFilters() (ViewReportsPage).
 */
import { Search, X } from 'lucide-react';
import { REPORT_TYPES, RISK_LEVELS } from '../constants/reportConstants';
import { TypeButton } from './TypeButton';

export function ReportFilters({ filters, onChange, onClear }) {
  const hasActiveFilters =
    filters.search || filters.reportType || filters.riskLevel ||
    filters.dateFrom || filters.dateTo;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">

      {/* Buscador de texto libre */}
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

      {/* Filtro por tipo de reporte – toggle: segundo clic limpia */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo de reporte</p>
        {/* Mobile: 2 columnas simétricas. sm+: pills con wrap natural */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {REPORT_TYPES.map((t) => (
            <TypeButton
              key={t.id}
              id={`filter-type-${t.id}`}
              label={t.label}
              color={t.color}
              isSelected={filters.reportType === t.id}
              onClick={() => onChange({ reportType: filters.reportType === t.id ? '' : t.id })}
              fullWidth
            />
          ))}
        </div>
      </div>

      {/* Filtro por nivel de riesgo – toggle */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nivel de riesgo</p>
        {/* Mobile: 2 columnas simétricas. sm+: pills con wrap natural */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {RISK_LEVELS.map((r) => (
            <TypeButton
              key={r.id}
              id={`filter-risk-${r.id}`}
              label={r.label}
              color={r.color}
              isSelected={filters.riskLevel === r.id}
              onClick={() => onChange({ riskLevel: filters.riskLevel === r.id ? '' : r.id })}
              fullWidth
            />
          ))}
        </div>
      </div>

      {/* Rango de fecha del incidente */}
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Botón limpiar – solo visible si hay al menos un filtro activo */}
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
