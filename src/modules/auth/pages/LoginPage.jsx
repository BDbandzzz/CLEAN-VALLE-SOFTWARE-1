import { useState } from 'react';
import { AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/core/components/ui/button';
import { Field } from '@/core/components/ui/fields';
import { AUTH_PATHS } from '@/core/constants/authRoutes';
import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { useAuth } from '@/core/context/AuthContext';
import { ALERT_MESSAGES } from '@/core/constants/alertMessages';
import { showErrorAlert } from '@/core/services/alertService';
import { AuthPageShell } from '@/modules/auth/components/AuthPageShell';
import { AuthProcessOverlay } from '@/modules/auth/components/AuthProcessOverlay';
import { PasswordInputField } from '@/modules/auth/components/PasswordInputField';

const ROLE_HOME_PATHS = {
  [USER_ROLE_IDS.OPERATOR]: '/operator',
  [USER_ROLE_IDS.MANAGER]: '/manager',
  [USER_ROLE_IDS.ADMIN]: '/admin',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoggingIn) return;

    setErrorMsg('');
    setIsLoggingIn(true);

    try {
      const roleId = await login(email, password);
      navigate(ROLE_HOME_PATHS[roleId] ?? '/reports/view');
    } catch {
      setErrorMsg(ALERT_MESSAGES.auth.invalidCredentials);
      showErrorAlert(ALERT_MESSAGES.auth.invalidCredentials, {
        title: 'No fue posible iniciar sesión',
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      {isLoggingIn && (
        <AuthProcessOverlay
          title="Iniciando sesión"
          description="Estamos verificando tus credenciales y preparando tu espacio."
        />
      )}

      <AuthPageShell backTo="/" backLabel="Volver al inicio">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LogIn className="size-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Bienvenido
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para acceder a tu cuenta.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Field
            id="email"
            label="Correo"
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <PasswordInputField
            id="password"
            label="Contraseña"
            value={password}
            visible={showPassword}
            onChange={setPassword}
            onToggle={() => setShowPassword((current) => !current)}
            placeholder="Ingresa tu contraseña"
          />

          <Button
            type="submit"
            size="lg"
            id="login"
            className="h-11 w-full text-base font-semibold"
            disabled={isLoggingIn}
          >
            <LogIn className="size-4" />
            Iniciar sesión
          </Button>

          <Button
            type="button"
            variant="link"
            className="h-auto w-full text-primary"
            onClick={() => navigate(AUTH_PATHS.recoverPassword)}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </form>
      </AuthPageShell>
    </>
  );
};

export default LoginPage;
