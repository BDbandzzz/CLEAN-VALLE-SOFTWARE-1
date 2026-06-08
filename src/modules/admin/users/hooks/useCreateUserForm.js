import { INITIAL_USER_FORM } from '@/modules/admin/users/constants/userFormOptions';
import { useUserManagement } from '@/modules/admin/users/context/UserManagementContext';
import { useUserForm } from '@/modules/admin/users/hooks/useUserForm';
import { validateUserForm } from '@/modules/admin/users/utils/userFormValidation';

export function useCreateUserForm() {
  const { users, createUser } = useUserManagement();
  const form = useUserForm(INITIAL_USER_FORM);

  const submitForm = (event) => {
    event.preventDefault();
    const validationErrors = validateUserForm(form.formData, users, { mode: 'create' });

    if (Object.keys(validationErrors).length > 0) {
      form.setErrors(validationErrors);
      form.setMessage('');
      return null;
    }

    const createdUser = createUser(form.formData);
    form.setFormData(INITIAL_USER_FORM);
    form.setErrors({});
    form.setMessage(`${createdUser.firstName} ${createdUser.lastName} fue registrado correctamente.`);
    return createdUser;
  };

  return {
    ...form,
    submitForm,
  };
}
