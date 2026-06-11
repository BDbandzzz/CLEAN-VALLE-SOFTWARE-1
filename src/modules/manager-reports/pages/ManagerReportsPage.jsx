import { useMemo, useState } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { ManagerReportFilters } from '@/modules/manager-reports/components/ManagerReportFilters';
import { ManagerReportTable } from '@/modules/manager-reports/components/ManagerReportTable';
import { useManagerReportDashboard } from '@/modules/manager-reports/hooks/useManagerReportDashboard';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';

const INITIAL_FILTERS = {
  categoryId: '',
  subtypeId: '',
  riskLevelId: '',
  statusId: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  pageSize: 15,
};

export default function ManagerReportsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const {
    categories,
    riskLevels,
    reportStatuses,
    subtypesByCategory,
    loadSubtypes,
  } = useReportCatalogs();
  const { dashboard, isLoading, error } = useManagerReportDashboard(filters);
  const subtypes = subtypesByCategory[filters.categoryId] ?? [];
  const totalPages = Math.max(1, Math.ceil((dashboard.total ?? 0) / filters.pageSize));

  const pageLabel = useMemo(
    () => `Pagina ${filters.page} de ${totalPages}`,
    [filters.page, totalPages]
  );

  const changeFilters = (partial) => {
    setFilters((current) => ({ ...current, ...partial }));
  };

  const changeCategory = async (categoryId) => {
    changeFilters({ categoryId, subtypeId: '', page: 1 });
    if (categoryId) await loadSubtypes(categoryId);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <ModuleHero
        icon={<ClipboardList />}
        title="Gestion de Reportes"
        description="Clasifica, analiza y asigna los incidentes registrados."
      />

      <ManagerReportFilters
        filters={filters}
        categories={categories}
        subtypes={subtypes}
        riskLevels={riskLevels}
        statuses={reportStatuses}
        onChange={changeFilters}
        onCategoryChange={changeCategory}
        onReset={() => setFilters(INITIAL_FILTERS)}
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ManagerReportTable reports={dashboard.reports ?? []} isLoading={isLoading} />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{pageLabel}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Pagina anterior"
            disabled={filters.page <= 1 || isLoading}
            onClick={() => changeFilters({ page: filters.page - 1 })}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Pagina siguiente"
            disabled={filters.page >= totalPages || isLoading}
            onClick={() => changeFilters({ page: filters.page + 1 })}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
