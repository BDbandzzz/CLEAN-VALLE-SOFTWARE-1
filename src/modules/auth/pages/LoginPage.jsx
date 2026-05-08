import { Leaf } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();
  return (

    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 flex items-center justify-center gap-2">
          <Leaf className="size-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">CleanValle</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="mb-2 text-center text-2xl font-bold">Bienvenido</h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Inicia sesión para acceder a tu cuenta
          </p>
          
          <form className="space-y-4">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="text">Codigo</Label>
              <Input id="code" type="text" placeholder="Ingresa tu codigo" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            {/* Botones */}
            <Button type="submit" className="w-full" size="lg">
              Iniciar sesión
            </Button>

            <Button type="button" variant="dark" className="w-full" size="lg">
              <FcGoogle size={18}/>
              Iniciar sesión con Google
            </Button>
            <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/recover-pass")}
                  className="text-sm text-teal-600 hover:text-teal-700 hover:underline transition"
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