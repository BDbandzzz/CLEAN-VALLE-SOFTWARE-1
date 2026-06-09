import { AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { AdminDashboardHeader } from '@/modules/admin/dashboard/components/AdminDashboardHeader';
import { AdminDistributionPanel } from '@/modules/admin/dashboard/components/AdminDistributionPanel';
import { AdminMetricsGrid } from '@/modules/admin/dashboard/components/AdminMetricsGrid';
import { useAdminDashboard } from '@/modules/admin/dashboard/hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <AdminDashboardHeader />

      {dashboard.error && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            No fue posible cargar las métricas: {dashboard.error}
          </p>
          <Button type="button" variant="outline" onClick={dashboard.reload}>
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
        </div>
      )}

      <AdminMetricsGrid
        metrics={dashboard.metrics}
        isLoading={dashboard.isLoading}
      />

      <AdminDistributionPanel
        title="Usuarios por rol"
        description="Distribución actual de cuentas activas."
        items={dashboard.roleDistribution}
        valueLabel="usuarios"
        isLoading={dashboard.isLoading}
      />
    </div>
  );
}
