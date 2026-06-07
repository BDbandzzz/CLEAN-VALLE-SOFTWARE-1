import { Button } from '@/core/components/ui/button';
import { ModuleHero } from '@/core/components/ui/module-hero';

export function ProfileHero({ initials, displayName, onLogout }) {
  return (
    <ModuleHero
      size="large"
      title={displayName || 'Tu espacio en CleanValle'}
      description="Actualiza tus datos y mantén tu cuenta al día para reportes y notificaciones."
      visual={
        <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-2 border-white/30 bg-white/15 text-3xl font-bold shadow-inner backdrop-blur-sm">
          {initials}
        </div>
      }
      actions={
        <Button
          variant="secondary"
          className="bg-white/20 text-primary-foreground hover:bg-white/30"
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>
      }
    />
  );
}
