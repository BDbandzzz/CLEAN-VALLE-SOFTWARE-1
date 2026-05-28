import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, RotateCcw, Send } from 'lucide-react';

import { FormField } from '@/core/components/forms/FormField';
import { TextareaField } from '@/core/components/forms/TextareaField';
import { useAuth } from '@/core/context/AuthContext';
import { Button } from '@/core/components/ui/button';
import { ImagePreviewGrid } from '@/modules/reports/components/ImagePreviewGrid';
import { ImageUploadZone } from '@/modules/reports/components/ImageUploadZone';
import { useImageUpload, MAX_FILES, MAX_MB } from '@/modules/reports/hooks/useImageUpload';
import { useReports } from '@/modules/reports/context/ReportsContext';

export default function OperatorResolutionPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allReports, submitResolution } = useReports();
  const report = useMemo(
    () => allReports.find((item) => item.id === reportId && String(item.assignedTo) === String(user?.id)),
    [allReports, reportId, user?.id]
  );
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {
    images, imgError, isDragging, slotsLeft,
    getRootProps, getInputProps,
    removeImage, clearImages,
  } = useImageUpload();

  const handleReset = () => {
    setDescription('');
    setError('');
    setSuccess('');
    clearImages();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (description.trim().length < 10) {
      setError('Describe la resolucion con al menos 10 caracteres.');
      return;
    }

    const updatedReport = submitResolution(report.id, {
      description,
      evidences: images.map((image) => image.previewUrl),
    }, user.id);

    if (!updatedReport) {
      setError('No se pudo enviar la resolucion.');
      return;
    }

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

      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-8 text-primary-foreground shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Enviar resolucion</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">
          Registra las acciones realizadas para resolver el reporte asignado.
        </p>
      </section>

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
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

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            Evidencia fotografica
            <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>
          </label>
          {slotsLeft > 0 && (
            <ImageUploadZone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragging={isDragging}
              slotsLeft={slotsLeft}
              maxFiles={MAX_FILES}
              maxMb={MAX_MB}
            />
          )}
          {imgError && <p className="text-xs text-destructive">{imgError}</p>}
          <ImagePreviewGrid
            images={images}
            slotsLeft={slotsLeft}
            onRemove={removeImage}
            onAddMore={() => getRootProps().onClick?.()}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Send className="size-4" />
            Enviar resolucion
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
