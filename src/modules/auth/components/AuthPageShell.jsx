import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';

export function AuthPageShell({
  backTo,
  backLabel,
  children,
  footer = 'Tu información está protegida durante todo el proceso.',
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-teal-50/40 px-4 py-14 sm:py-6">
      <Button
        variant="outline"
        asChild
        className="fixed left-4 top-4 z-20 border-primary/25 bg-background/95 text-primary shadow-sm hover:bg-primary/10 hover:text-primary sm:left-6 sm:top-6"
      >
        <Link to={backTo}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </Button>

      <div className="w-full max-w-md">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <header className="flex items-center gap-4 border-b border-border bg-muted/25 px-6 py-4">
            <img
              src={UNIVALLE_LOGO_SRC}
              alt={INSTITUTION_NAME}
              className="h-12 w-auto max-w-[150px] shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="text-xl font-bold text-foreground">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">
                Gestión de reportes ambientales
              </p>
            </div>
          </header>

          <div className="p-6 sm:p-8">{children}</div>
        </section>

        {footer && (
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            {footer}
          </p>
        )}
      </div>
    </main>
  );
}
