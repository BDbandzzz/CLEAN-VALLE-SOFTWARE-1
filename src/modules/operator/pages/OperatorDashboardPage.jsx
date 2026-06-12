import {
  Activity,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Gauge,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { useMemo } from 'react';

import { DashboardBarChart } from '@/core/components/dashboard/DashboardBarChart';
import { DashboardDonutChart } from '@/core/components/dashboard/DashboardDonutChart';
import { DashboardQuickActions } from '@/core/components/dashboard/DashboardQuickActions';
import { Button } from '@/core/components/ui/button';
import { MetricCard } from '@/core/components/ui/metric-card';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { RESOLUTION_REVIEW_STATUS_IDS } from '@/core/constants/domainConstants';
import { useAuth } from '@/core/context/AuthContext';
import { OperatorSpecializations } from '@/modules/operator/components/OperatorSpecializations';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';

const OPERATOR_ACTIONS = [
  {
    title: 'Mis asignaciones',
    description: 'Revisa los casos que requieren atención.',
    to: '/operator/assignments',
    icon: ClipboardList,
  },
  {
    title: 'Resoluciones',
    description: 'Consulta los resultados enviados y su revisión.',
    to: '/operator/resolutions',
    icon: ClipboardCheck,
  },
];

const RESOLUTION_STATUS = {
  [RESOLUTION_REVIEW_STATUS_IDS.SUBMITTED]: {
    label: 'Pendientes',
    color: '#d97706',
  },
  [RESOLUTION_REVIEW_STATUS_IDS.APPROVED]: {
    label: 'Aprobadas',
    color: '#16a34a',
  },
  [RESOLUTION_REVIEW_STATUS_IDS.DISCARDED]: {
    label: 'Descartadas',
    color: '#dc2626',
  },
};

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const {
    assignedReports,
    assignedGroups,
    resolvedReports,
    metrics,
    isLoading,
    error,
    refresh,
  } = useOperatorReports();
  const specializations = useMemo(
    () =>
      (user?.specializations ?? [])
        .map((specialization) => specialization.label)
        .filter(Boolean),
    [user?.specializations]
  );
  const currentLoad = Number(metrics.currentActiveReports ?? 0);
  const maxLoad = Number(metrics.maxActiveReports ?? 0);
  const availableCapacity = Math.max(maxLoad - currentLoad, 0);
  const capacity = `${currentLoad}/${maxLoad}`;

  const assignmentData = [
    {
      id: 'reports',
      label: 'Reportes individuales',
      value: assignedReports.length,
      color: '#0f766e',
    },
    {
      id: 'groups',
      label: 'Grupos de reportes',
      value: assignedGroups.length,
      color: '#2563eb',
    },
  ].filter((item) => item.value > 0);

  const resolutionData = Object.entries(
    resolvedReports.reduce((summary, item) => {
      const statusId = Number(item.resolution?.reviewStatusId);
      summary[statusId] = (summary[statusId] ?? 0) + 1;
      return summary;
    }, {})
  ).map(([statusId, value]) => ({
    id: statusId,
    label: RESOLUTION_STATUS[statusId]?.label ?? 'Sin estado',
    value,
    color: RESOLUTION_STATUS[statusId]?.color ?? '#6b7280',
  }));

  const capacityData = maxLoad
    ? [
        {
          id: 'active',
          label: 'Carga actual',
          value: currentLoad,
          color: '#0f766e',
        },
        {
          id: 'available',
          label: 'Capacidad disponible',
          value: availableCapacity,
          color: '#94a3b8',
        },
      ]
    : [];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-12 sm:space-y-8">
      <ModuleHero
        icon={<Wrench />}
        title="Panel de operador"
        description="Consulta tu carga, tus asignaciones y el estado de las resoluciones."
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

      <OperatorSpecializations specializations={specializations} />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
        <MetricCard
          title="Asignaciones activas"
          value={isLoading ? '...' : metrics.activeAssignments ?? 0}
          icon={<ClipboardList className="size-4" />}
        />
        <MetricCard
          title="Resoluciones enviadas"
          value={isLoading ? '...' : metrics.submittedResolutions ?? 0}
          icon={<CheckCircle2 className="size-4" />}
        />
        <MetricCard
          title="Tasa de aprobación"
          value={isLoading ? '...' : `${metrics.approvalRate ?? 0}%`}
          icon={<Gauge className="size-4" />}
        />
        <MetricCard
          title="Carga actual"
          value={isLoading ? '...' : capacity}
          icon={<Activity className="size-4" />}
        />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-5 [&>*]:min-w-0">
        <DashboardDonutChart
          title="Asignaciones activas"
          description="Distribución entre reportes individuales y grupos."
          data={assignmentData}
          centerLabel="asignaciones"
          isLoading={isLoading}
        />
        <DashboardDonutChart
          title="Estado de resoluciones"
          description="Resultado actual de las resoluciones enviadas."
          data={resolutionData}
          centerLabel="resoluciones"
          isLoading={isLoading}
        />
      </div>

      <DashboardBarChart
        title="Capacidad operativa"
        description="Carga utilizada frente a la capacidad disponible."
        data={capacityData}
        isLoading={isLoading}
      />

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Accesos de trabajo
          </h2>
          <p className="text-sm text-muted-foreground">
            Continúa directamente con tus tareas pendientes.
          </p>
        </div>
        <DashboardQuickActions actions={OPERATOR_ACTIONS} />
      </div>
    </div>
  );
}
