import {
  AlertCircle,
  MapPinned,
  RefreshCw,
  Tags,
  Users,
  Wrench,
} from 'lucide-react';

import { DashboardBarChart } from '@/core/components/dashboard/DashboardBarChart';
import { DashboardDonutChart } from '@/core/components/dashboard/DashboardDonutChart';
import { DashboardQuickActions } from '@/core/components/dashboard/DashboardQuickActions';
import { Button } from '@/core/components/ui/button';
import { AdminDashboardHeader } from '@/modules/dashboard-admin/components/AdminDashboardHeader';
import { AdminMetricsGrid } from '@/modules/dashboard-admin/components/AdminMetricsGrid';
import { useAdminDashboard } from '@/modules/dashboard-admin/hooks/useAdminDashboard';

const ADMIN_ACTIONS = [
  {
    title: 'Gestionar usuarios',
    description: 'Crear, editar y desactivar cuentas.',
    to: '/admin/users',
    icon: Users,
  },
  {
    title: 'Tipos de reporte',
    description: 'Administrar categorias y razones.',
    to: '/admin/report-types',
    icon: Tags,
  },
  {
    title: 'Localizaciones',
    description: 'Configurar lugares y subareas.',
    to: '/admin/locations',
    icon: MapPinned,
  },
  {
    title: 'Especializaciones',
    description: 'Organizar capacidades de operadores.',
    to: '/admin/specializations',
    icon: Wrench,
  },
];

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-10 sm:space-y-8 sm:pb-12">
      <AdminDashboardHeader />

      {dashboard.error && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            No fue posible cargar las metricas: {dashboard.error}
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

      <div className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-5 [&>*]:min-w-0">
        <DashboardDonutChart
          title="Usuarios activos por rol"
          description="Distribucion de las cuentas habilitadas en el sistema."
          data={dashboard.roleDistribution}
          centerLabel="usuarios"
          isLoading={dashboard.isLoading}
        />
        <DashboardBarChart
          title="Composicion del sistema"
          description="Volumen actual de usuarios, reportes y catalogos."
          data={dashboard.systemDistribution}
          isLoading={dashboard.isLoading}
        />
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Accesos administrativos</h2>
          <p className="text-sm text-muted-foreground">
            Ingresa directamente al modulo que necesitas gestionar.
          </p>
        </div>
        <DashboardQuickActions actions={ADMIN_ACTIONS} />
      </div>
    </div>
  );
}
