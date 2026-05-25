import { useState } from 'react';
import {
  Send, RotateCcw, Calendar, FileText, ImagePlus, AlertCircle
} from 'lucide-react';
import { useImageUpload, MAX_FILES, MAX_MB } from '@/modules/reports/hooks/useImageUpload';
import { ImageUploadZone } from '@/modules/reports/components/ImageUploadZone';
import { ImagePreviewGrid } from '@/modules/reports/components/ImagePreviewGrid';

export function ResolveReportForm({ onSubmit, isSubmitting }) {
  const [description, setDescription] = useState('');
  const [resolutionDate, setResolutionDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  const {
    images, imgError, isDragging, slotsLeft,
    getRootProps, getInputProps,
    removeImage, clearImages,
  } = useImageUpload();

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'La descripción es obligatoria.';
    if (!resolutionDate) newErrors.resolutionDate = 'La fecha de resolución es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // images.map(i => i.file) -> We pass the actual files. 
      // For mocking, we could create ObjectURLs or just pass the files.
      // We pass the preview urls so they can be shown in the UI immediately without backend.
      const imagePreviews = images.map(i => i.preview);
      
      onSubmit({
        description,
        date: resolutionDate,
        images: imagePreviews
      });
    }
  };

  const handleReset = () => {
    setDescription('');
    setResolutionDate(new Date().toISOString().split('T')[0]);
    setErrors({});
    clearImages();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* ── Descripción de la resolución ── */}
      <FormField
        id="resolution-description"
        label="Descripción de la resolución"
        required
        icon={<FileText className="size-4" />}
        error={errors.description}
      >
        <textarea
          id="resolution-description"
          rows={5}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          placeholder="Describe detalladamente las acciones tomadas para resolver el incidente..."
          maxLength={800}
          className={`${inputClass(!!errors.description)} resize-none`}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {description.length}/800
        </p>
      </FormField>

      {/* ── Fecha de resolución ── */}
      <FormField
        id="resolution-date"
        label="Fecha de resolución"
        required
        icon={<Calendar className="size-4" />}
        error={errors.resolutionDate}
      >
        <input
          id="resolution-date"
          type="date"
          value={resolutionDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => {
            setResolutionDate(e.target.value);
            if (errors.resolutionDate) setErrors({ ...errors, resolutionDate: '' });
          }}
          className={inputClass(!!errors.resolutionDate)}
        />
      </FormField>

      {/* ── Evidencia fotográfica de la resolución ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ImagePlus className="size-4" />
            Evidencia fotográfica
            <span className="text-xs font-normal text-muted-foreground ml-1">(opcional pero recomendada)</span>
          </label>
          <span className="text-xs text-muted-foreground">{images.length}/{MAX_FILES} fotos</span>
        </div>

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

        {imgError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <p className="text-xs text-destructive">{imgError}</p>
          </div>
        )}

        <ImagePreviewGrid
          images={images}
          slotsLeft={slotsLeft}
          onRemove={removeImage}
          onAddMore={() => getRootProps().onClick?.()}
        />
      </div>

      {/* ── Acciones del formulario ── */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2.5 text-sm
            font-semibold text-white shadow-sm transition
            hover:bg-sky-700 disabled:pointer-events-none disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Send className="size-4" />
          {isSubmitting ? 'Enviando…' : 'Enviar resolución'}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2 rounded-lg border border-border bg-background
            px-5 py-2.5 text-sm font-medium text-muted-foreground transition
            hover:bg-muted hover:text-foreground disabled:opacity-50
          "
        >
          <RotateCcw className="size-4" />
          Limpiar
        </button>
      </div>
    </form>
  );
}

function FormField({ id, label, required, icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return [
    'w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm transition',
    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
    hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input focus:ring-sky-600/40 focus:border-sky-600',
  ].join(' ');
}
