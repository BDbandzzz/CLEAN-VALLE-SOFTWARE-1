import { useMemo, useState } from 'react';
import { Eye, FileSearch } from 'lucide-react';

import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { ReportCard } from '../components/ReportCard';
import { ReportFilters } from '../components/ReportFilters';
import { useReports } from '../context/ReportsContext';
import { useReportCatalogs } from '../hooks/useReportCatalogs';

const EMPTY_FILTERS = {
  search: '',
  categoryId: '',
  riskLevelId: '',
  dateFrom: '',
  dateTo: '',
};

const TABS = {
  mine: 'mine',
  resolved: 'resolved',
};

export default function ViewReportsPage() {
  const { reports, resolvedReports, isLoading, error } = useReports();
  const { categories, riskLevels } = useReportCatalogs();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState(TABS.mine);

  const displayedReports = useMemo(() => {
    const source = activeTab === TABS.resolved ? resolvedReports : reports;
    return applyFilters(source, filters);
  }, [activeTab, filters, reports, resolvedReports]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <ModuleHero
        icon={<Eye />}
        title="Mis Reportes"
        description="Consulta el estado de tus reportes y las soluciones aprobadas."
      />

      <ReportFilters
        filters={filters}
        onChange={(partial) => setFilters((current) => ({ ...current, ...partial }))}
        onClear={() => setFilters(EMPTY_FILTERS)}
        categories={categories}
        riskLevels={riskLevels}
      />

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton
          label="Mis reportes"
          count={reports.length}
          active={activeTab === TABS.mine}
          onClick={() => setActiveTab(TABS.mine)}
        />
        <SegmentedTabButton
          label="Reportes resueltos"
          count={resolvedReports.length}
          active={activeTab === TABS.resolved}
          onClick={() => setActiveTab(TABS.resolved)}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Cargando reportes...</div>
        ) : displayedReports.length ? (
          displayedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              showResolutionSummary={activeTab === TABS.resolved}
            />
          ))
        ) : (
          <EmptyState
            icon={<FileSearch className="mx-auto size-12 text-muted-foreground/50" />}
            title="No se encontraron reportes"
            description="Crea un reporte o ajusta los filtros activos."
            containerClassName="py-16"
          />
        )}
      </div>
    </div>
  );
}

function applyFilters(reports, filters) {
  return reports.filter((report) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const searchable = [
        report.title,
        report.description,
        report.localizationName,
        report.subareaName,
        report.customContext,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    if (filters.categoryId && String(report.categoryId) !== filters.categoryId) return false;
    if (filters.riskLevelId && String(report.riskLevelId) !== filters.riskLevelId) return false;

    const reportDate = report.incidentDate ? new Date(report.incidentDate) : null;
    if (filters.dateFrom && (!reportDate || reportDate < new Date(filters.dateFrom))) return false;
    if (
      filters.dateTo &&
      (!reportDate || reportDate > new Date(`${filters.dateTo}T23:59:59`))
    ) {
      return false;
    }

    return true;
  });
}
