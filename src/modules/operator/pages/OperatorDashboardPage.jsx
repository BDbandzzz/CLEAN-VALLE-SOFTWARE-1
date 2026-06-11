import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, ClipboardList, Wrench } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { MetricCard } from '@/core/components/ui/metric-card';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { useAuth } from '@/core/context/AuthContext';
import { OperatorReportList } from '@/modules/operator/components/OperatorReportList';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { useReportCatalogs } from '@/modules/reports/hooks/useReportCatalogs';

const TABS = {
  assigned: 'assigned',
  resolved: 'resolved',
};

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const { unreadNotifications, refreshNotifications } = useReports();
  const { resolutionReviewStatuses } = useReportCatalogs();
  const {
    assignedReports,
    resolvedReports,
    isLoading,
    error,
  } = useOperatorReports();
  const [activeTab, setActiveTab] = useState(TABS.assigned);
  const [resolutionStatus, setResolutionStatus] = useState('');

  useEffect(() => {
    refreshNotifications().catch(() => {});
  }, [refreshNotifications]);

  const specializations = useMemo(
    () => (user?.specializations ?? []).map((specialization) => specialization.label),
    [user?.specializations]
  );
  const filteredResolvedReports = useMemo(
    () =>
      resolutionStatus
        ? resolvedReports.filter(
            (report) => String(report.resolution?.reviewStatusId) === resolutionStatus
          )
        : resolvedReports,
    [resolutionStatus, resolvedReports]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <ModuleHero
        icon={<Wrench />}
        title="Panel de operador"
        description="Gestiona tus reportes asignados y resoluciones enviadas."
        aside={
          <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm">
            {specializations.length ? specializations.join(' · ') : 'Sin especialidad asignada'}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Asignados" value={assignedReports.length} icon={<ClipboardList className="size-4" />} />
        <MetricCard title="Resoluciones" value={resolvedReports.length} icon={<CheckCircle2 className="size-4" />} />
        <MetricCard title="Notificaciones" value={unreadNotifications.length} icon={<Bell className="size-4" />} />
      </div>

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton label="Asignados" active={activeTab === TABS.assigned} onClick={() => setActiveTab(TABS.assigned)} />
        <SegmentedTabButton label="Resoluciones" active={activeTab === TABS.resolved} onClick={() => setActiveTab(TABS.resolved)} />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-14 text-center text-sm text-muted-foreground">Cargando asignaciones...</div>
      ) : activeTab === TABS.assigned ? (
        <OperatorReportList
          emptyText="No tienes reportes asignados."
          reports={assignedReports}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => setResolutionStatus('')}
              variant={!resolutionStatus ? 'default' : 'outline'}
            >
              Todas
            </Button>
            {resolutionReviewStatuses.map((status) => (
              <Button
                key={status.id}
                type="button"
                onClick={() => setResolutionStatus(status.id)}
                variant={resolutionStatus === status.id ? 'default' : 'outline'}
              >
                {status.label}
              </Button>
            ))}
          </div>
          <OperatorReportList
            emptyText="No hay resoluciones en esta clasificacion."
            reports={filteredResolvedReports}
            showResolution
          />
        </div>
      )}
    </div>
  );
}
