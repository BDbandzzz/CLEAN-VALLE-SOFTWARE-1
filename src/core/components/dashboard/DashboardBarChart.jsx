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
  const chartHeight = horizontal
    ? Math.min(720, Math.max(280, data.length * 46))
    : 280;
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
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="break-words leading-snug">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent
        className="min-w-0 overflow-hidden px-3 sm:px-5"
        style={{ height: chartHeight }}
      >
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
                  ticks: {
                    precision: 0,
                    autoSkip: true,
                    maxRotation: horizontal ? 0 : 35,
                    minRotation: 0,
                    font: { size: 11 },
                  },
                  grid: { color: 'rgba(107, 114, 128, 0.12)' },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                    autoSkip: false,
                    font: { size: 11 },
                    callback(value) {
                      const label = this.getLabelForValue(value);
                      return label.length > 22
                        ? `${label.slice(0, 20)}...`
                        : label;
                    },
                  },
                  grid: {
                    display: horizontal,
                    color: 'rgba(107, 114, 128, 0.12)',
                  },
                },
              },
              layout: {
                padding: {
                  left: horizontal ? 2 : 0,
                  right: 4,
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
