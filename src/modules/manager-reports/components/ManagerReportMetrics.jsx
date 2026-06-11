import { ClipboardList } from 'lucide-react';

import { MetricCard } from '@/core/components/ui/metric-card';

export function ManagerReportMetrics({ dashboard }) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Reportes encontrados"
          value={dashboard.total ?? 0}
          icon={<ClipboardList className="size-4" />}
        />
        {(dashboard.byStatus ?? []).slice(0, 3).map((status) => (
          <MetricCard
            key={status.id}
            title={status.label}
            value={status.count}
            accentColor={status.color}
          />
        ))}
      </div>

      <div className="space-y-2 text-xs">
        <MetricPills label="Por categoria" items={dashboard.byCategory} />
        <MetricPills label="Por riesgo" items={dashboard.byRisk} />
      </div>
    </section>
  );
}

function MetricPills({ label, items = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-semibold text-muted-foreground">{label}</span>
      {items.map((item) => (
        <span
          key={item.id}
          className="rounded-full border px-3 py-1 font-semibold"
          style={{
            borderColor: `${item.color || '#6b7280'}55`,
            color: item.color || '#6b7280',
            backgroundColor: `${item.color || '#6b7280'}12`,
          }}
        >
          {item.label}: {item.count}
        </span>
      ))}
    </div>
  );
}
