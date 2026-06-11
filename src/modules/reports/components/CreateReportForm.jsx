import { useState } from 'react';
import {
  Send, RotateCcw, MapPin, Calendar,
  FileText, AlertTriangle, Tag, Layers,
} from 'lucide-react';

import { ImageFileUpload } from '@/core/components/ui/image-file-upload';
import { FormField } from '@/core/components/forms/FormField';
import { TextareaField } from '@/core/components/forms/TextareaField';
import { formControlClass } from '@/core/components/forms/formStyles';
import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { REPORT_TEXTAREA_FIELDS } from '../constants/reportConstants';
import { useReportForm } from '../hooks/useReportForm';
import { SelectionGroup } from './SelectionGroup';

export function CreateReportForm({
  categories = [],
  riskLevels = [],
  localizations = [],
  subtypesByCategory = {},
  subareasByLocalization = {},
  isLoadingCatalogs = false,
  loadingSubtypes = false,
  loadingSubareas = false,
  catalogError = '',
  onCategorySelect,
  onLocalizationSelect,
  onSubmit,
  isSubmitting,
}) {
  const { form, errors, touched, set, reset, handleSubmit } = useReportForm();
  const [images, setImages] = useState([]);
  const [pendingReport, setPendingReport] = useState(null);

  const subtypeOptions = subtypesByCategory[form.categoryId] ?? [];
  const subareaOptions = subareasByLocalization[form.localizationId] ?? [];
  const descriptionTextarea = REPORT_TEXTAREA_FIELDS.description;
  const customContextTextarea = REPORT_TEXTAREA_FIELDS.customContext;
  const hasSubtypeOptions = subtypeOptions.length > 0;
  const selectedCategory = categories.find((item) => item.id === form.categoryId);
  const isOtherCategory = selectedCategory?.label?.trim().toLowerCase() === 'otro';
  const shouldShowReasonOptions = Boolean(form.categoryId && hasSubtypeOptions);
  const shouldShowCustomContext = Boolean(form.categoryId && isOtherCategory);

  const handleReset = () => {
    reset();
    setImages([]);
  };

  const handleCategorySelect = (id) => {
    set('categoryId', id);
    onCategorySelect?.(id);
  };

  const handleLocalizationChange = (event) => {
    const id = event.target.value;
    set('localizationId', id);
    onLocalizationSelect?.(id);
  };

  const prepareReport = (formData) => {
    const category = categories.find((item) => item.id === formData.categoryId);
    const subtype = subtypeOptions.find((item) => item.id === formData.subtypeId);
    const riskLevel = riskLevels.find((item) => item.id === formData.riskLevelId);
    const localization = localizations.find((item) => item.id === formData.localizationId);
    const subarea = subareaOptions.find((item) => item.id === formData.subareaId);

    setPendingReport({
      ...formData,
      categoryName: category?.label ?? '',
      categoryColor: category?.color ?? '#6b7280',
      subtypeName: subtype?.label ?? '',
      subtypeColor: subtype?.color ?? category?.color ?? '#6b7280',
      riskLevelName: riskLevel?.label ?? '',
      riskLevelColor: riskLevel?.color ?? '#6b7280',
      localizationName: localization?.label ?? '',
      subareaName: subarea?.label ?? '',
    });
  };

  const confirmReport = async () => {
    if (!pendingReport) return;
    const createdReport = await onSubmit(pendingReport);
    if (!createdReport) return;
    setPendingReport(null);
    handleReset();
  };

  return (
    <form
      onSubmit={(e) =>
        handleSubmit(e, images, prepareReport, {
          subtypeOptions,
          subareaOptions,
          requiresContext: isOtherCategory,
        })
      }
      noValidate
      className="space-y-6"
      id="create-report-form"
    >
      {catalogError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">
          {catalogError}
        </div>
      )}

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
          placeholder="Ej. Falla electrica en laboratorio"
          maxLength={120}
          className={formControlClass(touched.title && errors.title)}
        />
      </FormField>



      <SelectionGroup
        label="Tipo de reporte"
        icon={<Tag className="size-4" />}
        required
        items={categories}
        idPrefix="category"
        selected={form.categoryId}
        onSelect={handleCategorySelect}
        error={touched.categoryId ? errors.categoryId : ''}
      />

      {loadingSubtypes && <p className="text-sm text-muted-foreground">Cargando razones...</p>}

      {shouldShowReasonOptions && (
        <SelectionGroup
          label="Razon del reporte"
          icon={<Layers className="size-4" />}
          required
          items={subtypeOptions}
          idPrefix="subtype"
          selected={form.subtypeId}
          onSelect={(id) => set('subtypeId', id)}
          error={touched.subtypeId ? errors.subtypeId : ''}
        />
      )}

            {shouldShowCustomContext && (
        <TextareaField
          id={customContextTextarea.id}
          label={customContextTextarea.label}
          required
          icon={<FileText className="size-4" />}
          error={touched.customContext ? errors.customContext : ''}
          rows={customContextTextarea.rows}
          value={form.customContext}
          onChange={(e) => set('customContext', e.target.value)}
          placeholder={customContextTextarea.placeholder}
          maxLength={customContextTextarea.maxLength}
        />
      )}


      <SelectionGroup
        label="Nivel de riesgo"
        icon={<AlertTriangle className="size-4" />}
        required
        items={riskLevels}
        idPrefix="risk"
        selected={form.riskLevelId}
        onSelect={(id) => set('riskLevelId', id)}
        error={touched.riskLevelId ? errors.riskLevelId : ''}
      />
      



      <TextareaField
        id={descriptionTextarea.id}
        label={descriptionTextarea.label}
        required
        icon={<FileText className="size-4" />}
        error={touched.description ? errors.description : ''}
        rows={descriptionTextarea.rows}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder={descriptionTextarea.placeholder}
        maxLength={descriptionTextarea.maxLength}
      />





      <FormField
        id="report-localization"
        label="Lugar"
        required
        icon={<MapPin className="size-4" />}
        error={touched.localizationId ? errors.localizationId : ''}
      >
        <select
          id="report-localization"
          value={form.localizationId}
          onChange={handleLocalizationChange}
          className={formControlClass(touched.localizationId && errors.localizationId)}
          disabled={isLoadingCatalogs}
        >
          <option value="">{isLoadingCatalogs ? 'Cargando lugares...' : 'Selecciona un lugar'}</option>
          {localizations.map((localization) => (
            <option key={localization.id} value={localization.id}>
              {localization.label}
            </option>
          ))}
        </select>
      </FormField>

      {loadingSubareas && <p className="text-sm text-muted-foreground">Cargando ubicaciones especificas...</p>}

      {form.localizationId && subareaOptions.length > 0 && (
        <FormField
          id="report-subarea"
          label="Ubicacion especifica"
          required
          icon={<MapPin className="size-4" />}
          error={touched.subareaId ? errors.subareaId : ''}
        >
          <select
            id="report-subarea"
            value={form.subareaId}
            onChange={(event) => set('subareaId', event.target.value)}
            className={formControlClass(touched.subareaId && errors.subareaId)}
          >
            <option value="">Selecciona una ubicacion especifica</option>
            {subareaOptions.map((subarea) => (
              <option key={subarea.id} value={subarea.id}>
                {subarea.label}
              </option>
            ))}
          </select>
        </FormField>
      )}

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
          className={formControlClass(touched.incidentDate && errors.incidentDate)}
        />
      </FormField>

      <ImageFileUpload files={images} onChange={setImages} disabled={isSubmitting} />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          type="submit"
          id="submit-report-btn"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm"
        >
          <Send className="size-4" />
          {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
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

      <ConfirmationMessage
        open={Boolean(pendingReport)}
        {...CONFIRMATION_MESSAGES.reports.create(pendingReport?.title)}
        isLoading={isSubmitting}
        onAccept={confirmReport}
        onReject={() => setPendingReport(null)}
      />
    </form>
  );
}
