import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  RotateCcw,
  Send,
  Wrench,
} from 'lucide-react';

import { FormField } from '@/core/components/forms/FormField';
import { TextareaField } from '@/core/components/forms/TextareaField';
import { formControlClass } from '@/core/components/forms/formStyles';
import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { ImageFileUpload } from '@/core/components/ui/image-file-upload';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { RESOLUTION_REVIEW_STATUS_IDS } from '@/core/constants/domainConstants';
import { useOperatorReports } from '@/modules/operator/hooks/useOperatorReports';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from '@/core/services/alertService';

const INITIAL_FORM = {
  description: '',
  method: '',
  resolvedAt: new Date().toISOString().slice(0, 10),
};

export default function OperatorResolutionPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const {
    assignedReports,
    resolvedReports,
    isLoading,
    error: loadError,
    submitResolution,
  } = useOperatorReports();
  const report = useMemo(
    () =>
      [...assignedReports, ...resolvedReports].find(
        (item) => String(item.id) === String(reportId)
      ),
    [assignedReports, reportId, resolvedReports]
  );
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmResolution, setConfirmResolution] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit =
    !report?.resolution ||
    Number(report.resolution.reviewStatusId) ===
      RESOLUTION_REVIEW_STATUS_IDS.DISCARDED;

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setImages([]);
    setError('');
    setSuccess('');
  };

  const requestResolution = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.description.trim().length < 10) {
      const message = 'Describe la resolución con al menos 10 caracteres.';
      setError(message);
      showWarningAlert(message);
      return;
    }
    if (form.method.trim().length < 3) {
      const message = 'Indica el método utilizado para resolver el reporte.';
      setError(message);
      showWarningAlert(message);
      return;
    }
    if (!form.resolvedAt) {
      const message = 'Selecciona la fecha de resolución.';
      setError(message);
      showWarningAlert(message);
      return;
    }

    setConfirmResolution(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      await submitResolution(report.id, { ...form, images });
      setConfirmResolution(false);
      setSuccess('Resolucion enviada correctamente para revision.');
      showSuccessAlert(ALERT_MESSAGES.reports.resolutionSent);
      setImages([]);
    } catch (submitError) {
      setError(submitError.message);
      showErrorAlert(submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Cargando reporte...</div>;
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pb-12">
        <Button variant="outline" onClick={() => navigate('/operator')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          {loadError || 'No encontramos un reporte asignado con ese identificador.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <Button variant="outline" onClick={() => navigate('/operator')}>
        <ArrowLeft className="size-4" />
        Volver al panel
      </Button>

      <ModuleHero
        icon={<Send />}
        title="Enviar resolucion"
        description="Registra las acciones realizadas y sus evidencias."
      />

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {!canSubmit && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          Esta resolucion ya fue enviada o aprobada y no admite un nuevo envio.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={requestResolution} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <FormField id="resolution-report-title" label="Titulo del reporte" icon={<FileText className="size-4" />}>
          <input
            id="resolution-report-title"
            readOnly
            value={report.title}
            className={formControlClass(false, 'cursor-default bg-muted/50')}
          />
        </FormField>

        <TextareaField
          id="resolution-description"
          label="Descripcion de la resolucion"
          required
          icon={<FileText className="size-4" />}
          rows={5}
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
          placeholder="Describe las acciones realizadas y el resultado obtenido."
          maxLength={1000}
        />

        <FormField id="resolution-method" label="Metodo de resolucion" required icon={<Wrench className="size-4" />}>
          <input
            id="resolution-method"
            value={form.method}
            onChange={(event) => setField('method', event.target.value)}
            placeholder="Ej. Sustitucion del componente afectado"
            maxLength={180}
            className={formControlClass()}
          />
        </FormField>

        <FormField id="resolution-date" label="Fecha de resolucion" required icon={<Calendar className="size-4" />}>
          <input
            id="resolution-date"
            type="date"
            value={form.resolvedAt}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setField('resolvedAt', event.target.value)}
            className={formControlClass()}
          />
        </FormField>

        <ImageFileUpload files={images} onChange={setImages} disabled={isSubmitting} />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || Boolean(success) || !canSubmit}
            className="px-6 py-2.5 text-sm"
          >
            <Send className="size-4" />
            Enviar resolucion
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            variant="outline"
            className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Limpiar
          </Button>
        </div>
      </form>

      <ConfirmationMessage
        open={confirmResolution}
        {...CONFIRMATION_MESSAGES.reports.submitResolution}
        isLoading={isSubmitting}
        onAccept={confirmSubmit}
        onReject={() => setConfirmResolution(false)}
      />
    </div>
  );
}
