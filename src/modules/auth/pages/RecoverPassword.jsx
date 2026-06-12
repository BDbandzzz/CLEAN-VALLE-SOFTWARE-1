import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { AuthPageShell } from '@/modules/auth/components/AuthPageShell';
import { AuthProcessOverlay } from '@/modules/auth/components/AuthProcessOverlay';
import { requestPasswordRecovery } from '@/services/passwordRecoveryService';
import { validateRecoverEmail } from '@/modules/auth/utils/recoverUtils';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import {
  showErrorAlert,
  showSuccessAlert,
  showWarningAlert,
} from '@/core/services/alertService';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = validateRecoverEmail(email);
    if (!result.ok) {
      setError(result.message);
      showWarningAlert(result.message, { title: 'Revisa el correo' });
      return;
    }

    setError('');
    setIsSending(true);

    try {
      await requestPasswordRecovery(result.email);
      setSubmittedEmail(result.email);
      setSent(true);
      showSuccessAlert(ALERT_MESSAGES.auth.recoverySent);
    } catch {
      const message =
        'No fue posible enviar el correo. Espera un momento e intenta nuevamente.';
      setError(message);
      showErrorAlert(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isSending && (
        <AuthProcessOverlay
          title="Enviando correo"
          description="Estamos generando un enlace seguro para recuperar tu cuenta."
        />
      )}

      <AuthPageShell
        backTo={AUTH_PATHS.login}
        backLabel="Volver al inicio de sesión"
        footer="El enlace de recuperación tendrá una vigencia limitada."
      >
        {sent ? (
          <RecoveryConfirmation
            email={submittedEmail}
            onEditEmail={() => {
              setSent(false);
              setError('');
            }}
            onReturn={() => navigate(AUTH_PATHS.login)}
          />
        ) : (
          <RecoveryForm
            email={email}
            error={error}
            isSending={isSending}
            onEmailChange={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AuthPageShell>
    </>
  );
};

function RecoveryForm({ email, error, isSending, onEmailChange, onSubmit }) {
  return (
    <>
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Mail className="size-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Recupera tu contraseña
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Correo electrónico</Label>
          <Input
            id="recovery-email"
            type="email"
            placeholder="nombre@correounivalle.edu.co"
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            aria-invalid={Boolean(error)}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full font-semibold"
          disabled={isSending}
        >
          <Mail className="size-4" />
          Enviar enlace de recuperación
        </Button>
      </form>
    </>
  );
}

function RecoveryConfirmation({ email, onEditEmail, onReturn }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Revisa tu correo
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Si existe una cuenta asociada a{' '}
        <strong className="font-semibold text-foreground">{email}</strong>,
        recibirás las instrucciones en unos minutos.
      </p>
      <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
        Revisa también las carpetas de spam o correo no deseado.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={onEditEmail}>
          Corregir correo
        </Button>
        <Button type="button" onClick={onReturn}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

export default RecoverPassword;
