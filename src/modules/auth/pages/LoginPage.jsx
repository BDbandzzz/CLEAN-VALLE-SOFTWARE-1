import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { useAuth } from '@/core/context/AuthContext';
import { UNIVALLE_LOGO_SRC, APP_NAME, INSTITUTION_NAME } from '@/core/constants/branding';
import { buildLoginUserPayload } from '@/modules/auth/validation/LoginValidation';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = buildLoginUserPayload(code, password);
    login(userData);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50/40 px-4 py-10">
      <div className="mx-auto mb-8 flex max-w-lg justify-start">
        <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link to="/">← Volver al inicio</Link>
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
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{APP_NAME}</h1>
              <p className="text-sm text-muted-foreground">Plataforma de gestión de reportes ambientales</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-foreground">Bienvenido</h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Inicia sesión para acceder a tu cuenta y administrar tus reportes.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                type="text"
                placeholder="Ingresa tu código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base font-semibold shadow-sm transition-[transform,box-shadow,filter] duration-150"
            >
              Iniciar sesión
            </Button>

            <Button type="button" variant="outline" className="w-full" size="lg">
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
