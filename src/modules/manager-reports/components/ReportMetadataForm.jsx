import { AlertTriangle, Layers, Save, Tag } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { SelectField } from '@/core/components/ui/select-field';
import { SelectionGroup } from '@/modules/reports/components/SelectionGroup';

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
  onSubtypeChange,
  onLocalizationChange,
  onSubmit,
}) {
  return (
    <section className="space-y-5 bg-background px-5 py-6 sm:px-7">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Clasificacion del reporte</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajusta unicamente los datos operativos permitidos.
        </p>
      </div>

      <SelectionGroup
        label="Nivel de riesgo"
        icon={<AlertTriangle className="size-4" />}
        items={riskLevels}
        idPrefix="manager-detail-risk"
        selected={values.riskLevelId}
        onSelect={(id) => onChange('riskLevelId', id)}
        required
        disabled={disabled}
      />

      <SelectionGroup
        label="Categoria"
        icon={<Tag className="size-4" />}
        items={categories}
        idPrefix="manager-detail-category"
        selected={values.categoryId}
        onSelect={onCategoryChange}
        required
        disabled={disabled}
      />

      {values.categoryId && (
        <SelectionGroup
          label="Razon"
          icon={<Layers className="size-4" />}
          items={subtypes}
          idPrefix="manager-detail-subtype"
          selected={values.subtypeId}
          onSelect={onSubtypeChange}
          required
          disabled={disabled}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
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
        {isSaving ? 'Actualizando...' : 'Guardar otros cambios'}
      </Button>

      {disabled && (
        <p className="text-xs font-medium text-muted-foreground">
          Los reportes en estado terminal no pueden modificarse.
        </p>
      )}
    </section>
  );
}
