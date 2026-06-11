import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';

export function ManagerReportTable({ reports, isLoading }) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Cargando reportes...</div>;
  }

  if (!reports.length) {
    return <EmptyState title="No hay reportes que coincidan con los filtros." />;
  }

  return (
    <div className="overflow-x-auto border-y border-border bg-card">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Titulo</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Razon</th>
            <th className="px-4 py-3">Riesgo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Creado</th>
            <th className="w-12 px-4 py-3"><span className="sr-only">Abrir</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => (
            <tr key={report.id} className="transition hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">#{report.id}</td>
              <td className="max-w-64 px-4 py-3 font-semibold text-foreground">
                <span className="line-clamp-2">{report.title}</span>
              </td>
              <td className="px-4 py-3">
                <ReportBadge
                  type="category"
                  label={report.categoryName}
                  color={report.categoryColor}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{report.subtypeName}</td>
              <td className="px-4 py-3">
                <ReportBadge
                  type="risk"
                  label={report.riskLevelName}
                  color={report.riskLevelColor}
                />
              </td>
              <td className="px-4 py-3">
                <ReportStatusPill
                  meta={{
                    id: report.statusId,
                    label: report.statusName,
                    color: report.statusColor,
                  }}
                />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(report.createdAt)}</td>
              <td className="px-4 py-3">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="Abrir reporte"
                  onClick={() => navigate(`/manager/reports/${report.id}`)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
