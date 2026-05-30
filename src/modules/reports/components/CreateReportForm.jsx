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
import { CAMPUS_LOCATIONS } from '@/core/data/cleanvalleSchema';
import {
  REPORT_TEXTAREA_FIELDS,
  getReportCategoryOptions,
  getRiskLevelOptions,
  getSubTypeOptions,
} from '../constants/reportConstants';
import { useReportForm } from '../hooks/useReportForm';
import { SelectionGroup } from './SelectionGroup';

export function CreateReportForm({ onSubmit, isSubmitting }) {
  const { form, errors, touched, set, reset, handleSubmit } = useReportForm();
  const [images, setImages] = useState([]);

  const categoryOptions = getReportCategoryOptions();
  const subtypeOptions = getSubTypeOptions(form.categoryId);
  const riskLevelOptions = getRiskLevelOptions();
  const descriptionTextarea = REPORT_TEXTAREA_FIELDS.description;
  const customContextTextarea = REPORT_TEXTAREA_FIELDS.customContext;
  const hasSubtypeOptions = subtypeOptions.length > 0;
  const shouldShowReasonOptions = form.categoryId && form.categoryId !== 'otro' && hasSubtypeOptions;
  const shouldShowCustomContext =
    form.categoryId === 'otro' ||
    (form.categoryId && !hasSubtypeOptions);

  const handleReset = () => {
    reset();
    setImages([]);
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, images.map((image) => URL.createObjectURL(image)), onSubmit)}
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
          placeholder="Ej. Falla electrica en laboratorio"
          maxLength={120}
          className={formControlClass(touched.title && errors.title)}
        />
      </FormField>



      <SelectionGroup
        label="Tipo de reporte"
        icon={<Tag className="size-4" />}
        required
        items={categoryOptions}
        idPrefix="category"
        selected={form.categoryId}
        onSelect={(id) => set('categoryId', id)}
        error={touched.categoryId ? errors.categoryId : ''}
      />

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
        items={riskLevelOptions}
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
        id="report-location"
        label="Ubicacion"
        required
        icon={<MapPin className="size-4" />}
        error={touched.locationId ? errors.locationId : ''}
      >
        <select
          id="report-location"
          value={form.locationId}
          onChange={(e) => set('locationId', e.target.value)}
          className={formControlClass(touched.locationId && errors.locationId)}
        >
          <option value="">Selecciona un lugar del campus</option>
          {CAMPUS_LOCATIONS.map((location) => (
            <option key={location.id} value={location.id}>
              {location.label}
            </option>
          ))}
        </select>
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
    </form>
  );
}
