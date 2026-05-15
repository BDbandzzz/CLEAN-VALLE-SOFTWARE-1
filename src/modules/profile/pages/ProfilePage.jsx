/**
 * ProfilePage.jsx – Página de perfil del usuario autenticado.
 *
 * Responsabilidades:
 *   - Leer el usuario de AuthContext y poblar formData al montar.
 *   - Gestionar el estado del formulario de datos personales (solo email editable).
 *   - Orquestar los handlers de guardado (updateUser) y reset.
 *
 * Estado local:
 *   formData   – Copia editable de los datos del usuario (firstName, lastName, email, etc.)
 *   isSaving   – Spinner de carga mientras se persiste.
 *   message    – Mensaje de éxito/error tras guardar.
 *
 * Componentes que compone:
 *   ProfileHero            – Encabezado con avatar, nombre y botón de logout.
 *   ProfileSummaryCard     – Columna lateral con DNI y email de resumen.
 *   ProfilePersonalDataCard – Formulario de datos (email editable + campos read-only).
 *
 * Nota: ProfileSecurityCard está definido pero no se usa aquí.
 *       El cambio de contraseña ocurre en /change-password (ChangePasswordPage).
 *
 * Integración con backend:
 *   handleSave → reemplazar updateUser(formData) por PUT /users/me con formData.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/core/context/AuthContext';
import { validatePasswordChangeForm, validateProfileForm } from '@/modules/profile/utils/profileValidation';
import { ProfileHero } from '@/modules/profile/components/ProfileHero';
import { ProfileSummaryCard } from '@/modules/profile/components/ProfileSummaryCard';
import { ProfilePersonalDataCard } from '@/modules/profile/components/ProfilePersonalDataCard';
import { getProfileInitials } from '@/modules/profile/utils/getProfileInitials';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dniUser: '',
    typeDni: '',
    gender: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    if (!user) return;
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      dniUser: user.dniUser || '',
      typeDni: user.typeDni || '',
      gender: user.gender || '',
    });
  }, [user]);

  const initials = useMemo(
    () => getProfileInitials(formData.fullName, user?.lastName),
    [formData.firstName, user?.lastName]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEmailChange = (value) => {
    setFormData((prev) => ({ ...prev, email: value }));
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || "",
        email: user.email || '',
        dniUser: user.dniUser || '',
        typeDni: user.typeDni || '',
        gender: user.gender || '',
      });
    }
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    const validation = validateProfileForm(formData);
    if (!validation.ok) {
      setMessage(validation.message);
      return;
    }
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const success = updateUser(formData);
      if (success) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordFieldChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (passwordMessage.text) setPasswordMessage({ type: '', text: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSavePassword = async () => {
    const validation = validatePasswordChangeForm(passwordData);
    if (!validation.ok) {
      setPasswordMessage(validation.message);
      return;
    }
    setIsChangingPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setPasswordMessage({ type: 'success', text: 'Contraseña actualizada (demo)' });
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPasswordMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', text: '' });
  };

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <ProfileHero
        initials={initials}
        displayName={formData.firstName + ' ' + formData.lastName}
        userRole={user.role}
        onLogout={handleLogout}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileSummaryCard dniUser={user.dniUser} emailPreview={formData.email} />

        <div className="space-y-6 lg:col-span-2">
          <ProfilePersonalDataCard
            formData={formData}
            message={message}
            isSaving={isSaving}
            onEmailChange={handleEmailChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
