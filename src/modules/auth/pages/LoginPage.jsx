import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import { Field } from '@/core/components/ui/fields';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';
import { useAuth } from '@/core/context/AuthContext';

const ROLE_HOME_PATHS = {
  [USER_ROLE_IDS.OPERATOR]: '/operator',
  [USER_ROLE_IDS.ADMIN]: '/admin',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, clearSession } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    try {
      const roleId = await login(email, password);
      navigate(ROLE_HOME_PATHS[roleId] ?? '/reports/view');
    } catch {
      setErrorMsg('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50/40 px-4 py-10">
      <div className="mx-auto mb-8 flex max-w-lg justify-start">
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <img
                src={UNIVALLE_LOGO_SRC}
                alt={INSTITUTION_NAME}
                className="h-16 w-auto max-w-[200px] object-contain"
              />
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {APP_NAME}
              </h1>
              <p className="text-sm text-muted-foreground">
                Plataforma de gestion de reportes ambientales
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-foreground">
            Bienvenido
          </h2>

          <p className="mb-6 text-center text-sm text-muted-foreground">
            Inicia sesion para acceder a tu cuenta y administrar tus reportes.
          </p>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle size={16} />
              <p>{errorMsg}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Field
              id="email"
              label="Correo"
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Field
              id="password"
              label="Contrasena"
              type="password"
              placeholder="Ingresa tu contrasena"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              id="login"
              className="h-11 w-full text-base font-semibold shadow-sm transition-[transform,box-shadow,filter] duration-150"
            >
              Iniciar sesion
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate(AUTH_PATHS.recoverPassword)}
                className="cursor-pointer text-sm text-primary underline-offset-4 transition hover:underline"
              >
                Olvidaste tu contrasena?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
