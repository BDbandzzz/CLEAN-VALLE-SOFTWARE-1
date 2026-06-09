import { INITIAL_USER_FORM } from '@/modules/users-admin/constants/userFormOptions';
import { useUserManagement } from '@/modules/users-admin/context/UserManagementContext';
import { useUserForm } from '@/modules/users-admin/hooks/useUserForm';
import { validateUserForm } from '@/modules/users-admin/utils/userFormValidation';

export function useCreateUserForm() {
  const { users, createUser } = useUserManagement();
  const form = useUserForm(INITIAL_USER_FORM);

  const validateForm = () => {
    const validationErrors = validateUserForm(form.formData, users, { mode: 'create' });

    if (Object.keys(validationErrors).length > 0) {
      form.setErrors(validationErrors);
      form.setMessage('');
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return null;
    try {
      const createdUser = await createUser(form.formData);
      form.setFormData(INITIAL_USER_FORM);
      form.setErrors({});
      form.setMessage(`${createdUser.firstName} ${createdUser.lastName} fue registrado correctamente.`);
      return createdUser;
    } catch (error) {
      form.setErrors({ form: error.message });
      form.setMessage('');
      return null;
    }
  };

  return {
    ...form,
    validateForm,
    submitForm,
  };
}
