import { useMemo, useState } from 'react';
import { Eye, FileSearch } from 'lucide-react';

import { EmptyState } from '@/core/components/ui/empty-state';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { ReportCard } from '../components/ReportCard';
import { ReportFilters } from '../components/ReportFilters';
import { useReports } from '../context/ReportsContext';

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

function applyFilters(reports, filters) {
  return reports.filter((report) => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const searchable = [
        report.title,
        report.description,
        report.locationName,
        report.customContext,
      ].join(' ').toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    if (filters.categoryId && report.categoryId !== filters.categoryId) return false;
    if (filters.riskLevelId && report.riskLevelId !== filters.riskLevelId) return false;

    if (filters.dateFrom || filters.dateTo) {
      const reportDate = report.incidentDate ? new Date(report.incidentDate) : null;
      if (!reportDate) return false;
      if (filters.dateFrom && reportDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && reportDate > new Date(`${filters.dateTo}T23:59:59`)) return false;
    }

    return true;
  });
}

const ViewReportsPage = () => {
  const { reports, deleteReport } = useReports();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeTab, setActiveTab] = useState(TABS.mine);

  const resolvedByOperators = useMemo(
    () => reports.filter((report) => report.resolution),
    [reports]
  );

  const displayedReports = useMemo(
    () => applyFilters(activeTab === TABS.resolved ? resolvedByOperators : reports, filters),
    [activeTab, reports, resolvedByOperators, filters]
  );

  const handleFilterChange = (partial) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <Eye className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mis Reportes</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Consulta el estado y el historial de reportes creados por tu cuenta.
            </p>
          </div>
        </div>
      </section>

      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton
          label="Mis reportes"
          count={reports.length}
          active={activeTab === TABS.mine}
          onClick={() => setActiveTab(TABS.mine)}
        />
        <SegmentedTabButton
          label="Resueltos por operadores"
          count={resolvedByOperators.length}
          active={activeTab === TABS.resolved}
          onClick={() => setActiveTab(TABS.resolved)}
        />
      </div>

      <div className="space-y-4">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={deleteReport}
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
};

export default ViewReportsPage;
