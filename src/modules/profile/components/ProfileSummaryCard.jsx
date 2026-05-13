import { Shield } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

/**
 * Columna izquierda: datos rápidos (identificador, correo en resumen).
 */
export function ProfileSummaryCard({ dniUser, emailPreview }) {
  return (
    <Card className="h-fit border-primary/15 bg-gradient-to-br from-card to-emerald-50/40 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="size-4 text-primary" aria-hidden />
          Resumen
        </CardTitle>
        <CardDescription>Tu rol y datos clave</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border bg-background/80 p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">Identificador</p>
          <p className="mt-1 font-mono text-sm font-semibold text-foreground">{dniUser || '—'}</p>
        </div>
        <div className="rounded-xl border border-border bg-background/80 p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">Correo</p>
          <p className="mt-1 truncate text-sm text-foreground">{emailPreview || 'Sin registrar'}</p>
        </div>
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
          Los cambios se guardan en este dispositivo (demo local). Conecta una API para sincronizar en la nube.
        </div>
      </CardContent>
    </Card>
  );
}
