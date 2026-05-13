import { useState } from 'react';
import { MapPin } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

const OperativePage = () => {
  const [assignedReports] = useState([
    { id: 1, title: 'Basura en Calle 5', location: 'Calle 5, Zona Centro', status: 'Pendiente', priority: 'Alta' },
    { id: 2, title: 'Bache en Avenida', location: 'Avenida Principal', status: 'En proceso', priority: 'Media' },
    { id: 3, title: 'Limpieza de parque', location: 'Parque Central', status: 'Pendiente', priority: 'Media' },
  ]);

  const statusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-500/15 text-amber-800 border-amber-500/30';
      case 'En proceso':
        return 'bg-sky-500/15 text-sky-900 border-sky-500/30';
      case 'Completado':
        return 'bg-primary/15 text-primary border-primary/25';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const priorityClass = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'text-red-600 font-semibold';
      case 'Media':
        return 'text-amber-600 font-medium';
      case 'Baja':
        return 'text-primary font-medium';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Operativo</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Mis tareas asignadas</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Reportes que te corresponden resolver en campo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total asignados', value: '3' },
          { label: 'En proceso', value: '1', tone: 'text-sky-600' },
          { label: 'Pendientes', value: '2', tone: 'text-amber-600' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-primary/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className={`text-3xl font-bold tabular-nums ${kpi.tone || ''}`}>{kpi.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-lg">Listado de tareas</CardTitle>
          <CardDescription>Ubicación, estado y prioridad.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Prioridad</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {assignedReports.map((report) => (
                <tr key={report.id} className="border-b border-border transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{report.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      {report.location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${priorityClass(report.priority)}`}>{report.priority}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary">
                      Hecho
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardContent className="border-t border-border bg-muted/20 py-3 text-center text-xs text-muted-foreground">
          Los datos son de demostración hasta conectar el backend.
        </CardContent>
      </Card>
    </div>
  );
};

export default OperativePage;
