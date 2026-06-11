import { RotateCcw, Save, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/core/components/ui/button';
import { MultiSelectField } from '@/core/components/ui/multi-select-field';
import { SelectField } from '@/core/components/ui/select-field';
import { isOperatorRoleId } from '@/core/mappers/domainMappers';
import { UserTextField } from '@/modules/users-admin/components/UserTextField';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';

export function UserForm({
  mode,
  formData,
  errors,
  message,
  onFieldChange,
  onSubmit,
  onReset,
  submitLabel,
}) {
  const isCreateMode = mode === 'create';
  const [specializationCategoryId, setSpecializationCategoryId] = useState('');
  const {
    creatableRoles,
    documentTypes,
    genders,
    specializations,
    isLoading,
    isMutating,
  } = useUserManagement();
  const specializationCategories = useMemo(() => {
    const categories = new Map();

    specializations.forEach((specialization) => {
      if (
        specialization.categoryId != null &&
        specialization.categoryName &&
        !categories.has(String(specialization.categoryId))
      ) {
        categories.set(String(specialization.categoryId), {
          id: String(specialization.categoryId),
          label: specialization.categoryName,
        });
      }
    });

    return Array.from(categories.values());
  }, [specializations]);
  const visibleSpecializations = useMemo(
    () =>
      specializations.filter(
        (specialization) =>
          !specializationCategoryId ||
          String(specialization.categoryId) === specializationCategoryId ||
          formData.specializationIds.includes(specialization.id)
      ),
    [
      formData.specializationIds,
      specializationCategoryId,
      specializations,
    ]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <UserTextField
          id={`${mode}-codeUser`}
          label="Código institucional"
          value={formData.codeUser}
          onChange={(value) => onFieldChange('codeUser', value)}
          placeholder="Ej. DOC002"
          required
          error={errors.codeUser}
        />
        <SelectField
          id={`${mode}-role`}
          label="Rol"
          value={formData.roleId}
          options={creatableRoles}
          onChange={(event) => onFieldChange('roleId', event.target.value)}
          required
          disabled={isLoading || isMutating}
          error={errors.roleId}
        />
        <UserTextField
          id={`${mode}-firstName`}
          label="Nombres"
          value={formData.firstName}
          onChange={(value) => onFieldChange('firstName', value)}
          required
          error={errors.firstName}
        />
        <UserTextField
          id={`${mode}-lastName`}
          label="Apellidos"
          value={formData.lastName}
          onChange={(value) => onFieldChange('lastName', value)}
          required
          error={errors.lastName}
        />
        {isCreateMode && (
          <UserTextField
            id={`${mode}-email`}
            label="Correo electrónico"
            type="email"
            value={formData.email}
            onChange={(value) => onFieldChange('email', value)}
            placeholder="usuario@correounivalle.edu.co"
            required
            error={errors.email}
          />
        )}
        <UserTextField
          id={`${mode}-dniUser`}
          label="Documento"
          value={formData.dniUser}
          onChange={(value) => onFieldChange('dniUser', value)}
          required
          error={errors.dniUser}
        />
        <SelectField
          id={`${mode}-typeDniId`}
          label="Tipo de documento"
          value={formData.typeDniId}
          options={documentTypes}
          onChange={(event) => onFieldChange('typeDniId', event.target.value)}
          required
          disabled={isLoading || isMutating}
          error={errors.typeDniId}
        />
        <SelectField
          id={`${mode}-genderId`}
          label="Género"
          value={formData.genderId}
          options={genders}
          onChange={(event) => onFieldChange('genderId', event.target.value)}
          required
          disabled={isLoading || isMutating}
          error={errors.genderId}
        />
      </div>

      
      {isOperatorRoleId(formData.roleId) && (
        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Wrench className="size-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              Especialidades del operador
            </h3>
          </div>
          {specializationCategories.length > 0 && (
            <SelectField
              id={`${mode}-specialization-category`}
              label="Filtrar especialidades por categoría"
              value={specializationCategoryId}
              options={specializationCategories}
              placeholder="Todas las categorías"
              onChange={(event) =>
                setSpecializationCategoryId(event.target.value)
              }
              disabled={isLoading || isMutating}
            />
          )}
          <MultiSelectField
            id={`${mode}-specializationIds`}
            label="Especialidades"
            options={visibleSpecializations}
            value={formData.specializationIds}
            onChange={(value) => onFieldChange('specializationIds', value)}
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

      {errors.form && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {errors.form}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={isLoading || isMutating}>
          <Save className="size-4" />
          {isMutating ? 'Procesando...' : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={isMutating}
        >
          <RotateCcw className="size-4" />
          Limpiar formulario
        </Button>
      </div>
    </form>
  );
}
