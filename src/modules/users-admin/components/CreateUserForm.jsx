import { UserRoundPlus } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { UserForm } from '@/modules/users-admin/components/UserForm';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';
import { useCreateUserForm } from '@/modules/users-admin/hooks/useCreateUserForm';

export function CreateUserForm() {
  const [confirmCreate, setConfirmCreate] = useState(false);
  const { isMutating } = useUserManagement();
  const {
    formData,
    errors,
    message,
    updateField,
    resetForm,
    validateForm,
    submitForm,
  } = useCreateUserForm();
  const confirmation = CONFIRMATION_MESSAGES.users.create(
    `${formData.firstName} ${formData.lastName}`.trim()
  );

  const requestCreate = (event) => {
    event.preventDefault();
    if (validateForm()) setConfirmCreate(true);
  };

  const confirmCreation = async () => {
    const createdUser = await submitForm();
    if (createdUser) setConfirmCreate(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRoundPlus className="size-5 text-primary" />
          Registrar usuario
        </CardTitle>
        <CardDescription>
          Registra el perfil y envía al usuario un enlace para crear su
          contraseña.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserForm
          mode="create"
          formData={formData}
          errors={errors}
          message={message}
          onFieldChange={updateField}
          onSubmit={requestCreate}
          onReset={resetForm}
          submitLabel="Enviar invitación"
        />
      </CardContent>

      <ConfirmationMessage
        open={confirmCreate}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmCreation}
        onReject={() => setConfirmCreate(false)}
      />
    </Card>
  );
}
