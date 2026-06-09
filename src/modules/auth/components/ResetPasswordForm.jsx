import { useMemo, useState } from 'react';
import { CheckCircle2, LockKeyhole } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { PasswordInputField } from '@/modules/auth/components/PasswordInputField';
import {
  PASSWORD_REQUIREMENTS,
  validateNewPassword,
} from '@/modules/auth/utils/passwordValidation';

const INITIAL_VALUES = {
  password: '',
  confirmation: '',
};

export function ResetPasswordForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [confirmChange, setConfirmChange] = useState(false);

  const requirements = useMemo(
    () =>
      PASSWORD_REQUIREMENTS.map((requirement) => ({
        ...requirement,
        met: requirement.validate(values.password),
      })),
    [values.password]
  );

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
  };

  const requestSubmit = (event) => {
    event.preventDefault();

    const validationError = validateNewPassword(
      values.password,
      values.confirmation
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setConfirmChange(true);
  };

  const confirmSubmit = async () => {
    try {
      await onSubmit(values.password);
      setConfirmChange(false);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <>
    <form className="mt-6 space-y-4" onSubmit={requestSubmit} noValidate>
      <PasswordInputField
        id="new-password"
        label="Nueva contrasena"
        value={values.password}
        visible={showPassword}
        onChange={(value) => setField('password', value)}
        onToggle={() => setShowPassword((current) => !current)}
        autoComplete="new-password"
      />

      <PasswordInputField
        id="confirm-new-password"
        label="Confirmar contrasena"
        value={values.confirmation}
        visible={showConfirmation}
        onChange={(value) => setField('confirmation', value)}
        onToggle={() => setShowConfirmation((current) => !current)}
        autoComplete="new-password"
      />

      {values.password && (
        <ul className="space-y-1.5 rounded-lg bg-muted/50 p-4">
          {requirements.map((requirement) => (
            <li
              key={requirement.id}
              className={`flex items-center gap-2 text-xs ${
                requirement.met ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <CheckCircle2
                className={`size-3.5 ${requirement.met ? '' : 'opacity-35'}`}
              />
              {requirement.label}
            </li>
          ))}
          <li
            className={`flex items-center gap-2 text-xs ${
              values.confirmation && values.password === values.confirmation
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <CheckCircle2
              className={`size-3.5 ${
                values.confirmation && values.password === values.confirmation
                  ? ''
                  : 'opacity-35'
              }`}
            />
            Las contrasenas coinciden
          </li>
        </ul>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full font-semibold"
        disabled={isLoading}
      >
        <LockKeyhole className="size-4" />
        {isLoading ? 'Actualizando...' : 'Guardar nueva contrasena'}
      </Button>
    </form>

    <ConfirmationMessage
      open={confirmChange}
      {...CONFIRMATION_MESSAGES.profile.changePassword}
      isLoading={isLoading}
      onAccept={confirmSubmit}
      onReject={() => setConfirmChange(false)}
    />
    </>
  );
}
