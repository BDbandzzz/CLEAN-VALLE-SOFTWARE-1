import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';
import { requestPasswordRecovery } from '@/modules/auth/services/passwordRecoveryService';
import { validateRecoverEmail } from '@/modules/auth/utils/recoverUtils';

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
      return;
    }

    setError('');
    setIsSending(true);

    try {
      await requestPasswordRecovery(result.email);
      setSubmittedEmail(result.email);
      setSent(true);
    } catch {
      setError(
        'No fue posible enviar el correo. Espera un momento e intenta nuevamente.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleEditEmail = () => {
    setSent(false);
    setError('');
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
            Volver al inicio de sesión
          </Link>
        </Button>

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
                Plataforma de gestión de reportes ambientales
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8 shadow-md">
          {sent ? (
            <RecoveryConfirmation
              email={submittedEmail}
              onEditEmail={handleEditEmail}
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
        </section>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Tu información se utiliza únicamente para recuperar el acceso.
        </p>
      </div>
    </main>
  );
};

function RecoveryForm({ email, error, isSending, onEmailChange, onSubmit }) {
  return (
    <>
      <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Mail className="size-6" />
      </div>

      <h1 className="text-2xl font-bold text-foreground">
        Recupera tu contraseña
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Ingresa el correo asociado a tu cuenta. Te enviaremos un enlace seguro
        para crear una nueva contraseña.
      </p>

      <form className="mt-7 space-y-5" onSubmit={onSubmit} noValidate>
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
            aria-describedby={error ? 'recovery-email-error' : undefined}
            autoFocus
          />
          {error && (
            <p id="recovery-email-error" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full font-semibold"
          disabled={isSending}
        >
          <Mail className="size-4" />
          {isSending ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Por seguridad, verás el mismo mensaje incluso si el correo no se
        encuentra registrado.
      </p>
    </>
  );
}

function RecoveryConfirmation({ email, onEditEmail, onReturn }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-foreground">
        Revisa tu correo
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Si existe una cuenta asociada a
        <strong className="mx-1 font-semibold text-foreground">{email}</strong>,
        recibirás las instrucciones para recuperar tu acceso.
      </p>

      <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-left text-sm text-muted-foreground">
        El mensaje puede tardar unos minutos. Revisa también las carpetas de
        spam o correo no deseado.
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
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
