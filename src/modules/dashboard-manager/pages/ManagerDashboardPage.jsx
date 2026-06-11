import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  RefreshCw,
  Send,
} from 'lucide-react';

import { DashboardBarChart } from '@/core/components/dashboard/DashboardBarChart';
import { DashboardDonutChart } from '@/core/components/dashboard/DashboardDonutChart';
import { DashboardQuickActions } from '@/core/components/dashboard/DashboardQuickActions';
import { Button } from '@/core/components/ui/button';
import { MetricCard } from '@/core/components/ui/metric-card';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { REPORT_STATUS_IDS } from '@/core/constants/domainConstants';
import { useManagerReportDashboard } from '@/modules/manager-reports/hooks/useManagerReportDashboard';

const DASHBOARD_FILTERS = Object.freeze({
  categoryId: '',
  subtypeId: '',
  riskLevelId: '',
  statusId: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  pageSize: 1,
});

const MANAGER_ACTIONS = [
  {
    title: 'Gestionar reportes',
    description: 'Clasificar, descartar y asignar reportes.',
    to: '/manager/reports',
    icon: ClipboardList,
  },
  {
    title: 'Revisar resoluciones',
    description: 'Evaluar soluciones enviadas por operadores.',
    to: '/manager/resolutions',
    icon: ClipboardCheck,
  },
];

export default function ManagerDashboardPage() {
  const { dashboard, isLoading, error, refresh } =
    useManagerReportDashboard(DASHBOARD_FILTERS);
  const statusData = (dashboard.byStatus ?? []).map(toChartItem);
  const categoryData = (dashboard.byCategory ?? []).map(toChartItem);
  const riskData = (dashboard.byRisk ?? []).map(toChartItem);
  const totalReports = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-10 sm:space-y-8 sm:pb-12">
      <ModuleHero
        icon={<ClipboardCheck />}
        title="Panel del gestor"
        description="Panorama general del flujo y la clasificacion de reportes."
        actions={
          <Button
            type="button"
            variant="secondary"
            className="bg-white/20 text-primary-foreground hover:bg-white/30"
            onClick={refresh}
          >
            <RefreshCw className="size-4" />
            Actualizar
          </Button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          No fue posible cargar el panel: {error}
        </div>
      )}

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 [&>*]:min-w-0">
        <MetricCard
          title="Reportes totales"
          value={isLoading ? '...' : totalReports}
          icon={<ClipboardList className="size-4" />}
        />
        <StatusMetric
          title="Pendientes"
          statusId={REPORT_STATUS_IDS.PENDING}
          statuses={statusData}
          icon={<Clock3 className="size-4" />}
          isLoading={isLoading}
        />
        <StatusMetric
          title="Asignados"
          statusId={REPORT_STATUS_IDS.ASSIGNED}
          statuses={statusData}
          icon={<Send className="size-4" />}
          isLoading={isLoading}
        />
        <StatusMetric
          title="Resueltos"
          statusId={REPORT_STATUS_IDS.RESOLVED}
          statuses={statusData}
          icon={<CheckCircle2 className="size-4" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-5 [&>*]:min-w-0">
        <DashboardDonutChart
          title="Flujo de reportes"
          description="Distribucion actual por estado."
          data={statusData}
          centerLabel="reportes"
          isLoading={isLoading}
        />
        <DashboardBarChart
          title="Reportes por nivel de riesgo"
          description="Concentracion de reportes segun su impacto."
          data={riskData}
          isLoading={isLoading}
        />
      </div>

      <DashboardBarChart
        title="Reportes por categoria"
        description="Categorias con mayor volumen registrado."
        data={categoryData}
        layout="vertical"
        isLoading={isLoading}
      />

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Mesa operativa</h2>
          <p className="text-sm text-muted-foreground">
            Accede directamente a las tareas de gestion y revision.
          </p>
        </div>
        <DashboardQuickActions actions={MANAGER_ACTIONS} />
      </div>
    </div>
  );
}

function StatusMetric({ title, statusId, statuses, icon, isLoading }) {
  const status = statuses.find((item) => Number(item.id) === statusId);

  return (
    <MetricCard
      title={title}
      value={isLoading ? '...' : status?.value ?? 0}
      icon={icon}
      accentColor={status?.color}
    />
  );
}

function toChartItem(item) {
  return {
    id: item.id,
    label: item.label,
    value: Number(item.count ?? item.value ?? 0),
    color: item.color || '#0f766e',
  };
}
