import { Pencil } from 'lucide-react';
import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { ConfirmationMessage } from '@/core/components/ui/confirmation-message';
import { CONFIRMATION_MESSAGES } from '@/core/constants/confirmationMessages';
import { UserForm } from '@/modules/users-admin/components/UserForm';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';
import { useEditUserForm } from '@/modules/users-admin/hooks/useEditUserForm';

export function EditUserForm({ user }) {
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const { isMutating } = useUserManagement();
  const {
    formData,
    errors,
    message,
    updateField,
    resetForm,
    validateForm,
    submitForm,
  } = useEditUserForm(user);
  const confirmation = CONFIRMATION_MESSAGES.users.update(
    `${formData.firstName} ${formData.lastName}`.trim()
  );

  const requestUpdate = (event) => {
    event.preventDefault();
    if (validateForm()) setConfirmUpdate(true);
  };

  const confirmUpdateUser = async () => {
    const updatedUser = await submitForm();
    if (updatedUser) setConfirmUpdate(false);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-primary" />
            Modificar usuario
          </CardTitle>
          <CardDescription>
            Selecciona un usuario desde Usuarios totales para editarlo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Ningún usuario seleccionado"
            description="Ve a Usuarios totales y usa la acción Modificar en una cuenta."
            icon={<Pencil className="mx-auto size-8 text-muted-foreground" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="size-5 text-primary" />
          Modificar usuario
        </CardTitle>
        <CardDescription>
          Edita datos base, rol, especialidades y contraseña de {user.firstName} {user.lastName}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserForm
          key={user.id}
          mode="edit"
          formData={formData}
          errors={errors}
          message={message}
          onFieldChange={updateField}
          onSubmit={requestUpdate}
          onReset={resetForm}
          submitLabel="Guardar cambios"
        />
      </CardContent>

      <ConfirmationMessage
        open={confirmUpdate}
        {...confirmation}
        isLoading={isMutating}
        onAccept={confirmUpdateUser}
        onReject={() => setConfirmUpdate(false)}
      />
    </Card>
  );
}
