import { useState } from 'react';
import { CheckCircle2, ClipboardPlus } from 'lucide-react';

import { ModuleHero } from '@/core/components/ui/module-hero';
import { useReports } from '../context/ReportsContext';
import { CreateReportForm } from '../components/CreateReportForm';
import { useReportCatalogs } from '../hooks/useReportCatalogs';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';

const CreateReportPage = () => {
  const { addReport } = useReports();
  const catalogs = useReportCatalogs();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const createdReport = await addReport(formData);
      if (createdReport) {
        setSuccessMessage('Reporte enviado exitosamente. El equipo operativo lo revisara pronto.');
        showSuccessAlert(ALERT_MESSAGES.reports.created);
      }
      return createdReport;
    } catch (error) {
      setErrorMessage(error.message);
      showErrorAlert(error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <ModuleHero
        icon={<ClipboardPlus />}
        title="Crear Reporte"
        description="Documenta un incidente o una situación relevante dentro del campus."
      />

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Informacion del reporte</h2>
        <CreateReportForm
          categories={catalogs.categories}
          riskLevels={catalogs.riskLevels}
          localizations={catalogs.localizations}
          subtypesByCategory={catalogs.subtypesByCategory}
          subareasByLocalization={catalogs.subareasByLocalization}
          isLoadingCatalogs={catalogs.isLoading}
          loadingSubtypes={catalogs.loadingSubtypes}
          loadingSubareas={catalogs.loadingSubareas}
          catalogError={catalogs.error}
          onCategorySelect={catalogs.loadSubtypes}
          onLocalizationSelect={catalogs.loadSubareas}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateReportPage;
