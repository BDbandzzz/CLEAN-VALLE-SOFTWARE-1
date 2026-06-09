import { useMemo, useState } from 'react';
import { Bell, ClipboardList, CheckCircle2, Wrench } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { MetricCard } from '@/core/components/ui/metric-card';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { SegmentedTabButton } from '@/core/components/ui/segmented-tab-button';
import { useAuth } from '@/core/context/AuthContext';
import { OperatorReportList } from '@/modules/operator/components/OperatorReportList';
import { getResolutionReviewStatusOptions } from '@/modules/reports/constants/reportConstants';
import { useReports } from '@/modules/reports/context/ReportsContext';

const TABS = {
  assigned: 'assigned',
  resolved: 'resolved',
};

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const { operatorAssignedReports, operatorResolvedReports, notifications } = useReports();
  const [activeTab, setActiveTab] = useState(TABS.assigned);
  const [resolutionStatus, setResolutionStatus] = useState('enviada');
  const resolutionStatusOptions = getResolutionReviewStatusOptions();

  const specializations = useMemo(
    () => (user?.specializations ?? []).map((specialization) => specialization.label),
    [user?.specializations]
  );
  const filteredResolvedReports = useMemo(
    () =>
      operatorResolvedReports.filter((report) => {
        const reviewStatusId = report.resolution?.reviewStatusId ?? report.resolution?.statusId;
        return reviewStatusId === resolutionStatus;
      }),
    [operatorResolvedReports, resolutionStatus]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <ModuleHero
        icon={<Wrench />}
        title="Panel de operador"
        description="Gestiona tus reportes asignados y resoluciones enviadas."
        aside={
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            {specializations.length ? specializations.join(' · ') : 'Sin especialidad asignada'}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Asignados" value={operatorAssignedReports.length} icon={<ClipboardList className="size-4" />} />
        <MetricCard title="Resoluciones" value={operatorResolvedReports.length} icon={<CheckCircle2 className="size-4" />} />
        <MetricCard title="Notificaciones" value={notifications.length} icon={<Bell className="size-4" />} />
      </div>

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <SegmentedTabButton label="Asignados" active={activeTab === TABS.assigned} onClick={() => setActiveTab(TABS.assigned)} />
        <SegmentedTabButton label="Resoluciones" active={activeTab === TABS.resolved} onClick={() => setActiveTab(TABS.resolved)} />
      </div>

      {activeTab === TABS.assigned && (
        <OperatorReportList
          emptyText="No tienes reportes asignados."
          reports={operatorAssignedReports}
        />
      )}

      {activeTab === TABS.resolved && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {resolutionStatusOptions.map((status) => (
              <Button
                key={status.id}
                type="button"
                onClick={() => setResolutionStatus(status.id)}
                variant={resolutionStatus === status.id ? 'default' : 'outline'}
                className={[
                  'rounded-lg border px-4 py-2 text-sm font-semibold transition',
                  resolutionStatus === status.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                ].join(' ')}
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
