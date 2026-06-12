import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { SelectField } from '@/core/components/ui/select-field';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';

export function GroupReportsMetadataDialog({
  open,
  values,
  statuses,
  riskLevels,
  localizations,
  subareas,
  isLoading,
  onChange,
  onLocalizationChange,
  onConfirm,
  onClose,
}) {
  const isComplete =
    values.statusId &&
    values.riskLevelId &&
    values.localizationId &&
    values.subareaId;

  return (
    <ConfirmationMessage
      open={open}
      {...CONFIRMATION_MESSAGES.reports.updateGroupMetadata}
      isLoading={isLoading}
      acceptDisabled={!isComplete}
      onAccept={onConfirm}
      onReject={onClose}
      className="max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="group-status"
          label="Estado"
          value={values.statusId}
          options={statuses}
          onChange={(event) => onChange('statusId', event.target.value)}
          required
        />
        <SelectField
          id="group-risk"
          label="Nivel de riesgo"
          value={values.riskLevelId}
          options={riskLevels}
          onChange={(event) => onChange('riskLevelId', event.target.value)}
          required
        />
        <SelectField
          id="group-localization"
          label="Lugar"
          value={values.localizationId}
          options={localizations}
          onChange={(event) => onLocalizationChange(event.target.value)}
          required
        />
        <SelectField
          id="group-subarea"
          label="Ubicación específica"
          value={values.subareaId}
          options={subareas}
          onChange={(event) => onChange('subareaId', event.target.value)}
          disabled={!values.localizationId}
          required
        />
      </div>
    </ConfirmationMessage>
  );
}
