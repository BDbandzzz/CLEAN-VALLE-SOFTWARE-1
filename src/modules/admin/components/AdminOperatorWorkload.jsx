import { Wrench } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';

export function AdminOperatorWorkload({ operators }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de operadores</CardTitle>
        <CardDescription>Reportes asignados, resueltos y especialidades registradas.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {!operators.length && (
          <EmptyState
            title="No hay operadores activos"
            description="Cuando se registren operadores, apareceran en este panel."
            icon={<Wrench className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        {operators.map((operator) => (
          <div key={operator.id} className="grid gap-3 rounded-lg border border-border bg-background/80 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{operator.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{operator.specializations} especialidades</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted px-3 py-2">
                <p className="font-bold text-foreground">{operator.activeAssigned}</p>
                <p className="text-muted-foreground">Activos</p>
              </div>
              <div className="rounded-lg bg-muted px-3 py-2">
                <p className="font-bold text-foreground">{operator.resolved}</p>
                <p className="text-muted-foreground">Resueltos</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
