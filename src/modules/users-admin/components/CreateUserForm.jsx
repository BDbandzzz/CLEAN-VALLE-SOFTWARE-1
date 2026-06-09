import { UserRoundPlus } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { UserForm } from '@/modules/users-admin/components/UserForm';
import { useCreateUserForm } from '@/modules/users-admin/hooks/useCreateUserForm';

export function CreateUserForm() {
  const {
    formData,
    errors,
    message,
    updateField,
    resetForm,
    submitForm,
  } = useCreateUserForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRoundPlus className="size-5 text-primary" />
          Registrar usuario
        </CardTitle>
        <CardDescription>
          Crea una cuenta con la información esencial del perfil institucional.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserForm
          mode="create"
          formData={formData}
          errors={errors}
          message={message}
          onFieldChange={updateField}
          onSubmit={submitForm}
          onReset={resetForm}
          submitLabel="Guardar usuario"
        />
      </CardContent>
    </Card>
  );
}
