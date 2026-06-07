import { useState } from 'react';
import { CheckCircle2, ClipboardPlus } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { useAuth } from '@/core/context/AuthContext';
import { useReports } from '../context/ReportsContext';
import { CreateReportForm } from '../components/CreateReportForm';

const CreateReportPage = () => {
  const { addReport } = useReports();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const createdReport = await addReport(formData, user?.id);
      if (createdReport) {
        setSuccessMessage('Reporte enviado exitosamente. El equipo operativo lo revisara pronto.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <ModuleHero
        icon={<ClipboardPlus />}
        title="Crear Reporte"
        description="Documenta un incidente ambiental o de seguridad en el campus."
      />

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Informacion del reporte</h2>
        <CreateReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateReportPage;
