import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { validateRecoverEmail } from '@/modules/auth/validation/RecoverPasswordValidation';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateRecoverEmail(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio de sesión
        </button>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
          </p>

          {sent ? (
            <p className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
              Si el correo es válido, recibirás instrucciones en breve (demo sin envío real).
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  aria-invalid={Boolean(error)}
                />
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Enviar enlace de recuperación
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Revisa tu bandeja de spam si no recibes el correo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
