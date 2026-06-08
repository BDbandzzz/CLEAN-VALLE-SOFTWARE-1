import { Clock } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';
import { getStatusMeta } from '@/modules/reports/constants/reportConstants';

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function AdminRecentReports({ reports }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes recientes</CardTitle>
        <CardDescription>Ultimos casos registrados en el sistema.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {!reports.length && (
          <EmptyState
            title="No hay reportes registrados"
            description="Los reportes apareceran aqui cuando los usuarios los creen."
            icon={<Clock className="mx-auto size-8 text-muted-foreground" />}
          />
        )}

        {reports.map((report) => (
          <div key={report.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{report.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatLocation(report)} · {formatDate(report.createdAt)}
              </p>
            </div>
            <ReportStatusPill meta={getStatusMeta(report.statusId)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function formatLocation(report) {
  return [report.localizationName, report.subareaName].filter(Boolean).join(' - ') || 'Sin ubicacion';
}
