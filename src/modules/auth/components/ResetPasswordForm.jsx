import { useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateNewPassword(
      values.password,
      values.confirmation
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit(values.password);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
      <PasswordField
        id="new-password"
        label="Nueva contrasena"
        value={values.password}
        visible={showPassword}
        onChange={(value) => setField('password', value)}
        onToggle={() => setShowPassword((current) => !current)}
        autoComplete="new-password"
      />

      <PasswordField
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
  );
}

function PasswordField({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
