import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useAuth } from '@/core/context/AuthContext';
import { AuthPageShell } from '@/modules/auth/components/AuthPageShell';
import { AuthProcessOverlay } from '@/modules/auth/components/AuthProcessOverlay';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import {
  createInvitedUserPassword,
  subscribeToInvitationSession,
  validateInvitationAccess,
} from '@/services/userInvitationService';
import { showErrorAlert, showSuccessAlert } from '@/core/services/alertService';
import {
  createUserError,
  getUserErrorMessage,
} from '@/core/services/errorMessageService';
import { SERVICE_ERROR_MESSAGES } from '@/core/constants/errorMessages';

const INVITATION_STATUS = {
  validating: 'validating',
  ready: 'ready',
  invalid: 'invalid',
  success: 'success',
};

export default function InvitationPasswordPage() {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [status, setStatus] = useState(INVITATION_STATUS.validating);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeToInvitationSession((session) => {
      if (isMounted && session) setStatus(INVITATION_STATUS.ready);
    });

    async function validateSession() {
      try {
        const session = await validateInvitationAccess();
        if (!isMounted) return;

        if (session) {
          setStatus(INVITATION_STATUS.ready);
          return;
        }

        const invalidMessage =
          'La invitación no es válida o ya fue utilizada.';
        setMessage(invalidMessage);
        showErrorAlert(invalidMessage, {
          title: 'Invitación no disponible',
        });
        setStatus(INVITATION_STATUS.invalid);
      } catch (validationError) {
        if (!isMounted) return;
        const validationMessage = getUserErrorMessage(
          validationError,
          SERVICE_ERROR_MESSAGES.auth.invitation
        );
        setMessage(validationMessage);
        showErrorAlert(validationMessage, {
          title: 'Invitación no disponible',
        });
        setStatus(INVITATION_STATUS.invalid);
      }
    }

    validateSession();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handlePasswordCreation = async (password) => {
    setIsUpdating(true);

    try {
      await createInvitedUserPassword(password);
      await clearSession();
      setStatus(INVITATION_STATUS.success);
      showSuccessAlert('Tu contraseña fue creada y el acceso quedó activado.');
    } catch (creationError) {
      throw createUserError(
        getUserErrorMessage(
          creationError,
          'No fue posible crear la contraseña con esta invitación.'
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {isUpdating && (
        <AuthProcessOverlay
          title="Creando contraseña"
          description="Estamos activando de forma segura tu acceso al sistema."
        />
      )}

      <AuthPageShell
        backTo={AUTH_PATHS.login}
        backLabel="Volver al inicio de sesión"
        footer="La invitación solo puede utilizarse durante un tiempo limitado."
      >
        {status === INVITATION_STATUS.validating && <ValidatingState />}

        {status === INVITATION_STATUS.ready && (
          <>
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Crea tu contraseña
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tu cuenta fue registrada mediante una invitación. El enlace se
              validará cuando confirmes una contraseña segura y personal para
              obtener acceso a la plataforma.
            </p>
            <ResetPasswordForm
              onSubmit={handlePasswordCreation}
              isLoading={isUpdating}
              confirmation={
                CONFIRMATION_MESSAGES.users.setInvitationPassword
              }
              submitLabel="Crear contraseña"
              loadingLabel="Creando..."
              passwordLabel="Contraseña de acceso"
              confirmationLabel="Confirmar contraseña de acceso"
            />
          </>
        )}

        {status === INVITATION_STATUS.invalid && (
          <InvalidState
            message={message}
            onContinue={() => navigate(AUTH_PATHS.login)}
          />
        )}

        {status === INVITATION_STATUS.success && (
          <SuccessState onContinue={() => navigate(AUTH_PATHS.login)} />
        )}
      </AuthPageShell>
    </>
  );
}

function ValidatingState() {
  return (
    <div className="py-8 text-center">
      <LoaderCircle className="mx-auto size-9 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-bold text-foreground">
        Validando invitación
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estamos comprobando que el enlace siga vigente.
      </p>
    </div>
  );
}

function InvalidState({ message, onContinue }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Enlace de invitación no disponible
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
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

function SuccessState({ onContinue }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Acceso activado
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tu contraseña fue creada. Ya puedes iniciar sesión.
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
