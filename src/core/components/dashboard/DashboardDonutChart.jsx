import { Doughnut } from 'react-chartjs-2';

import '@/core/components/dashboard/chartRegistry';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';

export function DashboardDonutChart({
  title,
  description,
  data = [],
  centerLabel = 'Total',
  isLoading = false,
}) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || '#0f766e'),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 5,
      },
    ],
  };

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="break-words leading-snug">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="min-w-0 px-3 sm:px-5">
        {isLoading ? (
          <div className="h-[280px]">
            <ChartMessage>Cargando datos...</ChartMessage>
          </div>
        ) : data.length ? (
          <div className="space-y-4">
            <div className="relative mx-auto h-[220px] w-full max-w-[320px] sm:h-[240px]">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '64%',
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.raw}`,
                      },
                    },
                  },
                }}
              />
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{total}</p>
                <p className="text-xs text-muted-foreground">{centerLabel}</p>
              </div>
            </div>
            <div className="grid gap-x-4 gap-y-2 pb-1 sm:grid-cols-2">
              {data.map((item) => (
                <div key={item.id} className="flex min-w-0 items-center justify-between gap-3 text-xs">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color || '#0f766e' }}
                    />
                    <span className="truncate text-muted-foreground" title={item.label}>
                      {item.label}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[280px]">
            <ChartMessage>No hay datos disponibles.</ChartMessage>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartMessage({ children }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
