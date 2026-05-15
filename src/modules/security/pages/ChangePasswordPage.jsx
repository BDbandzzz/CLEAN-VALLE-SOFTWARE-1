import { ShieldCheck } from 'lucide-react';
import { ChangePasswordForm } from '@/modules/security/components/ChangePasswordForm';

/**
 * Página de cambio de contraseña, accesible desde el sidebar.
 */
const ChangePasswordPage = () => {
  return (
    <div className="mx-auto max-w-xl space-y-8 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cambiar Contraseña</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Mantén tu cuenta segura actualizando tu contraseña regularmente.
            </p>
          </div>
        </div>
      </section>

      {/* Card del formulario */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Nueva contraseña</h2>
          <p className="text-sm text-muted-foreground">
            La contraseña debe tener al menos 8 caracteres y ser diferente a la actual.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
