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
    <Card className="min-h-[360px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[270px]">
        {isLoading ? (
          <ChartMessage>Cargando datos...</ChartMessage>
        ) : data.length ? (
          <div className="relative h-full">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '64%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                      boxWidth: 8,
                      padding: 14,
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.label}: ${context.raw}`,
                    },
                  },
                },
              }}
            />
            <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-3xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">{centerLabel}</p>
            </div>
          </div>
        ) : (
          <ChartMessage>No hay datos disponibles.</ChartMessage>
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
