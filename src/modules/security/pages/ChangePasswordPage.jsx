import { ShieldCheck } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { ChangePasswordForm } from '@/modules/security/components/ChangePasswordForm';

const ChangePasswordPage = () => {
  return (
    <div className="mx-auto max-w-xl space-y-8 pb-12">
      <ModuleHero
        icon={<ShieldCheck />}
        title="Cambiar contraseña"
        description="Mantén tu cuenta segura actualizando tu contraseña regularmente."
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Nueva contraseña
          </h2>
          <p className="text-sm text-muted-foreground">
            La contraseña debe tener al menos 8 caracteres.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
