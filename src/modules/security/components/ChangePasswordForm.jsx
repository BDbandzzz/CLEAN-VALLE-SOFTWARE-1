import { useState } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useAuth } from '@/core/context/AuthContext';
import { PasswordInputField } from '@/modules/auth/components/PasswordInputField';
import { validateNewPassword } from '@/modules/auth/utils/passwordValidation';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from '@/core/services/alertService';

const INITIAL_DATA = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function validate(data) {
  if (!data.currentPassword) {
    return 'Ingresa tu contraseña actual.';
  }

  if (data.currentPassword === data.newPassword) {
    return 'La nueva contraseña debe ser diferente a la actual.';
  }

  return validateNewPassword(data.newPassword, data.confirmPassword);
}

export function ChangePasswordForm({ onSuccess }) {
  const { changePassword } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);

  const setField = (field, value) => {
    setData((current) => ({ ...current, [field]: value }));
    setError('');
    setDone(false);
  };

  const requestPasswordChange = (event) => {
    event.preventDefault();
    const validationError = validate(data);

    if (validationError) {
      setError(validationError);
      showWarningAlert(validationError);
      return;
    }

    setConfirmChange(true);
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    setError('');

    try {
      await changePassword(data.currentPassword, data.newPassword);
      setDone(true);
      setData(INITIAL_DATA);
      setConfirmChange(false);
      showSuccessAlert(ALERT_MESSAGES.auth.passwordUpdated);
      onSuccess?.();
    } catch (changeError) {
      const message =
        changeError.message || 'No se pudo actualizar la contraseña.';
      setError(message);
      showErrorAlert(message);
      setConfirmChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setError('');
    setDone(false);
    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowConfirmation(false);
  };

  return (
    <>
      <form
        onSubmit={requestPasswordChange}
        noValidate
        className="space-y-5"
        id="change-password-form"
      >
        {done && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-800">
              Contraseña actualizada correctamente.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        <PasswordInputField
          id="cp-current"
          label="Contraseña actual"
          value={data.currentPassword}
          visible={showCurrentPassword}
          onChange={(value) => setField('currentPassword', value)}
          onToggle={() =>
            setShowCurrentPassword((current) => !current)
          }
          autoComplete="current-password"
        />

        <PasswordInputField
          id="cp-new"
          label="Nueva contraseña"
          value={data.newPassword}
          visible={showPassword}
          onChange={(value) => setField('newPassword', value)}
          onToggle={() => setShowPassword((current) => !current)}
          autoComplete="new-password"
        />

        <PasswordInputField
          id="cp-confirm"
          label="Confirmar contraseña"
          value={data.confirmPassword}
          visible={showConfirmation}
          onChange={(value) => setField('confirmPassword', value)}
          onToggle={() => setShowConfirmation((current) => !current)}
          autoComplete="new-password"
        />

        {data.newPassword && (
          <ul className="space-y-1">
            <Requirement
              met={data.newPassword.length >= 8}
              label="Mínimo 8 caracteres"
            />
            <Requirement
              met={
                data.currentPassword.length > 0 &&
                data.currentPassword !== data.newPassword
              }
              label="Diferente a la contraseña actual"
            />
            <Requirement
              met={
                data.confirmPassword.length > 0 &&
                data.newPassword === data.confirmPassword
              }
              label="Las contraseñas coinciden"
            />
          </ul>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" size="lg" disabled={isLoading}>
            <Lock className="size-4" />
            Actualizar contraseña
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>

      <ConfirmationMessage
        open={confirmChange}
        {...CONFIRMATION_MESSAGES.profile.changePassword}
        isLoading={isLoading}
        onAccept={handlePasswordChange}
        onReject={() => setConfirmChange(false)}
      />
    </>
  );
}

function Requirement({ met, label }) {
  return (
    <li
      className={`flex items-center gap-2 text-xs ${
        met ? 'text-emerald-600' : 'text-muted-foreground'
      }`}
    >
      <CheckCircle2 className={`size-3.5 ${met ? '' : 'opacity-30'}`} />
      {label}
    </li>
  );
}
