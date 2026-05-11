
import { useEffect, useState } from 'react';
import { useAuth } from '@/core/context/AuthContext';
import { Button } from '@/core/components/ui/button';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Save, X, CheckCircle, AlertCircle, Lock, Eye, EyeOff, CalendarDays, CreditCard } from 'lucide-react';
import { getRoleDisplayName } from '@/core/lib/utils';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dniUser: '',
    typeDni: '',
    gender: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        dniUser: user.dniUser || '',
        typeDni: user.typeDni || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  // Estados para cambio de contraseña
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar mensaje cuando el usuario empiece a editar
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        dniUser: user.dniUser || '',
        typeDni: user.typeDni || '',
        gender: user.gender || '',
      });
    }
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'El nombre completo es obligatorio' });
      return false;
    }
    if (!formData.dniUser.trim()) {
      setMessage({ type: 'error', text: 'El DNI es obligatorio' });
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: 'El email no tiene un formato válido' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const success = updateUser(formData);
      if (success) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordMessage({ type: '', text: '' });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordMessage({ type: '', text: '' });
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar mensaje cuando el usuario empiece a editar
    if (passwordMessage.text) {
      setPasswordMessage({ type: '', text: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setPasswordMessage({ type: 'error', text: 'La contraseña actual es obligatoria' });
      return false;
    }
    if (!passwordData.newPassword) {
      setPasswordMessage({ type: 'error', text: 'La nueva contraseña es obligatoria' });
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return false;
    }
    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsChangingPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular verificación de contraseña actual (en producción esto vendría de la API)
      // Simular cambio de contraseña sin verificación real para la demo
      setPasswordMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
            <User size={48} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Perfil de usuario</p>
            <h1 className="text-3xl font-bold text-slate-900">{formData.fullName || 'Bienvenido'}</h1>
            <p className="mt-1 text-sm text-slate-500">{getRoleDisplayName(user.role)}</p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                readOnly
                placeholder="Ingrese su nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                readOnly
                placeholder="Ingrese su email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dniUser">DNI</Label>
              <Input
                id="dniUser"
                type="text"
                value={formData.dniUser}
                readOnly
                placeholder="Ingrese su DNI"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeDni">Tipo de DNI</Label>
              <Input
                id="typeDni"
                type="text"
                value={formData.typeDni}
                readOnly
                placeholder="Ej: CC, TI, CE, PAS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Input
                id="gender"
                type="text"
                value={formData.gender}
                readOnly
                placeholder="Ingrese su género"
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mt-6 flex items-center gap-2 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[220px] rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="min-w-[220px] rounded-full px-8 py-4 text-base font-semibold"
          >
            <X className="mr-2 h-4 w-4" />
            Restablecer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
