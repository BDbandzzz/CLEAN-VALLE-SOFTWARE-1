import { CheckCircle2, FileSearch } from 'lucide-react';

import { EmptyState } from '@/core/components/ui/empty-state';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { ReportCard } from '@/modules/reports/components/ReportCard';
import { useReports } from '@/modules/reports/context/ReportsContext';

export default function ResolvedReportsPage() {
  const { resolvedReports, isLoading, error } = useReports();

  return (
    <main className="min-h-screen bg-muted/30 px-5 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <ModuleHero
          icon={<CheckCircle2 />}
          title="Reportes Resueltos"
          description="Consulta incidentes atendidos y las soluciones aprobadas."
        />

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Cargando reportes resueltos...
            </div>
          ) : resolvedReports.length ? (
            resolvedReports.map((report) => (
              <ReportCard key={report.id} report={report} showResolutionSummary />
            ))
          ) : (
            <EmptyState
              icon={<FileSearch className="mx-auto size-12 text-muted-foreground/50" />}
              title="Aun no hay reportes resueltos"
            />
          )}
        </div>
      </div>
    </main>
  );
}
