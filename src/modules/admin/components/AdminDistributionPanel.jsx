import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';

export function AdminDistributionPanel({ title, description, items, valueLabel = 'registros' }) {
  return (
    <Card className="min-h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color ?? '#0f766e' }}
                />
                <span className="truncate font-medium text-foreground">{item.label}</span>
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {item.value} {valueLabel}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color ?? '#0f766e',
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
