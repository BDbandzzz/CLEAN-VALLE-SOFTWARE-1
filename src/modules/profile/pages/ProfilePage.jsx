import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { useAuth } from '@/core/context/AuthContext';
import { getRoleDisplayLabel } from '@/core/mappers/domainMappers';
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
  const { user, logout, updateEmail } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
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
      state: user.stateName ?? '',
    }));
  }, [user]);

  const initials = useMemo(
    () => getProfileInitials(`${formData.firstName} ${formData.lastName}`.trim(), user?.name),
    [formData.firstName, formData.lastName, user?.name]
  );
  const emailConfirmation = CONFIRMATION_MESSAGES.profile.changeEmail(formData.email);

  const handleLogout = async () => {
    await logout();
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

  const requestEmailUpdate = () => {
    const validation = validateProfileForm(formData);
    if (!validation.ok) {
      setMessage(validation.message);
      return;
    }

    setConfirmEmail(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const success = await updateEmail(formData.email);
      setMessage(
        success
          ? { type: 'success', text: 'Perfil actualizado correctamente' }
          : { type: 'error', text: 'Error al actualizar el perfil' }
      );
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setIsSaving(false);
      setConfirmEmail(false);
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
        onLogout={() => setConfirmLogout(true)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProfileSummaryCard
          dniUser={user.dniUser}
          emailPreview={formData.email}
          roleName={getRoleDisplayLabel(user.roleId, user.roleName)}
        />

        <div className="space-y-6 lg:col-span-2">
          <ProfilePersonalDataCard
            formData={formData}
            message={message}
            isSaving={isSaving}
            onEmailChange={handleEmailChange}
            onSave={requestEmailUpdate}
            onReset={handleReset}
          />
        </div>
      </div>

      <ConfirmationMessage
        open={confirmEmail}
        {...emailConfirmation}
        isLoading={isSaving}
        onAccept={handleSave}
        onReject={() => setConfirmEmail(false)}
      />

      <ConfirmationMessage
        open={confirmLogout}
        {...CONFIRMATION_MESSAGES.session.logout}
        onAccept={handleLogout}
        onReject={() => setConfirmLogout(false)}
      />
    </div>
  );
};

export default ProfilePage;
