import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, ChevronLeft, ChevronRight, Layers3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { ManagerReportFilters } from '@/modules/manager-reports/components/ManagerReportFilters';
import { ManagerReportTable } from '@/modules/manager-reports/components/ManagerReportTable';
import { ReportGroupDialog } from '@/modules/manager-reports/components/ReportGroupDialog';
import { useManagerReportDashboard } from '@/modules/manager-reports/hooks/useManagerReportDashboard';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';
import {
  createReportGroup,
  getGroupableReports,
} from '@/services/managerReportService';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';

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
  const navigate = useNavigate();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedReports, setSelectedReports] = useState([]);
  const [groupForm, setGroupForm] = useState({ title: '', description: '' });
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupableReportIds, setGroupableReportIds] = useState(null);
  const {
    categories,
    riskLevels,
    reportStatuses,
    subtypesByCategory,
    loadSubtypes,
  } = useReportCatalogs();
  const { dashboard, isLoading, error } = useManagerReportDashboard(filters);
  const subtypes = subtypesByCategory?.[filters.categoryId] ?? [];
  const totalPages = Math.max(1, Math.ceil((dashboard.total ?? 0) / filters.pageSize));

  const pageLabel = useMemo(
    () => `Pagina ${filters.page} de ${totalPages}`,
    [filters.page, totalPages]
  );

  useEffect(() => {
    let isMounted = true;

    getGroupableReports()
      .then((reports) => {
        if (isMounted) {
          setGroupableReportIds(
            new Set(reports.map((report) => String(report.id)))
          );
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setGroupableReportIds(new Set());
          showErrorAlert(loadError);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const changeFilters = (partial) => {
    setFilters((current) => ({ ...current, ...partial }));
  };

  const changeCategory = async (categoryId) => {
    changeFilters({ categoryId, subtypeId: '', page: 1 });
    if (categoryId) await loadSubtypes(categoryId);
  };

  const toggleSelection = (report) => {
    setSelectedReports((current) =>
      current.some((item) => item.id === report.id)
        ? current.filter((item) => item.id !== report.id)
        : [...current, report]
    );
  };

  const confirmGroupCreation = async () => {
    setIsCreatingGroup(true);
    try {
      const group = await createReportGroup({
        ...groupForm,
        reportIds: selectedReports.map((report) => report.id),
      });
      showSuccessAlert('El grupo de reportes fue creado correctamente.');
      setShowGroupDialog(false);
      setSelectedReports([]);
      setGroupForm({ title: '', description: '' });
      navigate(`/manager/groups/${group.id}`);
    } catch (createError) {
      showErrorAlert(createError);
    } finally {
      setIsCreatingGroup(false);
    }
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

      <div className="flex flex-col gap-3 rounded-lg bg-card px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Agrupación de reportes
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Selecciona al menos dos reportes de la misma categoría.
          </p>
        </div>
        <Button
          type="button"
          disabled={selectedReports.length < 2}
          onClick={() => setShowGroupDialog(true)}
        >
          <Layers3 className="size-4" />
          Crear grupo ({selectedReports.length})
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ManagerReportTable
        reports={dashboard.reports ?? []}
        isLoading={isLoading}
        selectedIds={selectedReports.map((report) => report.id)}
        selectedCategoryId={selectedReports[0]?.categoryId ?? ''}
        groupableReportIds={groupableReportIds}
        onToggleSelection={toggleSelection}
      />

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

      <ReportGroupDialog
        open={showGroupDialog}
        reportCount={selectedReports.length}
        values={groupForm}
        isLoading={isCreatingGroup}
        onChange={(field, value) =>
          setGroupForm((current) => ({ ...current, [field]: value }))
        }
        onConfirm={confirmGroupCreation}
        onClose={() => setShowGroupDialog(false)}
      />
    </div>
  );
}
