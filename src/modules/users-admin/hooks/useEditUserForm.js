import { useMemo } from 'react';

import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';
import { mapUserToForm } from '@/modules/users-admin/data/userRepository';
import { useUserForm } from '@/modules/users-admin/hooks/useUserForm';
import { validateUserForm } from '@/modules/users-admin/utils/userFormValidation';

export function useEditUserForm(user) {
  const { users, updateUser } = useUserManagement();
  const initialData = useMemo(() => mapUserToForm(user), [user]);
  const form = useUserForm(initialData);

  const submitForm = async (event) => {
    event.preventDefault();
    if (!user) return null;

    const validationErrors = validateUserForm(form.formData, users, {
      mode: 'edit',
      currentUserId: user.id,
    });

    if (Object.keys(validationErrors).length > 0) {
      form.setErrors(validationErrors);
      form.setMessage('');
      return null;
    }

    try {
      const updatedUser = await updateUser(user.id, form.formData);
      form.setErrors({});
      form.setMessage(`${updatedUser.firstName} ${updatedUser.lastName} fue actualizado correctamente.`);
      return updatedUser;
    } catch (error) {
      form.setErrors({ form: error.message });
      form.setMessage('');
      return null;
    }
  };

  return {
    ...form,
    submitForm,
  };
}
