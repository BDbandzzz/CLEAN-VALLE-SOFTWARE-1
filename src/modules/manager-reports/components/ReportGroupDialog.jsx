import { Layers3 } from 'lucide-react';

import { FormField } from '@/core/components/forms/FormField';
import { TextareaField } from '@/core/components/forms/TextareaField';
import { formControlClass } from '@/core/components/forms/formStyles';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';

export function ReportGroupDialog({
  open,
  reportCount,
  values,
  isLoading,
  onChange,
  onConfirm,
  onClose,
}) {
  return (
    <ConfirmationMessage
      open={open}
      {...CONFIRMATION_MESSAGES.reports.createGroup(reportCount)}
      isLoading={isLoading}
      acceptDisabled={values.title.trim().length < 3}
      onAccept={onConfirm}
      onReject={onClose}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <FormField
          id="report-group-title"
          label="Título del grupo"
          required
          icon={<Layers3 className="size-4" />}
        >
          <input
            id="report-group-title"
            value={values.title}
            maxLength={120}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Ej. Incidencias de red en el bloque B"
            className={formControlClass()}
          />
        </FormField>
        <TextareaField
          id="report-group-description"
          label="Descripción"
          rows={4}
          maxLength={500}
          value={values.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Contexto compartido e instrucciones para el operador."
        />
      </div>
    </ConfirmationMessage>
  );
}
