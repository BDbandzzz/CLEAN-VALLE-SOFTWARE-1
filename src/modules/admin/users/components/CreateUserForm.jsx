import { RotateCcw, Save, UserRoundPlus, Wrench } from 'lucide-react';

import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { MultiSelectField } from '@/core/components/ui/multi-select-field';
import { SelectField } from '@/core/components/ui/select-field';
import { useCatalogs } from '@/core/context/CatalogContext';
import { OPERATOR_SPECIALIZATIONS } from '@/core/data/cleanvalleSchema';
import { UserTextField } from '@/modules/admin/users/components/UserTextField';
import { ADMIN_CREATABLE_ROLES } from '@/modules/admin/users/constants/userFormOptions';
import { useCreateUserForm } from '@/modules/admin/users/hooks/useCreateUserForm';

export function CreateUserForm() {
  const { getOptions } = useCatalogs();
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
        <form onSubmit={submitForm} className="space-y-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <UserTextField
              id="codeUser"
              label="Código institucional"
              value={formData.codeUser}
              onChange={(value) => updateField('codeUser', value)}
              placeholder="Ej. DOC002"
              required
              error={errors.codeUser}
            />
            <SelectField
              id="role"
              label="Rol"
              value={formData.role}
              options={ADMIN_CREATABLE_ROLES}
              onChange={(event) => updateField('role', event.target.value)}
              required
              error={errors.role}
            />
            <UserTextField
              id="firstName"
              label="Nombres"
              value={formData.firstName}
              onChange={(value) => updateField('firstName', value)}
              required
              error={errors.firstName}
            />
            <UserTextField
              id="lastName"
              label="Apellidos"
              value={formData.lastName}
              onChange={(value) => updateField('lastName', value)}
              required
              error={errors.lastName}
            />
            <UserTextField
              id="email"
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              placeholder="usuario@correounivalle.edu.co"
              required
              error={errors.email}
            />
            <UserTextField
              id="dniUser"
              label="Documento"
              value={formData.dniUser}
              onChange={(value) => updateField('dniUser', value)}
              required
              error={errors.dniUser}
            />
            <SelectField
              id="typeDniId"
              label="Tipo de documento"
              value={formData.typeDniId}
              options={getOptions('documentTypes')}
              onChange={(event) => updateField('typeDniId', event.target.value)}
              required
              error={errors.typeDniId}
            />
            <SelectField
              id="genderId"
              label="Género"
              value={formData.genderId}
              options={getOptions('genders')}
              onChange={(event) => updateField('genderId', event.target.value)}
              required
              error={errors.genderId}
            />
          </div>

          {formData.role === 'operador' && (
            <section className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Wrench className="size-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Especialidades del operador
                </h3>
              </div>
              <MultiSelectField
                id="specializationIds"
                label="Especialidades"
                options={OPERATOR_SPECIALIZATIONS}
                value={formData.specializationIds}
                onChange={(value) => updateField('specializationIds', value)}
                required
                description="Selecciona una o varias capacidades operativas."
                error={errors.specializationIds}
              />
            </section>
          )}

          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
              {message}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              <Save className="size-4" />
              Guardar usuario
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={resetForm}>
              <RotateCcw className="size-4" />
              Limpiar formulario
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
