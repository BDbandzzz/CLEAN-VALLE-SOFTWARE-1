import { ShieldCheck } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';

export function AdminDashboardHeader() {
  return (
    <ModuleHero
      icon={<ShieldCheck />}
      title="Panel administrador"
      description="Vista general de usuarios, reportes y catalogos operativos."
    />
  );
}
