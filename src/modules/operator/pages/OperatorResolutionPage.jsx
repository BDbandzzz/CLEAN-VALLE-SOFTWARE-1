import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, RotateCcw, Send } from 'lucide-react';

import { FormField } from '@/core/components/forms/FormField';
import { TextareaField } from '@/core/components/forms/TextareaField';
import { useAuth } from '@/core/context/AuthContext';
import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { ImageFileUpload } from '@/core/components/ui/image-file-upload';
import { ModuleHero } from '@/core/components/ui/module-hero';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useReports } from '@/modules/reports/context/ReportsContext';

export default function OperatorResolutionPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allReports, submitResolution } = useReports();
  const report = allReports.find(
    (item) =>
      item.id === reportId &&
      String(item.assignedTo) === String(user?.id)
  );
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState([]);
  const [confirmResolution, setConfirmResolution] = useState(false);

  const handleReset = () => {
    setDescription('');
    setError('');
    setSuccess('');
    setImages([]);
  };

  const requestResolution = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (description.trim().length < 10) {
      setError('Describe la resolucion con al menos 10 caracteres.');
      return;
    }
    setConfirmResolution(true);
  };

  const confirmSubmit = () => {
    const updatedReport = submitResolution(report.id, {
      description,
      evidences: images.map((image) => URL.createObjectURL(image)),
    }, user.id);

    if (!updatedReport) {
      setError('No se pudo enviar la resolucion.');
      return;
    }

    setConfirmResolution(false);
    handleReset();
    setSuccess('Resolucion enviada correctamente.');
  };

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pb-12">
        <Button variant="outline" onClick={() => navigate('/operator')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          No encontramos un reporte asignado con ese identificador.
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
        description="Registra las acciones realizadas para resolver el reporte asignado."
      />

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={requestResolution} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <FormField id="resolution-report-title" label="Titulo del reporte" icon={<FileText className="size-4" />}>
          <input
            id="resolution-report-title"
            readOnly
            value={report.title}
            className="w-full cursor-default rounded-lg border border-input bg-muted/50 px-3.5 py-2.5 text-sm"
          />
        </FormField>

        <TextareaField
          id="resolution-description"
          label="Descripcion de la resolucion"
          required
          icon={<FileText className="size-4" />}
          error={error}
          rows={5}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (error) setError('');
          }}
          placeholder="Describe que se hizo, que materiales se usaron y si el problema quedo solucionado."
          showCounter={false}
        />

        <ImageFileUpload files={images} onChange={setImages} />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            className="px-6 py-2.5 text-sm"
          >
            <Send className="size-4" />
            Enviar resolucion
          </Button>
          <Button
            type="button"
            onClick={handleReset}
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
        onAccept={confirmSubmit}
        onReject={() => setConfirmResolution(false)}
      />
    </div>
  );
}
