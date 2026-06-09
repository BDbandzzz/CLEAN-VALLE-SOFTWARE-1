import { RotateCcw, Save } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { ColorField } from '@/core/components/ui/color-field';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { ReportSubtypeEditor } from '@/modules/report-types-admin/components/ReportSubtypeEditor';
import { useReportTypeManagement } from '@/modules/report-types-admin/context/ReportTypeManagementContext';

export function ReportTypeForm({
  mode,
  formData,
  errors,
  message,
  onFieldChange,
  onSubtypeAdd,
  onSubtypeChange,
  onSubtypeRemove,
  onSubmit,
  onReset,
  submitLabel,
}) {
  const { isMutating } = useReportTypeManagement();

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px]">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-report-type-title`}>
            Título del tipo
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`${mode}-report-type-title`}
            value={formData.label}
            onChange={(event) => onFieldChange('label', event.target.value)}
            placeholder="Ej. Infraestructura y Mantenimiento"
            aria-invalid={Boolean(errors.label)}
          />
          {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-report-type-description`}>
            Descripción
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`${mode}-report-type-description`}
            value={formData.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Describe el alcance del tipo"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
        </div>

        <ColorField
          id={`${mode}-report-type-color`}
          label="Color"
          value={formData.color}
          onChange={(value) => onFieldChange('color', value)}
          required
          error={errors.color}
        />
      </div>

      <ReportSubtypeEditor
        subtypes={formData.subtypes}
        errors={errors}
        onAdd={onSubtypeAdd}
        onChange={onSubtypeChange}
        onRemove={onSubtypeRemove}
      />

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
          {message}
        </div>
      )}

      {errors.form && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {errors.form}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={isMutating}>
          <Save className="size-4" />
          {isMutating ? 'Procesando...' : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={isMutating}
        >
          <RotateCcw className="size-4" />
          Limpiar formulario
        </Button>
      </div>
    </form>
  );
}
