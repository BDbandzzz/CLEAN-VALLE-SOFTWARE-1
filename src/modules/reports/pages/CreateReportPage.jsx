import { useState } from 'react';
import { CheckCircle2, ClipboardPlus } from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { useAuth } from '@/core/context/AuthContext';
import { CreateReportForm } from '../components/CreateReportForm';

/**
 * Página de creación de reportes para Estudiante y Docente.
 */
const CreateReportPage = () => {
  const { addReport } = useReports();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await new Promise((r) => setTimeout(r, 900)); // simula latencia
      addReport(formData, user?.id);
      setSuccessMessage('¡Reporte enviado exitosamente! El equipo operativo lo revisará pronto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-black/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/15 backdrop-blur-sm">
            <ClipboardPlus className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Crear Reporte</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Documenta un incidente ambiental o de seguridad en el campus.
            </p>
          </div>
        </div>
      </section>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Formulario */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Información del reporte</h2>
        <CreateReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateReportPage;
