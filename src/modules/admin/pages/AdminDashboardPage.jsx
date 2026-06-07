import { AdminCategoryPanel } from '@/modules/admin/components/AdminCategoryPanel';
import { AdminDashboardHeader } from '@/modules/admin/components/AdminDashboardHeader';
import { AdminDistributionPanel } from '@/modules/admin/components/AdminDistributionPanel';
import { AdminMetricsGrid } from '@/modules/admin/components/AdminMetricsGrid';
import { AdminRecentReports } from '@/modules/admin/components/AdminRecentReports';
import { useAdminDashboard } from '@/modules/admin/hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <AdminDashboardHeader />

      <AdminMetricsGrid metrics={dashboard.metrics} />

      <div className="grid items-start gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminDistributionPanel
          title="Usuarios por rol"
          description="Distribucion actual de cuentas activas."
          items={dashboard.roleDistribution}
          valueLabel="usuarios"
        />
        <AdminCategoryPanel categories={dashboard.categoryDistribution} />
      </div>

      <AdminRecentReports reports={dashboard.recentReports} />
    </div>
  );
}
