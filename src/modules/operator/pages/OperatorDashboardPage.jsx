import { useMemo, useState } from 'react';
import { Bell, ClipboardList, CheckCircle2, Wrench } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { useAuth } from '@/core/context/AuthContext';
import { OPERATOR_SPECIALIZATIONS } from '@/core/data/cleanvalleSchema';
import { OperatorDashboardKpi } from '@/modules/operator/components/OperatorDashboardKpi';
import { OperatorDashboardTabButton } from '@/modules/operator/components/OperatorDashboardTabButton';
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
    () =>
      (user?.specializationIds ?? [])
        .map((id) => OPERATOR_SPECIALIZATIONS.find((item) => item.id === id)?.label)
        .filter(Boolean),
    [user?.specializationIds]
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
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15">
              <Wrench className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Panel de operador</h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Gestiona tus reportes asignados y resoluciones enviadas.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            {specializations.length ? specializations.join(' · ') : 'Sin especialidad asignada'}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <OperatorDashboardKpi title="Asignados" value={operatorAssignedReports.length} icon={<ClipboardList className="size-4" />} />
        <OperatorDashboardKpi title="Resoluciones" value={operatorResolvedReports.length} icon={<CheckCircle2 className="size-4" />} />
        <OperatorDashboardKpi title="Notificaciones" value={notifications.length} icon={<Bell className="size-4" />} />
      </div>

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <OperatorDashboardTabButton label="Asignados" active={activeTab === TABS.assigned} onClick={() => setActiveTab(TABS.assigned)} />
        <OperatorDashboardTabButton label="Resoluciones" active={activeTab === TABS.resolved} onClick={() => setActiveTab(TABS.resolved)} />
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
