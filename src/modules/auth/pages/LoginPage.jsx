import { Leaf } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/context/AuthContext';
import { useState } from 'react';
import UnivalleLogo from '@/core/imgs/univallelogo.jpg';

const defaultProfile = {
  fullName: '',
  email: '',
  dniUser: '',
  typeDni: '',
  gender: '',
  userCredentials: '',
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const getRoleFromCredentials = (code, password) => {
    const normalized = code.toLowerCase().trim();

    if (normalized === '2455194-2724') {
      return 'estudiante';
    }
    if (normalized.startsWith('pro')) {
      return 'profesor';
    }
    if (normalized.startsWith('ope')) {
      return 'operador';
    }
    if (normalized.startsWith('adm')) {
      return 'admin';
    }

    // Si no coincide con ninguna regla, asumimos estudiante.
    return 'estudiante';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const role = getRoleFromCredentials(code.trim(), password.trim());
    const userData = {
      id: code || `user_${Date.now()}`,
      fullName: 'Usuario Test',
      dniUser: code || `TEST${Date.now()}`,
      role,
      ...defaultProfile,
    };

    login(userData);
    navigate('/profile');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-8 rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <Leaf className="size-10 text-emerald-600" />
              <div>
                <p className="text-3xl font-bold text-emerald-900">CleanValle</p>
                <p className="text-sm text-emerald-700">Plataforma de gestión de reportes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-emerald-50 p-4 text-left shadow-sm">
              <img
                src={UnivalleLogo}
                alt="Universidad del Valle"
                className="h-14 w-14 rounded-full object-cover border border-emerald-200"
              />
              <div>
                <p className="text-lg font-semibold text-emerald-900">Universidad del Valle</p>
                <p className="text-sm text-emerald-700">Identidad institucional integrada</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-white p-8 shadow-lg">
          <h1 className="mb-3 text-center text-3xl font-bold text-slate-900">Bienvenido</h1>
          <p className="mb-6 text-center text-sm text-slate-600">
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

            <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700" size="lg">
              Iniciar sesión
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              size="lg"
            >
              <FcGoogle size={18} />
              Iniciar sesión con Google
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/recover-pass')}
                className="text-sm text-emerald-700 hover:text-emerald-900 hover:underline transition"
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