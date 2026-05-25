import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Wrench, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useReports } from '@/modules/reports/context/ReportsContext';
import { ResolveReportForm } from '../components/ResolveReportForm';
import { Button } from '@/core/components/ui/button';
import { ReportCard } from '@/modules/reports/components/ReportCard';

const ResolveReportPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { reports, submitResolution } = useReports();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Encontrar el reporte en el contexto
  const report = useMemo(() => {
    return reports.find(r => r.id === parseInt(reportId));
  }, [reports, reportId]);

  const handleSubmit = async (resolutionData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula latencia
      
      const success = await submitResolution(parseInt(reportId), resolutionData);
      
      if (success) {
        setSuccessMessage('¡Resolución enviada exitosamente!');
        // Redirigir al panel después de 1.5s
        setTimeout(() => {
          navigate('/operative');
        }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 pb-12 pt-8 text-center">
        <h2 className="text-xl font-bold">Reporte no encontrado</h2>
        <Button onClick={() => navigate('/operative')}>Volver al panel</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Botón volver */}
      <div className="flex justify-start">
        <Button
          variant="ghost"
          onClick={() => navigate('/operative')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver al panel
        </Button>
      </div>

      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl border border-sky-600/20 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <Wrench className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Enviar Resolución</h1>
            <p className="mt-1 text-sm text-sky-100/80">
              Documenta las acciones realizadas para resolver el incidente.
            </p>
          </div>
        </div>
      </section>

      {/* Resumen del reporte a resolver */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Reporte asignado</h2>
        <ReportCard report={report} />
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Detalles de la resolución</h2>
        <ResolveReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting || !!successMessage} />
      </div>
    </div>
  );
};

export default ResolveReportPage;
