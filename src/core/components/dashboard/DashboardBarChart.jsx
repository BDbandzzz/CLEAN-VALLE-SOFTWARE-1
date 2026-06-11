import { Bar } from 'react-chartjs-2';

import '@/core/components/dashboard/chartRegistry';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';

export function DashboardBarChart({
  title,
  description,
  data = [],
  layout = 'horizontal',
  isLoading = false,
}) {
  const horizontal = layout === 'vertical';
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Cantidad',
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || '#0f766e'),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 54,
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
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: horizontal ? 'y' : 'x',
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => `Cantidad: ${context.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: { precision: 0 },
                  grid: { color: 'rgba(107, 114, 128, 0.12)' },
                },
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 },
                  grid: {
                    display: horizontal,
                    color: 'rgba(107, 114, 128, 0.12)',
                  },
                },
              },
            }}
          />
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
