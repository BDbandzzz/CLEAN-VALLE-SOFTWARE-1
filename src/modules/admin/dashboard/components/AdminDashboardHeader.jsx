import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { ModuleHero } from '@/core/components/ui/module-hero';

export function AdminDashboardHeader() {
  return (
    <ModuleHero
      icon={<ShieldCheck />}
      title="Panel administrador"
      description="Vista general de usuarios, reportes y catálogos operativos."
      actions={
        <>
          <Button asChild variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
            <Link to="/admin/users">Gestión de Usuarios</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-white/20 text-primary-foreground hover:bg-white/30">
            <Link to="/admin/report-types">Tipos de reportes</Link>
          </Button>
        </>
      }
    />
  );
}
