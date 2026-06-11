import { Save } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { SelectField } from '@/core/components/ui/select-field';

export function ReportMetadataForm({
  values,
  categories,
  subtypes,
  riskLevels,
  localizations,
  subareas,
  disabled,
  isSaving,
  onChange,
  onCategoryChange,
  onLocalizationChange,
  onSubmit,
}) {
  return (
    <section className="space-y-5 border-b border-border bg-background px-5 py-6 sm:px-7">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Clasificacion del reporte</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajusta unicamente los datos operativos permitidos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField
          id="manager-detail-risk"
          label="Nivel de riesgo"
          value={values.riskLevelId}
          options={riskLevels}
          onChange={(event) => onChange('riskLevelId', event.target.value)}
          required
          disabled={disabled}
        />
        <SelectField
          id="manager-detail-category"
          label="Categoria"
          value={values.categoryId}
          options={categories}
          onChange={(event) => onCategoryChange(event.target.value)}
          required
          disabled={disabled}
        />
        <SelectField
          id="manager-detail-subtype"
          label="Razon"
          value={values.subtypeId}
          options={subtypes}
          onChange={(event) => onChange('subtypeId', event.target.value)}
          required
          disabled={disabled || !values.categoryId}
        />
        <SelectField
          id="manager-detail-localization"
          label="Lugar"
          value={values.localizationId}
          options={localizations}
          onChange={(event) => onLocalizationChange(event.target.value)}
          disabled={disabled}
        />
        <SelectField
          id="manager-detail-subarea"
          label="Ubicacion especifica"
          value={values.subareaId}
          options={subareas}
          onChange={(event) => onChange('subareaId', event.target.value)}
          disabled={disabled || !values.localizationId}
        />
      </div>

      <Button type="button" onClick={onSubmit} disabled={disabled || isSaving}>
        <Save className="size-4" />
        {isSaving ? 'Guardando...' : 'Guardar clasificacion'}
      </Button>

      {disabled && (
        <p className="text-xs font-medium text-muted-foreground">
          Los reportes en estado terminal no pueden modificarse.
        </p>
      )}
    </section>
  );
}
