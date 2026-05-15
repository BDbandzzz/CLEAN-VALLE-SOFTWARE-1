/**
 * CreateReportForm
 * ----------------
 * Orquestador del formulario de creación de reporte.
 *
 * Responsabilidades de ESTE archivo:
 *   - Componer el layout del formulario conectando hooks y componentes.
 *   - Delegar el estado del formulario a useReportForm.
 *   - Delegar el estado de imágenes a useImageUpload.
 *   - Renderizar campos simples (título, descripción, localización, fecha).
 *   - Pasar props a los sub-componentes (SelectionGroup, ImageUploadZone, ImagePreviewGrid).
 *
 * NO es responsable de:
 *   - Validación de campos (→ useReportForm / validateReport).
 *   - Validación de imágenes (→ useImageUpload).
 *   - Lógica de drag & drop (→ useImageUpload).
 *   - Envío al backend (→ CreateReportPage vía prop onSubmit).
 *   - Render de thumbnails (→ ImagePreviewGrid).
 *   - Render de la zona de drop (→ ImageUploadZone).
 *   - Render de los grupos de selección (→ SelectionGroup).
 *
 * Props:
 *   onSubmit     {Function(formData)}  Handler externo invocado con los datos validados.
 *   isSubmitting {boolean}             Deshabilita el formulario mientras el padre procesa.
 *
 * Para añadir un campo nuevo:
 *   1. Agregar la clave a INITIAL_FORM en useReportForm.js.
 *   2. Agregar la validación en validateReport() en useReportForm.js.
 *   3. Agregar el <FormField> correspondiente aquí.
 */
import {
  Send, RotateCcw, MapPin, Calendar,
  FileText, AlertTriangle, Tag, ImagePlus, AlertCircle,
} from 'lucide-react';

import { REPORT_TYPES, RISK_LEVELS } from '../constants/reportConstants';
import { useReportForm }             from '../hooks/useReportForm';
import { useImageUpload, MAX_FILES, MAX_MB } from '../hooks/useImageUpload';
import { SelectionGroup }   from './SelectionGroup';
import { ImageUploadZone }  from './ImageUploadZone';
import { ImagePreviewGrid } from './ImagePreviewGrid';

export function CreateReportForm({ onSubmit, isSubmitting }) {
  /* ── Hooks ── */
  const { form, errors, touched, set, reset, handleSubmit } = useReportForm();
  const {
    images, imgError, isDragging, slotsLeft,
    getRootProps, getInputProps,
    removeImage, clearImages,
  } = useImageUpload();

  /** Reset global: limpia campos y revoca Object URLs de imágenes. */
  const handleReset = () => { reset(); clearImages(); };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, images.map((i) => i.file), onSubmit)}
      noValidate
      className="space-y-6"
      id="create-report-form"
    >
      {/* ── Título ── */}
      <FormField
        id="report-title"
        label="Título del reporte"
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

      {/* ── Descripción ── */}
      <FormField
        id="report-description"
        label="Descripción del reporte"
        required
        icon={<FileText className="size-4" />}
        error={touched.description ? errors.description : ''}
      >
        <textarea
          id="report-description"
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe el problema con el mayor detalle posible…"
          maxLength={800}
          className={`${inputClass(touched.description && errors.description)} resize-none`}
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {form.description.length}/800
        </p>
      </FormField>

      {/* ── Tipo de reporte ── */}
      <SelectionGroup
        label="Tipo de reporte"
        icon={<Tag className="size-4" />}
        required
        items={REPORT_TYPES}
        idPrefix="type"
        selected={form.reportType}
        onSelect={(id) => set('reportType', id)}
        error={touched.reportType ? errors.reportType : ''}
      />

      {/* ── Nivel de riesgo ── */}
      <SelectionGroup
        label="Nivel de riesgo"
        icon={<AlertTriangle className="size-4" />}
        required
        items={RISK_LEVELS}
        idPrefix="risk"
        selected={form.riskLevel}
        onSelect={(id) => set('riskLevel', id)}
        error={touched.riskLevel ? errors.riskLevel : ''}
      />

      {/* ── Localización ── */}
      <FormField
        id="report-location"
        label="Localización"
        required
        icon={<MapPin className="size-4" />}
        error={touched.location ? errors.location : ''}
      >
        <input
          id="report-location"
          type="text"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Ej. Bloque A – Piso 2, Cafetería Central"
          maxLength={200}
          className={inputClass(touched.location && errors.location)}
        />
      </FormField>

      {/* ── Fecha del incidente ── */}
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

      {/* ── Evidencia fotográfica ── */}
      <div className="space-y-2">
        {/* Encabezado de la sección con contador */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ImagePlus className="size-4" />
            Evidencia fotográfica
            <span className="text-xs font-normal text-muted-foreground ml-1">(opcional)</span>
          </label>
          <span className="text-xs text-muted-foreground">{images.length}/{MAX_FILES} fotos</span>
        </div>

        {/* Zona de drag & drop — se oculta cuando se llena el cupo */}
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

        {/* El input nativo lo inyecta ImageUploadZone a través de getInputProps() */}

        {/* Mensajes de error de imagen (tamaño excedido, tipo inválido, etc.) */}
        {imgError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <p className="text-xs text-destructive">{imgError}</p>
          </div>
        )}

        {/* Grilla de thumbnails con botón de eliminar y slot de agregar más */}
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
          id="submit-report-btn"
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm
            font-semibold text-primary-foreground shadow-sm transition
            hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
        >
          <Send className="size-4" />
          {isSubmitting ? 'Enviando…' : 'Enviar reporte'}
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

/* ─────────────────────────────────────────────────────────────────────────────
   FormField – wrapper reutilizable para cualquier campo del formulario.

   Muestra: ícono + etiqueta + asterisco opcional + children + mensaje de error.
   Para campos con lógica de selección especial (tipo/riesgo), usar SelectionGroup.
───────────────────────────────────────────────────────────────────────────── */
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

/* ── Utilidad de clases para inputs ── */
function inputClass(hasError) {
  return [
    'w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm transition',
    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
    hasError ? 'border-destructive focus:ring-destructive/40' : 'border-input',
  ].join(' ');
}
