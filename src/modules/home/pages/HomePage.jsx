import { useAuth } from '@/core/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/core/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { getRoleDisplayName, getWelcomeMessage } from '@/core/lib/utils';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const getQuickActions = (role) => {
    const actions = {
      estudiante: [
        { title: 'Mi perfil', icon: User, url: '/profile', color: 'bg-purple-500' },
      ],
      profesor: [
        { title: 'Mi perfil', icon: User, url: '/profile', color: 'bg-purple-500' },
      ],
      operador: [
        { title: 'Mi perfil', icon: User, url: '/profile', color: 'bg-purple-500' },
      ],
      admin: [
        { title: 'Mi perfil', icon: User, url: '/profile', color: 'bg-purple-500' },
      ],
    };
    return actions[role] || [];
  };

  const currentActions = getQuickActions(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {getWelcomeMessage(user?.role)}
          </h1>
          <p className="text-muted-foreground">
            Sistema de Gestión de Reportes - {getRoleDisplayName(user?.role)}
          </p>
          {user?.fullName && <p className="text-sm text-gray-600 mt-2">Usuario: {user.fullName}</p>}
        </div>
        <Button 
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Navegación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.url)}
                className={`${action.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity duration-200 text-left`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{action.title}</h3>
                  <IconComponent size={24} />
                </div>
                <p className="text-sm opacity-90">Acceder</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Información de Rol */}
      <div className="mt-12 p-6 bg-slate-50 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Información de tu Cuenta</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Rol:</strong> {getRoleDisplayName(user?.role)}</p>
          <p><strong>Nombre Completo:</strong> {user?.fullName || 'No disponible'}</p>
          <p><strong>DNI:</strong> {user?.dniUser || 'No disponible'}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
