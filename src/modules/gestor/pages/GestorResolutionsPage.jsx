import React from 'react';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { ResolutionCard } from '../components/ResolutionCard';
import { ClipboardCheck } from 'lucide-react';

const GestorResolutionsPage = () => {
  const { getResolvedReports, evaluateResolution } = useReports();
  
  // Obtenemos los reportes que están en estado "resuelto" (esperando validación del gestor)
  const resolvedReports = getResolvedReports();

  const handleEvaluate = (reportId, isValid) => {
    evaluateResolution(reportId, isValid);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Resolución de Reporte</h1>
        <p className="text-muted-foreground mt-2">
          Evalúa las resoluciones subidas por los operadores para cerrarlos definitivamente o devolverlos.
        </p>
      </div>
      
      <div className="space-y-4">
        {resolvedReports.length > 0 ? (
          resolvedReports.map(report => (
            <ResolutionCard 
              key={report.id} 
              report={report} 
              onEvaluate={handleEvaluate} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center bg-card shadow-sm">
            <div className="rounded-full bg-muted p-3 mb-3">
              <ClipboardCheck className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No hay resoluciones pendientes</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Actualmente no hay reportes resueltos por operadores esperando validación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorResolutionsPage;
