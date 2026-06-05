import { Tags } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

export function AdminCategoryPanel({ categories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de reporte</CardTitle>
        <CardDescription>Carga actual por tipo y cantidad de razones disponibles.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-lg border border-border bg-background/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{category.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{category.subtypes} razones activas</p>
              </div>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Tags className="size-4" style={{ color: category.color }} />
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{category.value} reportes</span>
              <span>{category.percentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
