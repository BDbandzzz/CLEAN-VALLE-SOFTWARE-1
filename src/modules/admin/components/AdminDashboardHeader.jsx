import { ShieldCheck } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';

export function AdminDashboardHeader({ activeReports, pendingReviews }) {
  return (
    <ModuleHero
      icon={<ShieldCheck />}
      title="Panel administrador"
      description="Vista general de usuarios, reportes y catalogos operativos."
      aside={
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
            <p className="text-xs text-primary-foreground/70">Reportes activos</p>
            <p className="text-xl font-bold">{activeReports}</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
            <p className="text-xs text-primary-foreground/70">Por revisar</p>
            <p className="text-xl font-bold">{pendingReviews}</p>
          </div>
        </div>
      }
    />
  );
}
