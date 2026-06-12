import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ReportBadge } from '@/modules/reports/components/ReportBadge';
import { ReportStatusPill } from '@/modules/reports/components/ReportStatusPill';

export function ManagerReportTable({
  reports,
  isLoading,
  selectedIds = [],
  selectedCategoryId = '',
  groupableReportIds = null,
  onToggleSelection,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Cargando reportes...</div>;
  }

  if (!reports.length) {
    return <EmptyState title="No hay reportes que coincidan con los filtros." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-card shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            {onToggleSelection && (
              <th className="w-12 px-4 py-3">
                <span className="sr-only">Seleccionar</span>
              </th>
            )}
            <th className="px-4 py-3">Titulo</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Razon</th>
            <th className="px-4 py-3">Riesgo</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Creado</th>
            <th className="w-32 px-4 py-3"><span className="sr-only">Gestionar</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => {
            const disabledSelection =
              !groupableReportIds?.has(String(report.id)) ||
              (selectedCategoryId &&
                String(report.categoryId) !== String(selectedCategoryId) &&
                !selectedIds.includes(report.id));

            return (
            <tr key={report.id} className="transition hover:bg-muted/30">
              {onToggleSelection && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(report.id)}
                    disabled={disabledSelection}
                    onChange={() => onToggleSelection(report)}
                    aria-label={`Seleccionar ${report.title}`}
                    title={
                      groupableReportIds?.has(String(report.id))
                        ? 'Seleccionar reporte'
                        : 'Este reporte no está disponible para agrupar'
                    }
                    className="size-4 rounded border-input accent-primary"
                  />
                </td>
              )}
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
                  size="sm"
                  variant="outline"
                  title="Gestionar reporte"
                  onClick={() => navigate(`/manager/reports/${report.id}`)}
                >
                  Gestionar
                  <ChevronRight className="size-4" />
                </Button>
              </td>
            </tr>
          )})}
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
