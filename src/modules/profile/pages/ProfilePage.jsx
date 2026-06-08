import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/core/context/AuthContext';
import { ProfileHero } from '@/modules/profile/components/ProfileHero';
import { ProfilePersonalDataCard } from '@/modules/profile/components/ProfilePersonalDataCard';
import { ProfileSummaryCard } from '@/modules/profile/components/ProfileSummaryCard';
import { getProfileInitials } from '@/modules/profile/utils/getProfileInitials';
import { getGenderLabel, getTypeDniLabel, mapUserToProfileForm } from '@/modules/profile/utils/profileCatalogLabels';
import { validateProfileForm } from '@/modules/profile/utils/profileValidation';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  dniUser: '',
  typeDni: '',
  gender: '',
  state: '',
};

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) return;
    setFormData(mapUserToProfileForm(user));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      typeDni: getTypeDniLabel(user),
      gender: getGenderLabel(user),
      state: user.state ?? '',
    }));
  }, [user]);

  const initials = useMemo(
    () => getProfileInitials(`${formData.firstName} ${formData.lastName}`.trim(), user?.name),
    [formData.firstName, formData.lastName, user?.name]
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
    setFormData(mapUserToProfileForm(user));
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
      const success = await updateUser(formData);
      setMessage(
        success
          ? { type: 'success', text: 'Perfil actualizado correctamente' }
          : { type: 'error', text: 'Error al actualizar el perfil' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setIsSaving(false);
    }
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
        displayName={`${formData.firstName} ${formData.lastName}`.trim()}
        userRole={user.role}
        onLogout={handleLogout}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileSummaryCard
          dniUser={user.dniUser}
          emailPreview={formData.email}
          role={user.role}
          state={formData.state}
        />

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
