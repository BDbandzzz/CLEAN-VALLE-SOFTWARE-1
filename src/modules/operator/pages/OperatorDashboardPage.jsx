import { useMemo, useState } from 'react';
import { Bell, ClipboardList, CheckCircle2, Wrench } from 'lucide-react';

import { useAuth } from '@/core/context/AuthContext';
import { OPERATOR_SPECIALIZATIONS } from '@/core/data/cleanvalleSchema';
import { OperatorReportCard } from '@/modules/operator/components/OperatorReportCard';
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
        <Kpi title="Asignados" value={operatorAssignedReports.length} icon={<ClipboardList className="size-4" />} />
        <Kpi title="Resoluciones" value={operatorResolvedReports.length} icon={<CheckCircle2 className="size-4" />} />
        <Kpi title="Notificaciones" value={notifications.length} icon={<Bell className="size-4" />} />
      </div>

      <div className="flex rounded-xl border border-border bg-muted/40 p-1">
        <TabButton label="Asignados" active={activeTab === TABS.assigned} onClick={() => setActiveTab(TABS.assigned)} />
        <TabButton label="Resoluciones" active={activeTab === TABS.resolved} onClick={() => setActiveTab(TABS.resolved)} />
      </div>

      {activeTab === TABS.assigned && (
        <ReportList
          emptyText="No tienes reportes asignados."
          reports={operatorAssignedReports}
        />
      )}

      {activeTab === TABS.resolved && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {resolutionStatusOptions.map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => setResolutionStatus(status.id)}
                className={[
                  'rounded-lg border px-4 py-2 text-sm font-semibold transition',
                  resolutionStatus === status.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {status.label}
              </button>
            ))}
          </div>
          <ReportList
            emptyText="No hay resoluciones en esta clasificacion."
            reports={filteredResolvedReports}
            showResolution
          />
        </div>
      )}
    </div>
  );
}

function ReportList({ reports, emptyText, showResolution = false }) {
  if (!reports.length) return <EmptyState text={emptyText} />;

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <OperatorReportCard key={report.id} report={report} showResolution={showResolution} />
      ))}
    </div>
  );
}

function Kpi({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition',
        active ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
