import { TextareaField } from '@/core/components/forms/TextareaField';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';

export function RejectAssignmentDialog({
  assignment,
  reason,
  isLoading,
  onReasonChange,
  onConfirm,
  onClose,
}) {
  return (
    <ConfirmationMessage
      open={Boolean(assignment)}
      {...CONFIRMATION_MESSAGES.reports.rejectAssignment}
      isLoading={isLoading}
      acceptDisabled={reason.trim().length < 20}
      onAccept={onConfirm}
      onReject={onClose}
    >
      <TextareaField
        id="assignment-rejection-reason"
        label="Motivo del rechazo"
        required
        rows={4}
        maxLength={500}
        value={reason}
        onChange={(event) => onReasonChange(event.target.value)}
        placeholder="Explica por qué no puedes atender esta asignación."
      />
      <p className="mt-2 text-right text-xs text-muted-foreground">
        {reason.trim().length}/20 caracteres mínimos
      </p>
    </ConfirmationMessage>
  );
}
