import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';
import { useAuth } from '@/core/context/AuthContext';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import {
  getRecoverySession,
  getRecoveryUrlError,
  subscribeToPasswordRecovery,
  updateRecoveredPassword,
} from '@/modules/auth/services/passwordRecoveryService';

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

    const urlError = getRecoveryUrlError();
    if (urlError) {
      setMessage('El enlace de recuperacion vencio o ya fue utilizado.');
      setStatus(RECOVERY_STATUS.invalid);
      return undefined;
    }

    const unsubscribe = subscribeToPasswordRecovery((session) => {
      if (isMounted && session) {
        setStatus(RECOVERY_STATUS.ready);
      }
    });

    async function validateSession() {
      try {
        const session = await getRecoverySession();
        if (!isMounted) return;

        if (session) {
          setStatus(RECOVERY_STATUS.ready);
          return;
        }

        setMessage('El enlace de recuperacion no es valido o ha vencido.');
        setStatus(RECOVERY_STATUS.invalid);
      } catch {
        if (!isMounted) return;
        setMessage('No fue posible validar el enlace de recuperacion.');
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
        'No fue posible actualizar la contrasena. Solicita un enlace nuevo.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50/40 px-4 py-10">
      <div className="mx-auto w-full max-w-lg space-y-8">
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to={AUTH_PATHS.login}>
            <ArrowLeft className="size-4" />
            Volver al inicio de sesion
          </Link>
        </Button>

        <BrandHeader />

        <section className="rounded-2xl border border-border bg-card p-8 shadow-md">
          {status === RECOVERY_STATUS.validating && <ValidatingState />}

          {status === RECOVERY_STATUS.ready && (
            <>
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound className="size-6" />
              </div>
              <h1 className="mt-5 text-2xl font-bold text-foreground">
                Crea una nueva contrasena
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                El enlace fue validado. Define una contrasena segura para
                recuperar el acceso a tu cuenta.
              </p>
              <ResetPasswordForm
                onSubmit={handlePasswordUpdate}
                isLoading={isUpdating}
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
        </section>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          El enlace solo puede utilizarse durante un tiempo limitado.
        </p>
      </div>
    </main>
  );
};

function BrandHeader() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 justify-center sm:justify-start">
          <img
            src={UNIVALLE_LOGO_SRC}
            alt={INSTITUTION_NAME}
            className="h-16 w-auto max-w-[200px] object-contain"
          />
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-2xl font-bold text-foreground">{APP_NAME}</p>
          <p className="text-sm text-muted-foreground">
            Plataforma de gestion de reportes ambientales
          </p>
        </div>
      </div>
    </section>
  );
}

function ValidatingState() {
  return (
    <div className="py-8 text-center">
      <LoaderCircle className="mx-auto size-9 animate-spin text-primary" />
      <h1 className="mt-5 text-xl font-bold text-foreground">
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
      <h1 className="mt-5 text-2xl font-bold text-foreground">
        Enlace no disponible
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      <Button type="button" size="lg" className="mt-7 w-full" onClick={onRetry}>
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
      <h1 className="mt-5 text-2xl font-bold text-foreground">
        Contrasena actualizada
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ya puedes iniciar sesion utilizando tu nueva contrasena.
      </p>
      <Button
        type="button"
        size="lg"
        className="mt-7 w-full"
        onClick={onContinue}
      >
        Ir al inicio de sesion
      </Button>
    </div>
  );
}

export default ResetPasswordPage;
