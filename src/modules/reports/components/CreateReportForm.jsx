import {
  Send, RotateCcw, MapPin, Calendar,
  FileText, AlertTriangle, Tag, ImagePlus, AlertCircle,
} from 'lucide-react';

import { useCatalogs } from '@/core/context/CatalogContext';
import { getReportTypeOptions, getRiskLevelOptions } from '../constants/reportConstants';
import { useReportForm } from '../hooks/useReportForm';
import { useImageUpload, MAX_FILES, MAX_MB } from '../hooks/useImageUpload';
import { SelectionGroup } from './SelectionGroup';
import { ImageUploadZone } from './ImageUploadZone';
import { ImagePreviewGrid } from './ImagePreviewGrid';

export function CreateReportForm({ onSubmit, isSubmitting }) {
  const { getOptions, hasOptions, isLoading: catalogsLoading } = useCatalogs();
  const { form, errors, touched, set, reset, handleSubmit } = useReportForm();
  const {
    images, imgError, isDragging, slotsLeft,
    getRootProps, getInputProps,
    removeImage, clearImages,
  } = useImageUpload();

  const reportTypeOptions = getReportTypeOptions(getOptions('typeReport'));
  const riskLevelOptions = getRiskLevelOptions(getOptions('riskLevel'));
  const catalogsReady = hasOptions('typeReport') && hasOptions('riskLevel') && hasOptions('statusReport');

  const handleReset = () => {
    reset();
    clearImages();
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, images.map((i) => i.file), onSubmit)}
      noValidate
      className="space-y-6"
      id="create-report-form"
    >
      <FormField
        id="report-title"
        label="Titulo del reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.title ? errors.title : ''}
      >
        <input
          id="report-title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ej. Basura acumulada en la zona norte"
          maxLength={120}
          className={inputClass(touched.title && errors.title)}
        />
      </FormField>

      <FormField
        id="report-description"
        label="Descripcion del reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.description ? errors.description : ''}
      >
        <textarea
          id="report-description"
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe el problema con el mayor detalle posible..."
          maxLength={800}
          className={`${inputClass(touched.description && errors.description)} resize-none`}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {form.description.length}/800
        </p>
      </FormField>

      <SelectionGroup
        label="Tipo de reporte"
        icon={<Tag className="size-4" />}
        required
        items={reportTypeOptions}
        idPrefix="type"
        selected={form.reportType}
        onSelect={(id) => set('reportType', id)}
        disabled={!catalogsReady}
        error={touched.reportType ? errors.reportType : ''}
      />

      <SelectionGroup
        label="Nivel de riesgo"
        icon={<AlertTriangle className="size-4" />}
        required
        items={riskLevelOptions}
        idPrefix="risk"
        selected={form.riskLevel}
        onSelect={(id) => set('riskLevel', id)}
        disabled={!catalogsReady}
        error={touched.riskLevel ? errors.riskLevel : ''}
      />

      <FormField
        id="report-location"
        label="Localizacion"
        required
        icon={<MapPin className="size-4" />}
        error={touched.location ? errors.location : ''}
      >
        <input
          id="report-location"
          type="text"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Ej. Bloque A - Piso 2, Cafeteria Central"
          maxLength={200}
          className={inputClass(touched.location && errors.location)}
        />
      </FormField>

      <FormField
        id="report-incident-date"
        label="Fecha del incidente"
        required
        icon={<Calendar className="size-4" />}
        error={touched.incidentDate ? errors.incidentDate : ''}
      >
        <input
          id="report-incident-date"
          type="date"
          value={form.incidentDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => set('incidentDate', e.target.value)}
          className={inputClass(touched.incidentDate && errors.incidentDate)}
        />
      </FormField>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ImagePlus className="size-4" />
            Evidencia fotografica
            <span className="ml-1 text-xs font-normal text-muted-foreground">(opcional)</span>
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

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          id="submit-report-btn"
          disabled={isSubmitting || !catalogsReady}
          className="
            inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm
            font-semibold text-primary-foreground shadow-sm transition
            hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Send className="size-4" />
          {isSubmitting ? 'Enviando...' : catalogsReady ? 'Enviar reporte' : catalogsLoading ? 'Cargando opciones...' : 'Catalogos no disponibles'}
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
    hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input',
  ].join(' ');
}
