import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Wrench,
} from 'lucide-react';
import { useMemo } from 'react';

import { MetricCard } from '@/core/components/ui/metric-card';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { useAuth } from '@/core/context/AuthContext';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const { metrics, isLoading, error } = useOperatorReports();
  const specializations = useMemo(
    () =>
      (user?.specializations ?? []).map(
        (specialization) => specialization.label
      ),
    [user?.specializations]
  );
  const capacity = `${metrics.currentActiveReports ?? 0}/${metrics.maxActiveReports ?? 0}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <ModuleHero
        icon={<Wrench />}
        title="Panel de operador"
        description="Consulta tu carga actual y el resultado de tus resoluciones."
        aside={
          <div className="max-w-sm rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm">
            {specializations.length
              ? specializations.join(' · ')
              : 'Sin especialidad asignada'}
          </div>
        }
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
    </div>
  );
}
