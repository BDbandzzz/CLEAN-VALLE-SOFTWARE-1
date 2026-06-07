import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ModuleHero } from '@/core/components/ui/module-hero';

export function AdminDashboardHeader({ activeReports, pendingReviews }) {
  return (
    <ModuleHero
      icon={<ShieldCheck />}
      title="Panel administrador"
      description="Vista general de usuarios, reportes y catalogos operativos."
      actions={
        <Button asChild variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
          <Link to="/admin/users">Gestión de Usuarios</Link>
        </Button>
      }
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
