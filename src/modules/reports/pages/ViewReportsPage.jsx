import { useMemo, useState } from 'react';
import { Eye, FileSearch } from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { ReportCard } from '../components/ReportCard';
import { ReportFilters } from '../components/ReportFilters';

const EMPTY_FILTERS = {
  search: '',
  reportType: '',
  riskLevel: '',
  dateFrom: '',
  dateTo: '',
};

function applyFilters(reports, filters) {
  return reports.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !r.title.toLowerCase().includes(q) &&
        !r.location.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.reportType && r.reportType !== filters.reportType) return false;
    if (filters.riskLevel && r.riskLevel !== filters.riskLevel) return false;
    if (filters.dateFrom && r.incidentDate < filters.dateFrom) return false;
    if (filters.dateTo && r.incidentDate > filters.dateTo) return false;
    return true;
  });
}

/**
 * Página de visualización de reportes para Estudiante y Docente.
 * Muestra los reportes propios y los resueltos públicamente.
 */
const ViewReportsPage = () => {
  const { reports, getResolvedReports } = useReports();

  const [activeTab, setActiveTab] = useState('mis-reportes'); // 'mis-reportes' | 'resueltos'
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const resolvedReports = useMemo(() => getResolvedReports(), [getResolvedReports]);

  const displayedReports = useMemo(() => {
    const base = activeTab === 'resueltos' ? resolvedReports : reports;
    return applyFilters(base, filters);
  }, [activeTab, reports, resolvedReports, filters]);

  const handleFilterChange = (partial) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <Eye className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mis Reportes</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Consulta el estado de tus reportes y los resueltos por operadores.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
        <TabButton
          id="tab-mis-reportes"
          label="Mis reportes"
          count={reports.length}
          isActive={activeTab === 'mis-reportes'}
          onClick={() => setActiveTab('mis-reportes')}
        />
        <TabButton
          id="tab-resueltos"
          label="Resueltos por operadores"
          count={resolvedReports.length}
          isActive={activeTab === 'resueltos'}
          onClick={() => setActiveTab('resueltos')}
        />
      </div>

      {/* Filtros */}
      <ReportFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Lista de reportes */}
      <div className="space-y-4">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

function TabButton({ id, label, count, isActive, onClick }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
        isActive
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      ].join(' ')}
    >
      {label}
      <span
        className={[
          'ml-2 rounded-full px-2 py-0.5 text-xs font-semibold',
          isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <FileSearch className="size-12 text-muted-foreground/50" />
      <p className="mt-4 text-base font-medium text-muted-foreground">
        No se encontraron reportes
      </p>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Prueba ajustando los filtros o crea un nuevo reporte.
      </p>
    </div>
  );
}

export default ViewReportsPage;
