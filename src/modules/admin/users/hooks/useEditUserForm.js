import { useMemo } from 'react';

import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { mapUserToForm } from '@/modules/admin/users/data/userRepository';
import { useUserForm } from '@/modules/admin/users/hooks/useUserForm';
import { validateUserForm } from '@/modules/admin/users/utils/userFormValidation';

export function useEditUserForm(user) {
  const { users, updateUser } = useUserManagement();
  const initialData = useMemo(() => mapUserToForm(user), [user]);
  const form = useUserForm(initialData);

  const submitForm = (event) => {
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

    const updatedUser = updateUser(user.id, form.formData);
    form.setErrors({});
    form.setMessage(`${updatedUser.firstName} ${updatedUser.lastName} fue actualizado correctamente.`);
    return updatedUser;
  };

  return {
    ...form,
    submitForm,
  };
}
