import { Shield, ClipboardList } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

const reports = [];

const AdminPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Administracion</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Panel de administracion</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Gestiona reportes y asigna tareas al equipo operativo.</p>
        </div>
        <div className="flex gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          <Shield className="size-5 shrink-0 text-primary" />
          Vista general del sistema
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total', value: '0', hint: 'historico' },
          { label: 'Pendientes', value: '0', hint: 'por asignar', tone: 'text-amber-600' },
          { label: 'En proceso', value: '0', hint: 'activos', tone: 'text-sky-600' },
          { label: 'Completados', value: '0', hint: 'cerrados', tone: 'text-primary' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-primary/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className={`text-3xl font-bold tabular-nums ${kpi.tone || ''}`}>{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="size-5 text-primary" />
            Reportes por asignar
          </CardTitle>
          <CardDescription>Prioriza y envia al equipo operativo.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          {reports.length ? (
            <ul className="divide-y divide-border">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-semibold text-foreground">{report.title}</p>
                    <p className="text-sm text-muted-foreground">Por: {report.author}</p>
                    <p className="text-xs text-muted-foreground">
                      Asignado: <span className="font-medium text-foreground">{report.assignedTo || 'Sin asignar'}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                      {report.status}
                    </span>
                    <Button size="sm">Asignar</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No hay reportes por asignar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
