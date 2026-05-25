import { useState } from 'react';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { ReportFilters } from '@/modules/reports/components/ReportFilters';
import { ReportCard } from '@/modules/reports/components/ReportCard';
import { FileText } from 'lucide-react';

const EMPTY_FILTERS = {
  search: '',
  reportType: '',
  riskLevel: '',
  dateFrom: '',
  dateTo: '',
};

const GestorReportsPage = () => {
  const { reports } = useReports();
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Funciones de filtrado
  const handleFilterChange = (updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  const applyFilters = () => {
    return reports.filter((r) => {
      // Búsqueda por texto (título o localización)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const textMatch =
          r.title?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q);
        if (!textMatch) return false;
      }

      // Filtro por tipo
      if (filters.reportType && r.reportType !== filters.reportType) {
        return false;
      }

      // Filtro por riesgo
      if (filters.riskLevel && r.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Filtro por fecha (incidentDate)
      if (filters.dateFrom || filters.dateTo) {
        const rDate = r.incidentDate ? new Date(r.incidentDate) : null;
        if (!rDate) return false;

        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          if (rDate < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(`${filters.dateTo}T23:59:59`);
          if (rDate > to) return false;
        }
      }

      return true;
    });
  };

  const filteredReports = applyFilters();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestionar Reportes</h1>
        <p className="text-muted-foreground mt-2">
          Visualiza y filtra todos los reportes enviados por estudiantes y docentes.
        </p>
      </div>
      
      {/* Panel de Filtros */}
      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Lista de Reportes */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center bg-card shadow-sm">
            <div className="rounded-full bg-muted p-3 mb-3">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No se encontraron reportes</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Intenta ajustar los filtros o los términos de búsqueda para encontrar lo que necesitas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorReportsPage;
