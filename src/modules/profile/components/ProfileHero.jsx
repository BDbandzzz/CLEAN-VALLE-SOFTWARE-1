import { Sparkles } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { getRoleDisplayName } from '@/core/lib/utils';

/**
 * Franja superior del perfil: avatar, rol, nombre y cierre de sesión.
 */
export function ProfileHero({ initials, displayName, userRole, onLogout }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl sm:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/15 text-3xl font-bold shadow-inner backdrop-blur-sm">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {displayName || 'Tu espacio en CleanValle'}
            </h1>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/85">
              Actualiza tus datos y mantén tu cuenta al día para reportes y notificaciones.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:justify-end">
          <Button
            variant="secondary"
            className="bg-white/20 text-primary-foreground hover:bg-white/30"
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </section>
  );
}
