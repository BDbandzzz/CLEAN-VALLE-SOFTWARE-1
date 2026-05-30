/**
 * LoginPage.jsx – Página de inicio de sesión.
 *
 * Flujo actual (demo local):
 *   1. El usuario ingresa su código institucional y contraseña.
 *   2. buildLoginUserPayload() genera un objeto de usuario
 *      con un rol determinado por el prefijo del código.
 *   3. login() persiste el usuario en localStorage.
 *   4. Se redirige a /profile.
 *
 * Integración con backend:
 *   Reemplazar handleSubmit por un POST /auth/login
 *   que retorne usuario + token.
 *
 * Notas:
 *   - Google Login aún es placeholder.
 *   - Validación actual es demo.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { useAuth } from '@/core/context/AuthContext';
import { Field } from '@/core/components/ui/fields';


import {
  APP_NAME,
  INSTITUTION_NAME,
  UNIVALLE_LOGO_SRC,
} from '@/core/constants/branding';
import { DEMO_USERS } from '@/core/data/cleanvalleSchema';

const ROLE_HOME_PATHS = {
  operador: '/operator',
  gestor: '/profile',
  admin: '/profile',
};

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, clearSession } = useAuth();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const role = await login(code, password);
      navigate(ROLE_HOME_PATHS[role] ?? '/reports/view');
    } catch {
      setErrorMsg("Credenciales incorrectas. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50/40 px-4 py-10">
      {/* Botón volver */}
      <div className="mx-auto mb-8 flex max-w-lg justify-start">
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">← Volver al inicio</Link>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        {/* Header */}
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
                Plataforma de gestión de reportes ambientales
              </p>
            </div>
          </div>
        </div>

        {/* Card Login */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-foreground">
            Bienvenido
          </h2>

          <p className="mb-6 text-center text-sm text-muted-foreground">
            Inicia sesión para acceder a tu cuenta y administrar tus reportes.
          </p>

          {errorMsg && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle size={16} />
              <p>{errorMsg}</p>
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
            <Field
              id="code"
              label="Código"
              type="text"
              placeholder="Ingresa tu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Field
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              id="login"
              className="h-11 w-full text-base font-semibold shadow-sm transition-[transform,box-shadow,filter] duration-150"
            >
              Iniciar sesión
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <FcGoogle size={18} />
              Iniciar sesión con Google
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate('/recover-pass')}
                className="cursor-pointer text-sm text-primary underline-offset-4 transition hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Usuarios demo
            </p>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              {DEMO_USERS.map((demoUser) => (
                <button
                  key={demoUser.codeUser}
                  type="button"
                  onClick={() => {
                    setCode(demoUser.codeUser);
                    setPassword(demoUser.password);
                    setErrorMsg('');
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left transition hover:bg-muted"
                >
                  <span className="font-medium text-foreground">{demoUser.codeUser}</span>
                  <span>{demoUser.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

