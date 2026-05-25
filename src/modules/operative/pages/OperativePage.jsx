import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, CheckCircle2, Wrench, Loader2 } from 'lucide-react';

import { useAuth } from '@/core/context/AuthContext';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { ReportCard } from '@/modules/reports/components/ReportCard';
import { Button } from '@/core/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

const OperativePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAssignedReportsToOperator, getResolvedReportsByOperator } = useReports();

  const [activeTab, setActiveTab] = useState('asignados');

  const assignedReports = useMemo(
    () => getAssignedReportsToOperator(user?.id),
    [getAssignedReportsToOperator, user?.id]
  );

  const resolvedReports = useMemo(
    () => getResolvedReportsByOperator(user?.id),
    [getResolvedReportsByOperator, user?.id]
  );

  const displayedReports = activeTab === 'asignados' ? assignedReports : resolvedReports;

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl border border-sky-600/20 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <HardHat className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Panel Operativo</h1>
            <p className="mt-1 text-sm text-sky-100/80">
              Gestiona tus tareas asignadas y envía resoluciones en campo.
            </p>
          </div>
        </div>
      </section>

      {/* KPIs Rápidos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-sky-600/10 shadow-sm">
          <CardHeader className="pb-4">
            <CardDescription className="flex items-center gap-2">
              <Loader2 className="size-4 text-sky-600" />
              Tareas Pendientes
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums text-sky-700">{assignedReports.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-600/10 shadow-sm">
          <CardHeader className="pb-4">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              Tareas Resueltas
            </CardDescription>
            <CardTitle className="text-3xl font-bold tabular-nums text-green-700">{resolvedReports.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
        <TabButton
          id="tab-asignados"
          label="Reportes Asignados"
          count={assignedReports.length}
          isActive={activeTab === 'asignados'}
          onClick={() => setActiveTab('asignados')}
        />
        <TabButton
          id="tab-resueltos"
          label="Mis Resoluciones"
          count={resolvedReports.length}
          isActive={activeTab === 'resueltos'}
          onClick={() => setActiveTab('resueltos')}
        />
      </div>

      {/* Lista de reportes */}
      <div className="space-y-4">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              actionButton={
                activeTab === 'asignados' ? (
                  <Button 
                    onClick={() => navigate(`/operative/resolve/${report.id}`)}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Wrench className="size-4" />
                    Enviar Resolución
                  </Button>
                ) : null
              }
            />
          ))
        ) : (
          <EmptyState activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

function TabButton({ id, label, count, isActive, onClick }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
        isActive
          ? 'bg-card text-foreground shadow-sm border border-border'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
      ].join(' ')}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{label}</span>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            isActive ? 'bg-sky-100 text-sky-700' : 'bg-muted text-muted-foreground',
          ].join(' ')}
        >
          {count}
        </span>
      </div>
    </button>
  );
}

function EmptyState({ activeTab }) {
  const isAssigned = activeTab === 'asignados';
  const Icon = isAssigned ? Wrench : CheckCircle2;
  
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center bg-muted/10">
      <Icon className="size-12 text-muted-foreground/40" />
      <p className="mt-4 text-base font-medium text-muted-foreground">
        {isAssigned ? 'No tienes tareas asignadas' : 'Aún no has resuelto ningún reporte'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground/70 max-w-sm">
        {isAssigned 
          ? 'El gestor te asignará reportes cuando haya incidentes que requieran tu atención.' 
          : 'Cuando completes una tarea y envíes su resolución, aparecerá en este historial.'}
      </p>
    </div>
  );
}

export default OperativePage;
