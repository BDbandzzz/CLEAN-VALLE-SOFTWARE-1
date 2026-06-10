import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, KeyRound, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useAuth } from '@/core/context/AuthContext';
import { AuthPageShell } from '@/modules/auth/components/AuthPageShell';
import { AuthProcessOverlay } from '@/modules/auth/components/AuthProcessOverlay';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import {
  getRecoverySession,
  getRecoveryUrlError,
  subscribeToPasswordRecovery,
  updateRecoveredPassword,
} from '@/services/passwordRecoveryService';

const RECOVERY_STATUS = {
  validating: 'validating',
  ready: 'ready',
  invalid: 'invalid',
  success: 'success',
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [status, setStatus] = useState(RECOVERY_STATUS.validating);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (getRecoveryUrlError()) {
      setMessage('El enlace de recuperación venció o ya fue utilizado.');
      setStatus(RECOVERY_STATUS.invalid);
      return undefined;
    }

    const unsubscribe = subscribeToPasswordRecovery((session) => {
      if (isMounted && session) setStatus(RECOVERY_STATUS.ready);
    });

    async function validateSession() {
      try {
        const session = await getRecoverySession();
        if (!isMounted) return;

        if (session) {
          setStatus(RECOVERY_STATUS.ready);
          return;
        }

        setMessage('El enlace de recuperación no es válido o ha vencido.');
        setStatus(RECOVERY_STATUS.invalid);
      } catch {
        if (!isMounted) return;
        setMessage('No fue posible validar el enlace de recuperación.');
        setStatus(RECOVERY_STATUS.invalid);
      }
    }

    validateSession();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (password) => {
    setIsUpdating(true);

    try {
      await updateRecoveredPassword(password);
      await clearSession();
      setStatus(RECOVERY_STATUS.success);
    } catch {
      throw new Error(
        'No fue posible actualizar la contraseña. Solicita un enlace nuevo.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {isUpdating && (
        <AuthProcessOverlay
          title="Actualizando contraseña"
          description="Estamos guardando tu nueva contraseña de forma segura."
        />
      )}

      <AuthPageShell
        backTo={AUTH_PATHS.login}
        backLabel="Volver al inicio de sesión"
        footer="El enlace solo puede utilizarse durante un tiempo limitado."
      >
        {status === RECOVERY_STATUS.validating && <ValidatingState />}

        {status === RECOVERY_STATUS.ready && (
          <>
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Recupera el acceso a tu cuenta
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Este enlace corresponde a una solicitud de recuperación.
              Reemplaza tu contraseña anterior por una nueva para volver a
              ingresar.
            </p>
            <ResetPasswordForm
              onSubmit={handlePasswordUpdate}
              isLoading={isUpdating}
              confirmation={
                CONFIRMATION_MESSAGES.authentication.recoverPassword
              }
              submitLabel="Restablecer contraseña"
              passwordLabel="Nueva contraseña de acceso"
              confirmationLabel="Confirmar nueva contraseña"
            />
          </>
        )}

        {status === RECOVERY_STATUS.invalid && (
          <InvalidState
            message={message}
            onRetry={() => navigate(AUTH_PATHS.recoverPassword)}
          />
        )}

        {status === RECOVERY_STATUS.success && (
          <SuccessState onContinue={() => navigate(AUTH_PATHS.login)} />
        )}
      </AuthPageShell>
    </>
  );
};

function ValidatingState() {
  return (
    <div className="py-8 text-center">
      <LoaderCircle className="mx-auto size-9 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-bold text-foreground">
        Validando enlace
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estamos comprobando que tu solicitud siga vigente.
      </p>
    </div>
  );
}

function InvalidState({ message, onRetry }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Enlace no disponible
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button type="button" size="lg" className="mt-6 w-full" onClick={onRetry}>
        Solicitar otro enlace
      </Button>
    </div>
  );
}

function SuccessState({ onContinue }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Contraseña actualizada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ya puedes iniciar sesión utilizando tu nueva contraseña.
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        onClick={onContinue}
      >
        Ir al inicio de sesión
      </Button>
    </div>
  );
}

export default ResetPasswordPage;
