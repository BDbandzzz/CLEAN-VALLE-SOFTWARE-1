import { AlertTriangle, ClipboardList, Tags, UserCog, Users, Wrench } from 'lucide-react';

import { MetricCard } from '@/core/components/ui/metric-card';

export function AdminMetricsGrid({ metrics }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Usuarios activos" value={metrics.activeUsers} icon={<Users className="size-4" />} />
      <MetricCard title="Reportes totales" value={metrics.totalReports} icon={<ClipboardList className="size-4" />} />
      <MetricCard title="Tipos activos" value={metrics.reportTypes} icon={<Tags className="size-4" />} />
      <MetricCard title="Subtipos activos" value={metrics.reportSubtypes} icon={<Tags className="size-4" />} />
      <MetricCard title="Operadores" value={metrics.operators} icon={<Wrench className="size-4" />} />
      <MetricCard title="Sin asignar" value={metrics.unassignedReports} icon={<UserCog className="size-4" />} />
      <MetricCard title="Pendientes revision" value={metrics.pendingReviews} icon={<ClipboardList className="size-4" />} />
      <MetricCard title="Riesgo alto" value={metrics.highRiskReports} icon={<AlertTriangle className="size-4" />} />
    </div>
  );
}
