import { Pencil } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { EmptyState } from '@/core/components/ui/empty-state';
import { UserForm } from '@/modules/admin/users/components/UserForm';
import { useEditUserForm } from '@/modules/admin/users/hooks/useEditUserForm';

export function EditUserForm({ user }) {
  const {
    formData,
    errors,
    message,
    updateField,
    resetForm,
    submitForm,
  } = useEditUserForm(user);

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
          onSubmit={submitForm}
          onReset={resetForm}
          submitLabel="Guardar cambios"
        />
      </CardContent>
    </Card>
  );
}
