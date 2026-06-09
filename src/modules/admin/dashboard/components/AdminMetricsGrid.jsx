import { ClipboardList, Tags, Users } from 'lucide-react';

import { MetricCard } from '@/core/components/ui/metric-card';

export function AdminMetricsGrid({ metrics, isLoading = false }) {
  const value = (metric) => (isLoading ? '...' : metric);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Usuarios activos" value={value(metrics.activeUsers)} icon={<Users className="size-4" />} />
      <MetricCard title="Reportes totales" value={value(metrics.totalReports)} icon={<ClipboardList className="size-4" />} />
      <MetricCard title="Categorías activas" value={value(metrics.activeCategories)} icon={<Tags className="size-4" />} />
      <MetricCard title="Subcategorías totales" value={value(metrics.totalSubcategories)} icon={<Tags className="size-4" />} />
    </div>
  );
}
