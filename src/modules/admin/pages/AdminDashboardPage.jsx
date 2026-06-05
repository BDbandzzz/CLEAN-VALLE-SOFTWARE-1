import { AdminCategoryPanel } from '@/modules/admin/components/AdminCategoryPanel';
import { AdminDashboardHeader } from '@/modules/admin/components/AdminDashboardHeader';
import { AdminDistributionPanel } from '@/modules/admin/components/AdminDistributionPanel';
import { AdminMetricsGrid } from '@/modules/admin/components/AdminMetricsGrid';
import { AdminOperatorWorkload } from '@/modules/admin/components/AdminOperatorWorkload';
import { AdminRecentReports } from '@/modules/admin/components/AdminRecentReports';
import { useAdminDashboard } from '@/modules/admin/hooks/useAdminDashboard';

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <AdminDashboardHeader
        activeReports={dashboard.metrics.activeReports}
        pendingReviews={dashboard.metrics.pendingReviews}
      />

      <AdminMetricsGrid metrics={dashboard.metrics} />

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminDistributionPanel
          title="Usuarios por rol"
          description="Distribucion actual de cuentas activas."
          items={dashboard.roleDistribution}
          valueLabel="usuarios"
        />
        <AdminDistributionPanel
          title="Estados de reportes"
          description="Avance general de los casos registrados."
          items={dashboard.statusDistribution}
          valueLabel="reportes"
        />
        <AdminDistributionPanel
          title="Nivel de riesgo"
          description="Priorizacion de reportes segun impacto."
          items={dashboard.riskDistribution}
          valueLabel="reportes"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <AdminCategoryPanel categories={dashboard.categoryDistribution} />
        <AdminOperatorWorkload operators={dashboard.operatorWorkload} />
      </div>

      <AdminRecentReports reports={dashboard.recentReports} />
    </div>
  );
}
